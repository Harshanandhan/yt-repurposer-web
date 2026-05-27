const PREVIEWS: Record<string, { content: string; highlight: string }> = {
  story: {
    highlight: "Personal & relatable",
    content: `3 years ago I quit my job with $500 in my bank account.

Everyone said it was reckless. Maybe it was.

But here's what they didn't tell you about going all-in on yourself — the fear doesn't go away. You just get better at moving with it.

The lesson? Comfort is the enemy of growth.

#Entrepreneurship #Mindset #Growth`,
  },
  insight: {
    highlight: "Bold & contrarian",
    content: `Most people think productivity is about doing more.

It's not.

The highest performers I know work fewer hours than anyone in their industry. They're just ruthlessly focused on the 20% that drives 80% of results.

Stop optimising your schedule. Start optimising your decisions.

#Productivity #Leadership`,
  },
  listicle: {
    highlight: "Easy to scan",
    content: `5 things I wish I knew before building my first product:

1. Ship before you're ready — perfection kills momentum
2. Talk to 10 customers before writing a line of code
3. Pricing too low is riskier than pricing too high
4. Distribution beats product every single time
5. Your first 100 users teach you everything

What would you add to this list?

#Startups #ProductManagement`,
  },
  hot_take: {
    highlight: "Sparks debate",
    content: `Hustle culture is quietly destroying an entire generation of entrepreneurs.

Working 80-hour weeks isn't a badge of honour. It's a warning sign.

The best founders I know protect their weekends like boardroom meetings. Because rest is a competitive advantage — not a weakness.

Disagree? I'd love to hear why.

#Leadership #StartupLife`,
  },
  how_to: {
    highlight: "Actionable steps",
    content: `How to go from idea to first customer in 30 days:

1️⃣ Write down the exact problem you're solving
2️⃣ Find 20 people who have that problem
3️⃣ Interview 10 of them this week
4️⃣ Build the smallest version that solves it
5️⃣ Charge money from day one — free users give bad feedback
6️⃣ Iterate weekly based on what real users say

The goal isn't a perfect product. It's a paying customer.

#Entrepreneurship #Startups`,
  },
};

const BADGE: Record<string, string> = {
  story:    "bg-blue-50 text-blue-700 border-blue-200",
  insight:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  listicle: "bg-amber-50 text-amber-700 border-amber-200",
  hot_take: "bg-red-50 text-red-700 border-red-200",
  how_to:   "bg-violet-50 text-violet-700 border-violet-200",
};

const ACCENT: Record<string, string> = {
  story:    "border-l-blue-400",
  insight:  "border-l-emerald-400",
  listicle: "border-l-amber-400",
  hot_take: "border-l-red-400",
  how_to:   "border-l-violet-400",
};

interface Props {
  name: string;
  label: string;
  proOnly: boolean;
}

export default function StylePreviewCard({ name, label, proOnly }: Props) {
  const preview = PREVIEWS[name];
  if (!preview) return null;

  return (
    <div className={`bg-white border border-gray-200 border-l-4 ${ACCENT[name]} rounded-2xl overflow-hidden hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${BADGE[name]}`}>
            {label}
          </span>
          <span className="text-xs text-gray-400">{preview.highlight}</span>
        </div>
        {proOnly ? (
          <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">Pro</span>
        ) : (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">Free</span>
        )}
      </div>

      {/* Fake LinkedIn post */}
      <div className="p-5">
        {/* Profile row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Your Name</p>
            <p className="text-xs text-gray-400">Content Creator · 2nd</p>
          </div>
        </div>
        {/* Post content */}
        <p className="text-sm text-gray-800 leading-6 whitespace-pre-wrap line-clamp-6">{preview.content}</p>
        <p className="text-xs text-indigo-500 mt-1 cursor-pointer hover:underline">...see more</p>

        {/* Reactions row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <span className="text-base">👍</span>
            <span className="text-base">🙌</span>
            <span className="text-xs text-gray-400 ml-1">247</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>42 comments</span>
            <span>18 reposts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
