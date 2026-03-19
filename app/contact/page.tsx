import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const info = [
    { icon: Mail, label: 'Email', value: 'clothananya@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+91 72969 36485' },
    { icon: MapPin, label: 'Boutique', value: 'Jaipur, Rajasthan, India' },
  ];

  return (
    <div className="pb-32 bg-lavender-bg min-h-screen">
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-12">Contact Us</h1>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Info cards */}
          <div className="lg:w-1/3 space-y-4">
            <h2 className="text-2xl font-serif font-bold mb-8">Get in Touch</h2>
            {info.map(item => (
              <div key={item.label}
                className="bg-white p-6 rounded-3xl flex items-center gap-4 border border-luxury-border hover:border-royal-purple transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-lavender-bg flex items-center justify-center text-royal-purple group-hover:bg-royal-purple group-hover:text-white transition-colors">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text">{item.label}</p>
                  <p className="text-sm font-bold text-primary-text">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:w-2/3">
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-luxury-border">
              <h2 className="text-2xl font-serif font-bold mb-8">Send a Message</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text ml-4">Full Name</label>
                    <input type="text" placeholder="Your name" className="w-full bg-lavender-bg rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-royal-purple/20 text-sm border-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text ml-4">Email Address</label>
                    <input type="email" placeholder="Your email" className="w-full bg-lavender-bg rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-royal-purple/20 text-sm border-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text ml-4">Subject</label>
                  <input type="text" placeholder="What is this regarding?" className="w-full bg-lavender-bg rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-royal-purple/20 text-sm border-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text ml-4">Message</label>
                  <textarea rows={4} placeholder="How can we help you?" className="w-full bg-lavender-bg rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-royal-purple/20 text-sm border-none resize-none" />
                </div>
                <button className="w-full md:w-auto md:px-12 bg-royal-purple text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-royal-purple/20 hover:opacity-90 transition-opacity">
                  Send Message <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
