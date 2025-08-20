"use client";

const labels = [
  { name: "Instant Video Summaries", emoji: "📺" },
  { name: "Interactive AI Q&A", emoji: "🤖" },
  { name: "Jump to Key Moments", emoji: "⏱️" },
];

export default function Header() {
  return (
    <nav
      className="
  sticky top-0 z-40
  backdrop-blur-xl
  bg-gradient-to-r from-purple-900/80 via-purple-800/70 to-purple-900/80
  supports-[backdrop-filter]:bg-gray-900/60
  border-b border-white/10
  shadow-[0_8px_30px_rgba(0,0,0,0.25)]
"
    >
      <div className="flex h-16 items-center justify-between gap-5 pl-10 pr-10">
        {/* Brand */}
        <div
          role="img"
          aria-label="VidSense.ai home"
          className="flex items-center gap-3 "
        >
          <svg
            className="w-8 h-8 text-white bg-blue-500 rounded-full p-1"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5.14v13.72L19 12 8 5.14z" />
          </svg>

          <div className="leading-5">
            <div className="text-xl font-bold">
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Vid
              </span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Sense
              </span>
              <span className="text-gray-300 text-lg font-medium"> ai</span>
            </div>
            <div className="text-[11px] text-gray-400 font-medium tracking-wide">
              Understand YouTube videos faster with AI
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full bg-white/5 p-1 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <ul className="flex items-center gap-1.5">
              {labels.map(({ name, emoji }) => (
                <li key={name}>
                  <div
                    className="
              group select-none
              inline-flex items-center gap-1.5
              rounded-full px-3.5 py-1.5
              text-sm text-gray-200
              bg-white/5 ring-1 ring-white/10
              hover:bg-white/10 hover:ring-white/20
              transition-all duration-200
              hover:-translate-y-[1px]
              shadow-[0_0_0_0_rgba(0,0,0,0)]
              hover:shadow-[0_6px_20px_-6px_rgba(0,0,0,0.35)]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
            "
                    role="status"
                    aria-label={`${name} feature`}
                  >
                    <span
                      className="text-base"
                      aria-hidden="true"
                    >
                      {emoji}
                    </span>
                    <span className="tracking-wide">{name}</span>
                    {name === "AI Chat" && (
                      <span
                        className="
                  ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold
                  bg-gradient-to-r from-orange-400/90 to-pink-500/90 text-white
                  shadow-[0_1px_6px_rgba(255,99,71,0.35)]
                "
                      >
                        New
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
