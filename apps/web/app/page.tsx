import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/8 px-6 py-4 flex justify-between items-center bg-[#111111]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-400 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">FormKraft</span>
        </div>
        <div className="flex gap-2">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition px-4 py-2 rounded-xl hover:bg-white/5">
            Sign in
          </Link>
          <Link href="/register" className="text-sm bg-teal-400 hover:bg-teal-300 text-[#111111] font-semibold px-4 py-2 rounded-xl transition">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className="text-xs text-zinc-400">Free plan — 3 forms included</span>
          </div>

          <h1 className="text-6xl font-bold text-white leading-tight mb-6 tracking-tight">
            Build forms that<br />
            <span className="text-teal-400">actually work.</span>
          </h1>

          <p className="text-zinc-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Create, share, and collect responses without writing code.
            Drag, drop, publish — done in minutes.
          </p>

          <div className="flex gap-3 justify-center mb-20">
            <Link href="/register" className="bg-teal-400 hover:bg-teal-300 text-[#111111] font-semibold text-sm px-6 py-3 rounded-xl transition">
              Start building for free →
            </Link>
            <Link href="/login" className="text-sm text-zinc-400 border border-white/10 px-6 py-3 rounded-xl hover:bg-white/5 transition">
              Sign in
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-16">
            {[
              {
                icon: (
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                ),
                title: 'Drag & Drop Builder',
                desc: 'Reorder fields effortlessly. Text, MCQ, Rating, and File Upload — all supported.'
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ),
                title: 'Conditional Logic',
                desc: 'Show or hide fields based on previous answers. Build smart, dynamic forms.'
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Response Dashboard',
                desc: 'All submissions in one place. View, track, and analyze responses easily.'
              },
            ].map(f => (
              <div key={f.title} className="border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all">
                <div className="w-9 h-9 bg-teal-400/10 border border-teal-400/20 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <p className="text-white font-semibold text-sm mb-2">{f.title}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="border border-white/8 rounded-2xl p-6 text-left">
              <p className="text-white font-semibold mb-1">Free</p>
              <p className="text-3xl font-bold text-white mb-4">₹0 <span className="text-sm font-normal text-zinc-500">forever</span></p>
              {['Up to 3 forms', 'All field types', 'Public sharing', 'Response tracking'].map(f => (
                <div key={f} className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-400 text-sm">{f}</span>
                </div>
              ))}
              <Link href="/register" className="mt-4 block text-center border border-white/10 text-zinc-400 text-sm py-2.5 rounded-xl hover:bg-white/5 transition">
                Get started free
              </Link>
            </div>

            <div className="border border-teal-400/30 bg-teal-400/5 rounded-2xl p-6 text-left relative">
              <div className="absolute top-4 right-4 text-xs bg-teal-400 text-[#111111] font-bold px-2 py-0.5 rounded-full">PRO</div>
              <p className="text-white font-semibold mb-1">Pro</p>
              <p className="text-3xl font-bold text-white mb-4">₹499 <span className="text-sm font-normal text-zinc-500">one-time</span></p>
              {['Unlimited forms', 'All field types', 'Public sharing', 'Response tracking', 'Priority support'].map(f => (
                <div key={f} className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-400 text-sm">{f}</span>
                </div>
              ))}
              <Link href="/register" className="mt-4 block text-center bg-teal-400 hover:bg-teal-300 text-[#111111] font-semibold text-sm py-2.5 rounded-xl transition">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/8 px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-teal-400 flex items-center justify-center">
            <svg className="w-3 h-3 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-zinc-500 text-xs">FormKraft</span>
        </div>
        <p className="text-zinc-700 text-xs">© 2026 FormKraft. Built by Suyash Rao.</p>
      </footer>
    </div>
  );
}