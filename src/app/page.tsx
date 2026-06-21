import Link from 'next/link'
import { ArrowRight, Bot, Zap, MessageSquare, ShieldCheck, Smartphone, CheckCircle2, ChevronRight, MessageCircle, Rocket } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LeadFlow AI - AI Receptionist For Local Businesses',
  description: 'Capture more leads with an AI receptionist that answers customer questions and collects contact details 24/7.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30">
      
      {/* Navigation */}
      <nav className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Bot className="text-blue-500" />
            LeadFlow AI
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/login" className="text-neutral-300 hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Section 1: Hero */}
        <section className="pt-24 pb-32 px-6 relative overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                LeadFlow AI Version 1.0 is Live
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                Never Miss Another <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Website Lead</span>
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-xl">
                Turn anonymous website visitors into qualified leads with an AI receptionist that answers questions and captures contact details 24/7.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40">
                  Start Free Trial <ArrowRight size={20} />
                </Link>
                <Link href="#demo" className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl border border-neutral-800 transition-colors flex items-center justify-center gap-2">
                  Watch Demo
                </Link>
              </div>
            </div>

            {/* Visual Widget Mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-3xl -z-10 blur-xl" />
              <div className="w-full max-w-md mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
                <div className="bg-blue-600 p-4 text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Receptionist</h3>
                    <p className="text-xs text-blue-100">Typically replies instantly</p>
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-neutral-950/50">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0"><Bot size={16} /></div>
                    <div className="bg-neutral-800 text-neutral-200 px-4 py-2 rounded-2xl rounded-tl-none text-sm max-w-[85%]">
                      Hi! I'm the virtual assistant. How can I help you today?
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-none text-sm max-w-[85%]">
                      I'm looking for a consultation.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0"><Bot size={16} /></div>
                    <div className="bg-neutral-800 text-neutral-200 px-4 py-2 rounded-2xl rounded-tl-none text-sm max-w-[85%]">
                      I can help you with that! Please provide your phone number so our team can reach out.
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-none text-sm max-w-[85%]">
                      555-0198
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0"><Bot size={16} /></div>
                    <div className="bg-neutral-800 text-neutral-200 px-4 py-2 rounded-2xl rounded-tl-none text-sm max-w-[85%]">
                      Thanks! We have captured your details. Our team will call you shortly.
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-neutral-900 border-t border-neutral-800">
                  <div className="bg-neutral-950 border border-neutral-800 rounded-full px-4 py-2 text-neutral-500 text-sm flex justify-between items-center">
                    Type a message... <ArrowRight size={16} className="text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Problem */}
        <section className="py-24 bg-neutral-900/50 border-y border-neutral-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Website Gets Visitors.<br/>Most Leave Without Contacting You.</h2>
              <p className="text-neutral-400 text-lg">Traditional contact forms are dead. Visitors expect instant answers. When they don't get them, they go to your competitors.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
                <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Missed Leads</h3>
                <p className="text-neutral-400 leading-relaxed">98% of website visitors leave without taking action. You pay for traffic but fail to capture their intent.</p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
                <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Slow Responses</h3>
                <p className="text-neutral-400 leading-relaxed">If you take more than 5 minutes to respond to an inquiry, the odds of converting them drop by 80%.</p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-6">
                  <Rocket size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Lost Revenue</h3>
                <p className="text-neutral-400 leading-relaxed">Every missed appointment, consultation, or quote request is direct revenue bleeding from your business.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: How It Works */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-neutral-400 text-lg">From zero to a fully trained AI receptionist in 5 minutes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Desktop connecting line */}
              <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900 -z-10" />

              {[
                { step: 1, title: 'Add Business Information', desc: 'Tell the AI your business name, hours, and basic details.' },
                { step: 2, title: 'Train AI With FAQs', desc: 'Input your exact answers to common customer questions.' },
                { step: 3, title: 'Install Widget', desc: 'Copy and paste a single line of code onto your website.' },
                { step: 4, title: 'Capture Leads Automatically', desc: 'Watch your dashboard fill up with qualified leads.' },
              ].map((item, i) => (
                <div key={i} className="relative pt-6 md:pt-0">
                  <div className="w-12 h-12 bg-neutral-950 border-2 border-blue-500 text-blue-500 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    {item.step}
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-neutral-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Features */}
        <section className="py-24 bg-neutral-900/50 border-y border-neutral-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Bot, title: 'AI Receptionist', desc: 'Powered by advanced Llama-3 models to hold natural conversations.' },
                { icon: MessageCircle, title: 'Lead Capture', desc: 'Automatically triggers lead forms when high intent is detected.' },
                { icon: Zap, title: 'Instant Responses', desc: 'Your customers get answers in milliseconds, 24/7/365.' },
                { icon: ShieldCheck, title: 'Business Knowledge Base', desc: 'Strictly bounded to only answer using your exact business facts.' },
                { icon: Rocket, title: 'Easy Deployment', desc: 'One line of JavaScript. Works on WordPress, Shopify, Webflow, and more.' },
                { icon: Smartphone, title: 'Mobile Friendly', desc: 'Beautiful, responsive chat UI that works perfectly on any device.' },
              ].map((f, i) => (
                <div key={i} className="bg-neutral-950 border border-neutral-800 p-6 rounded-xl hover:border-blue-500/50 transition-colors">
                  <f.icon className="text-blue-400 mb-4" size={28} />
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-neutral-400 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Live Demo */}
        <section id="demo" className="py-32 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-900/30 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">See It In Action</h2>
                <p className="text-neutral-300 text-lg mb-6 leading-relaxed">
                  LeadFlow AI isn't just a chatbot. It's a proactive lead generation machine. Notice how it seamlessly transitions from answering a simple question to booking an appointment.
                </p>
                <ul className="space-y-4">
                  {['Understands context perfectly', 'Pivots to lead capture', 'Saves the lead directly to your dashboard'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-neutral-300">
                      <CheckCircle2 className="text-blue-500" size={20} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-neutral-950 rounded-2xl p-6 border border-neutral-800 shadow-2xl">
                <div className="space-y-4 font-mono text-sm">
                  <div className="text-neutral-400 flex gap-4">
                    <span className="text-green-400 shrink-0">Visitor:</span>
                    <span>Do you offer dental implants?</span>
                  </div>
                  <div className="text-neutral-300 flex gap-4">
                    <span className="text-blue-400 shrink-0">AI Bot:</span>
                    <span>Yes. We offer dental implant consultations.</span>
                  </div>
                  <div className="text-neutral-400 flex gap-4">
                    <span className="text-green-400 shrink-0">Visitor:</span>
                    <span>Can I schedule an appointment?</span>
                  </div>
                  <div className="text-neutral-300 flex gap-4">
                    <span className="text-blue-400 shrink-0">AI Bot:</span>
                    <span>Absolutely. Please provide your phone number and our team will contact you shortly.</span>
                  </div>
                  <div className="p-4 bg-blue-950/30 border border-blue-900/50 rounded-lg text-blue-300 flex items-center justify-between">
                    <span>✨ Lead Capture Triggered</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Testimonials */}
        <section className="py-24 bg-neutral-900/50 border-y border-neutral-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Loved By Local Businesses</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { quote: "LeadFlow AI doubled our inbound consultations. It captures leads at 2 AM when we're asleep.", author: "Dr. Sarah Jenkins", role: "Dental Clinic Owner" },
                { quote: "Better response times mean happier clients. We no longer lose leads to other firms.", author: "Michael Chang", role: "Personal Injury Lawyer" },
                { quote: "We saw a 40% increase in appointments booked directly from our website in the first month.", author: "David Ross", role: "HVAC Services" },
              ].map((t, i) => (
                <div key={i} className="bg-neutral-950 p-8 rounded-2xl border border-neutral-800">
                  <div className="flex text-yellow-500 mb-4">
                    {[...Array(5)].map((_, j) => <span key={j}>★</span>)}
                  </div>
                  <p className="text-neutral-300 mb-6 italic">"{t.quote}"</p>
                  <div>
                    <p className="font-bold">{t.author}</p>
                    <p className="text-sm text-neutral-500">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Pricing */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-neutral-400 text-lg">Pick the perfect plan for your business needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { name: 'Starter', price: '$29', features: ['AI Chat Widget', 'Lead Capture', '500 Conversations/mo', 'Basic Support'] },
                { name: 'Pro', price: '$99', popular: true, features: ['Unlimited Conversations', 'Website Auto Training', 'Custom Widget Styling', 'Priority Support'] },
                { name: 'Agency', price: '$299', features: ['Multiple Businesses', 'White Label Widget', 'Team Access', 'API Access'] },
              ].map((plan, i) => (
                <div key={i} className={`bg-neutral-900 rounded-3xl p-8 border ${plan.popular ? 'border-blue-500 relative shadow-2xl shadow-blue-900/20' : 'border-neutral-800'} flex flex-col`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-neutral-500">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-neutral-300">
                        <CheckCircle2 className="text-blue-500 shrink-0" size={18} />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className={`block text-center py-3 rounded-xl font-medium transition-colors ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'}`}>
                    Book Demo
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 8: Final CTA */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-tr from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Start Capturing More Leads Today</h2>
              <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Install LeadFlow AI in minutes and never miss another opportunity to grow your business.
              </p>
              <Link href="/signup" className="inline-block px-8 py-4 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-xl transition-colors shadow-xl">
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg text-neutral-300">
            <Bot className="text-blue-500" size={20} />
            LeadFlow AI
          </div>
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} LeadFlow AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
