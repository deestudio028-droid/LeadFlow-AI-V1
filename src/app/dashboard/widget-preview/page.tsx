import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Script from 'next/script'

export const dynamic = 'force-dynamic'

export default async function WidgetPreviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name, embed_token')
    .eq('owner_id', user.id)
    .limit(1)

  const business = businesses?.[0] || null

  if (!business || !business.embed_token) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-2">Widget Preview</h1>
        <div className="p-4 bg-red-950/50 border border-red-900 rounded-lg text-red-400 text-sm">
          You must complete your Business Settings to generate an embed token before previewing the widget.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative pb-32">
      <div>
        <h1 className="text-3xl font-bold mb-2">Widget Preview</h1>
        <p className="text-neutral-400">This is how your AI assistant will appear on your website. Test the interaction below.</p>
      </div>

      {/* Mock Website Container */}
      <div className="border border-neutral-800 rounded-xl overflow-hidden bg-white text-black min-h-[600px] relative shadow-2xl">
        {/* Mock Header */}
        <header className="px-8 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="text-2xl font-bold text-blue-600">{business.name}</div>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <span className="hover:text-blue-600 cursor-pointer">Services</span>
            <span className="hover:text-blue-600 cursor-pointer">About</span>
            <span className="hover:text-blue-600 cursor-pointer">Contact</span>
          </nav>
        </header>

        {/* Mock Hero Section */}
        <div className="px-8 py-20 text-center bg-gray-50">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900">Welcome to {business.name}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">We provide top-notch services tailored to your needs. Talk to our AI assistant in the bottom right corner if you have any questions or want to book an appointment.</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Get Started
          </button>
        </div>

        {/* Mock Features Section */}
        <div className="px-8 py-16 grid grid-cols-3 gap-8">
          <div className="p-6 border border-gray-100 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
            <p className="text-gray-600 text-sm">Experience the best quality services in the industry.</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">Our AI assistant is here to help you anytime, anywhere.</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">Easy Booking</h3>
            <p className="text-gray-600 text-sm">Schedule appointments instantly through our chat.</p>
          </div>
        </div>

        {/* 
          IMPORTANT:
          We load the widget.js dynamically.
          Because this is a mock preview, the script will execute and attach the widget
          to the document.body. Since we want it restricted, widget.js usually uses fixed positioning.
          For the preview, it will appear fixed on the user's dashboard screen! 
          This perfectly simulates the real experience.
        */}
        <Script 
          src="/widget.js" 
          data-token={business.embed_token}
          strategy="lazyOnload"
        />
      </div>
    </div>
  )
}
