import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// We use the admin client or a regular client for the API route.
// Since this is a public endpoint called by the widget, we can use the anon key 
// BUT we must bypass RLS if needed, or rely on the RLS "Public can read active business by embed_token"
// Let's use the standard anon client since RLS allows reading active businesses.
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// Simple in-memory rate limiter (per Edge container)
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();
const RATE_LIMIT_MAX = 20; // 20 requests per minute
const RATE_LIMIT_WINDOW_MS = 60000;

// Handle CORS for external widgets
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: Request) {
  try {
    const { messages, token } = await request.json()

    if (!token || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid payload' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      })
    }

    // Rate Limiting Logic
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    const rateData = rateLimitMap.get(ip)

    if (rateData && now < rateData.resetAt) {
      if (rateData.count >= RATE_LIMIT_MAX) {
        // Log to audit logs if this is the first time we block them in this window (to avoid spamming logs)
        if (rateData.count === RATE_LIMIT_MAX) {
          const adminClient = createAdminClient()
          await adminClient.from('audit_logs').insert({
            action: 'RATE_LIMIT_EXCEEDED',
            target_type: 'System',
            details: { ip, endpoint: '/api/chat', token }
          })
        }
        rateLimitMap.set(ip, { ...rateData, count: rateData.count + 1 })
        
        return NextResponse.json({ error: 'Too many requests' }, { 
          status: 429,
          headers: { 'Access-Control-Allow-Origin': '*' }
        })
      }
      rateLimitMap.set(ip, { count: rateData.count + 1, resetAt: rateData.resetAt })
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    }

    // Initialize Supabase anon client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Find business by token
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('embed_token', token)
      .eq('is_active', true)
      .limit(1)

    const business = businesses?.[0] || null

    if (!business || businessError) {
      return NextResponse.json({ error: 'Invalid or inactive business token' }, { 
        status: 401,
        headers: { 'Access-Control-Allow-Origin': '*' }
      })
    }

    // Fetch Knowledge Base
    const { data: faqs } = await supabase
      .from('knowledge_base')
      .select('title, content')
      .eq('business_id', business.id)

    // Build System Prompt
    let systemPrompt = `You are the AI assistant for ${business.name}.\n\n`
    systemPrompt += `Business Details:\n`
    if (business.description) systemPrompt += `- Description: ${business.description}\n`
    if (business.phone) systemPrompt += `- Phone: ${business.phone}\n`
    if (business.email) systemPrompt += `- Email: ${business.email}\n`
    if (business.address) systemPrompt += `- Address: ${business.address}\n`
    if (business.business_hours) systemPrompt += `- Hours: ${business.business_hours}\n`
    
    if (faqs && faqs.length > 0) {
      systemPrompt += `\nFAQs:\n`
      faqs.forEach((faq: any) => {
        systemPrompt += `Q: ${faq.title}\nA: ${faq.content}\n\n`
      })
    }

    if (business.system_prompt) {
      systemPrompt += `\nCustom Instructions: ${business.system_prompt}\n`
    }

    // ULTRA STRICT HALLUCINATION GUARD
    systemPrompt += `\n\nSYSTEM RULES:
You are NOT a general AI assistant. You are ONLY a business assistant.
You MUST NOT answer general knowledge, history, geography, celebrity, sports, politics, science, technology, or current events questions.

Before generating a response, follow this logic:
Step 1: Check whether the exact answer exists in the provided business information, knowledge base, or FAQ data.
Step 2: 
- If the information exists, answer normally based ONLY on the provided context.
- If the information DOES NOT exist, you MUST return EXACTLY this string and nothing else:
"I don't have information about that topic. Please contact the business directly for assistance."

Do not add guesses, assumptions, suggestions, alternative explanations, or external facts. Do not say "I think" or "possibly".
If the user asks who Virat Kohli or Elon Musk is, or the capital of France, return EXACTLY the fallback response.`

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    const startTime = Date.now()

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: apiMessages,
        temperature: 0.2,
        max_tokens: 500,
      })
    })

    const endTime = Date.now()
    const responseTime = endTime - startTime

    if (!response.ok) {
      console.error('Primary NVIDIA API Error:', await response.text())
      
      // FAILOVER LOGIC
      if (response.status === 429 || response.status === 401) {
        console.warn('Attempting failover to Backup Key...')
        const adminClient = createAdminClient()
        
        // Log Audit Event
        await adminClient.from('audit_logs').insert({
          action: 'API_KEY_FAILOVER',
          target_type: 'System',
          details: { reason: `Primary key returned ${response.status}`, business_id: business.id }
        })

        // Retry with backup key
        if (process.env.NVIDIA_API_KEY_BACKUP) {
          const startTimeBackup = Date.now()
          const backupResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NVIDIA_API_KEY_BACKUP}`
            },
            body: JSON.stringify({
              model: 'meta/llama-3.1-8b-instruct',
              messages: apiMessages,
              temperature: 0.2,
              max_tokens: 500,
            })
          })

          const backupTime = Date.now() - startTimeBackup

          if (!backupResponse.ok) {
            // Log failed backup request
            await supabase.from('api_requests_log').insert({
              business_id: business.id,
              endpoint: 'chat/completions (backup)',
              status_code: backupResponse.status,
              response_time_ms: backupTime,
              error_message: await backupResponse.text()
            })

            return NextResponse.json({ error: 'Failed to generate AI response (Backup Failed)' }, { 
              status: 500,
              headers: { 'Access-Control-Allow-Origin': '*' }
            })
          }

          const data = await backupResponse.json()
          
          // Log successful backup request
          await supabase.from('api_requests_log').insert({
            business_id: business.id,
            endpoint: 'chat/completions (backup)',
            status_code: backupResponse.status,
            response_time_ms: backupTime,
            prompt_tokens: data.usage?.prompt_tokens || 0,
            completion_tokens: data.usage?.completion_tokens || 0,
            total_tokens: data.usage?.total_tokens || 0
          })

          const botResponse = data.choices[0].message.content
          await logChat(business.id, messages, botResponse, supabase)

          return NextResponse.json({ response: botResponse }, {
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' }
          })
        }
      }

      // Log failed primary request
      await supabase.from('api_requests_log').insert({
        business_id: business.id,
        endpoint: 'chat/completions',
        status_code: response.status,
        response_time_ms: responseTime,
        error_message: 'Primary API Error'
      })

      return NextResponse.json({ error: 'Failed to generate AI response' }, { 
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      })
    }

    const data = await response.json()
    const botResponse = data.choices[0].message.content

    // Log successful primary request
    await supabase.from('api_requests_log').insert({
      business_id: business.id,
      endpoint: 'chat/completions',
      status_code: response.status,
      response_time_ms: responseTime,
      prompt_tokens: data.usage?.prompt_tokens || 0,
      completion_tokens: data.usage?.completion_tokens || 0,
      total_tokens: data.usage?.total_tokens || 0
    })

    await logChat(business.id, messages, botResponse, supabase)

    return NextResponse.json({ response: botResponse }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })

  } catch (error) {
    console.error('Chat API Route Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  }
}

async function logChat(businessId: string, messages: any[], botResponse: string, supabase: any) {
  if (messages.length > 0) {
    const userMessage = messages[messages.length - 1].content
    try {
      await supabase.from('chat_logs').insert([{
        business_id: businessId,
        user_message: userMessage,
        bot_response: botResponse
      }])
    } catch (logErr) {
      console.error("Failed to log chat:", logErr)
    }
  }
}
