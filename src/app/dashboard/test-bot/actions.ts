'use server'

import { createClient } from '@/lib/supabase/server'

export async function sendChatMessage(businessId: string, messages: { role: string, content: string }[]) {
  const supabase = await createClient()

  // Verify the business belongs to the user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .eq('owner_id', user.id)
    .single()

  if (!business) return { error: 'Business not found' }

  // Fetch FAQs
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

  systemPrompt += `\nOnly answer based on the provided business information. If you don't know the answer, politely state that you don't have that information and offer to collect their contact details.`

  // Prepare payload for NVIDIA API
  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ]

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct', // Using a fast, standard model
        messages: apiMessages,
        temperature: 0.2,
        max_tokens: 500,
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('NVIDIA API Error:', errorText)
      return { error: 'Failed to generate response from AI provider' }
    }

    const data = await response.json()
    const botResponse = data.choices[0].message.content

    // Log the conversation
    const userMessage = messages[messages.length - 1].content
    await supabase.from('chat_logs').insert([{
      business_id: business.id,
      user_message: userMessage,
      bot_response: botResponse
    }])

    return { response: botResponse }
  } catch (err: any) {
    console.error('Error calling NVIDIA API:', err)
    return { error: 'Internal Server Error' }
  }
}
