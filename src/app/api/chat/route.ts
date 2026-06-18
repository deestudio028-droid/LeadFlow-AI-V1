import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// We use the admin client or a regular client for the API route.
// Since this is a public endpoint called by the widget, we can use the anon key 
// BUT we must bypass RLS if needed, or rely on the RLS "Public can read active business by embed_token"
// Let's use the standard anon client since RLS allows reading active businesses.

export const dynamic = 'force-dynamic'

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

    // MANDATORY HALLUCINATION PREVENTION
    systemPrompt += `\n\nYou may only answer using the provided business details and knowledge base.\nIf the information is not available, politely tell the user that you do not know and ask them to contact the business directly.\nDo not invent information.`

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

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

    if (!response.ok) {
      console.error('NVIDIA API Error:', await response.text())
      return NextResponse.json({ error: 'Failed to generate AI response' }, { 
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      })
    }

    const data = await response.json()
    const botResponse = data.choices[0].message.content

    // Log the conversation (Requires "Public can insert chat logs" policy to be satisfied)
    // The policy is: EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = chat_logs.business_id AND businesses.is_active = true)
    // We already verified the business is active.
    if (messages.length > 0) {
      const userMessage = messages[messages.length - 1].content
      // We wrap logging in try/catch to not fail the chat response if logging fails
      try {
        await supabase.from('chat_logs').insert([{
          business_id: business.id,
          user_message: userMessage,
          bot_response: botResponse
        }])
      } catch (logErr) {
        console.error("Failed to log chat:", logErr)
      }
    }

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
