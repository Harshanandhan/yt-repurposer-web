export default function HeroVisual() {
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center gap-3 mt-6">

      {/* YouTube card */}
      <div className="flex-1 bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
        {/* Fake video thumbnail */}
        <div className="bg-black/30 aspect-video flex items-center justify-center relative">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6 4l10 5-10 5V4z" fill="white"/>
            </svg>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
            12:34
          </div>
        </div>
        <div className="p-3">
          <div className="h-2.5 bg-white/20 rounded-full w-4/5 mb-2" />
          <div className="h-2 bg-white/10 rounded-full w-3/5" />
          <div className="flex items-center gap-2 mt-2.5">
            <div className="w-5 h-5 rounded-full bg-white/20" />
            <div className="h-2 bg-white/10 rounded-full w-20" />
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-white/60 text-xs font-medium">AI</span>
      </div>

      {/* LinkedIn post mockup */}
      <div className="flex-1 bg-white rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500" />
          <div>
            <div className="h-2.5 bg-gray-200 rounded-full w-24 mb-1" />
            <div className="h-2 bg-gray-100 rounded-full w-16" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-800 rounded-full w-full" />
          <div className="h-2 bg-gray-600 rounded-full w-5/6" />
          <div className="h-2 bg-gray-600 rounded-full w-4/6" />
          <div className="h-2 bg-gray-400 rounded-full w-5/6" />
          <div className="h-2 bg-gray-400 rounded-full w-3/6" />
        </div>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2C4.24 2 2 4.24 2 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm.5 7.5h-1v-4h1v4zm0-5h-1V3.5h1V4.5z" fill="#6b7280"/></svg>
            <div className="h-2 bg-gray-200 rounded-full w-6" />
          </div>
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10.5l2.5-2.5H2V2h10v6H7L4.5 10.5H2z" stroke="#6b7280" strokeWidth="1.2"/></svg>
            <div className="h-2 bg-gray-200 rounded-full w-4" />
          </div>
        </div>
      </div>

    </div>
  );
}
