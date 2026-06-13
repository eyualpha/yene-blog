const CATEGORY_STYLES = {
  Technology: {
    gradient: "from-blue-600 via-blue-500 to-cyan-400",
    emoji: "🤖",
  },
  Programming: {
    gradient: "from-violet-600 via-purple-500 to-indigo-400",
    emoji: "💻",
  },
  Design: {
    gradient: "from-pink-500 via-rose-400 to-orange-300",
    emoji: "🎨",
  },
  Engineering: {
    gradient: "from-slate-600 via-gray-500 to-zinc-400",
    emoji: "⚙️",
  },
  Manufacturing: {
    gradient: "from-amber-600 via-orange-500 to-yellow-400",
    emoji: "🏭",
  },
  Sport: {
    gradient: "from-green-600 via-emerald-500 to-teal-400",
    emoji: "⚽",
  },
  Lifestyle: {
    gradient: "from-fuchsia-500 via-pink-400 to-rose-300",
    emoji: "✨",
  },
  Travel: {
    gradient: "from-sky-500 via-blue-400 to-cyan-300",
    emoji: "✈️",
  },
  Food: {
    gradient: "from-red-500 via-orange-400 to-amber-300",
    emoji: "🍽️",
  },
  Health: {
    gradient: "from-teal-500 via-green-400 to-lime-300",
    emoji: "💚",
  },
  Business: {
    gradient: "from-neutral-600 via-stone-500 to-gray-400",
    emoji: "📊",
  },
  Education: {
    gradient: "from-indigo-600 via-blue-500 to-sky-400",
    emoji: "📚",
  },
  Entertainment: {
    gradient: "from-purple-600 via-violet-500 to-fuchsia-400",
    emoji: "🎬",
  },
  Other: {
    gradient: "from-blue-700 via-blue-500 to-sky-400",
    emoji: "📝",
  },
};

export const getCategoryStyle = (category = "Other") =>
  CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;
