export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  icon?: string;
}

export const themes: Record<string, Theme> = {
  // Theme xanh lá
  emerald: {
    name: 'Emerald Forest',
    primary: 'emerald',
    secondary: 'green',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-emerald-900',
    gradientTo: 'to-green-900',
    icon: '🌿'
  },

  // Theme xanh dương
  blue: {
    name: 'Ocean Blue',
    primary: 'cyan',
    secondary: 'blue',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-blue-900',
    gradientTo: 'to-indigo-900',
    icon: '🌊'
  },

  // Theme tím
  purple: {
    name: 'Purple Dream',
    primary: 'purple',
    secondary: 'violet',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-purple-900',
    gradientTo: 'to-indigo-900',
    icon: '🔮'
  },

  // Theme hồng
  rose: {
    name: 'Rose Gold',
    primary: 'rose',
    secondary: 'pink',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-rose-900',
    gradientTo: 'to-pink-900',
    icon: '🌹'
  },

  // Theme cam
  orange: {
    name: 'Sunset Glow',
    primary: 'orange',
    secondary: 'amber',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-orange-900',
    gradientTo: 'to-amber-900',
    icon: '🌅'
  },

  // Theme đỏ
  red: {
    name: 'Ruby Fire',
    primary: 'red',
    secondary: 'rose',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-red-900',
    gradientTo: 'to-rose-900',
    icon: '🔥'
  },

  // Theme vàng
  yellow: {
    name: 'Golden Sun',
    primary: 'yellow',
    secondary: 'amber',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-yellow-900',
    gradientTo: 'to-amber-900',
    icon: '☀️'
  },

  // Theme xanh mint
  teal: {
    name: 'Mint Fresh',
    primary: 'teal',
    secondary: 'cyan',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-teal-900',
    gradientTo: 'to-cyan-900',
    icon: '🍃'
  },

  // Theme xanh da trời
  sky: {
    name: 'Sky Blue',
    primary: 'sky',
    secondary: 'blue',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-sky-900',
    gradientTo: 'to-blue-900',
    icon: '☁️'
  },

  // Theme xám
  slate: {
    name: 'Silver Moon',
    primary: 'slate',
    secondary: 'gray',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-slate-800',
    gradientTo: 'to-gray-900',
    icon: '🌙'
  }
};

// Helper function to get theme colors for CSS classes
export const getThemeColors = (themeName: string) => {
  const theme = themes[themeName] || themes.emerald;
  
  return {
    primary: theme.primary,
    secondary: theme.secondary,
    classes: {
      bgGradient: `bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo}`,
      border: `border-${theme.primary}-500/20`,
      text: `text-${theme.primary}-300`,
      button: `bg-gradient-to-r from-${theme.primary}-500 to-${theme.secondary}-500`,
      buttonHover: `hover:from-${theme.primary}-600 hover:to-${theme.secondary}-600`,
      icon: `text-${theme.primary}-400`,
      accent: `text-${theme.primary}-200`
    }
  };
};