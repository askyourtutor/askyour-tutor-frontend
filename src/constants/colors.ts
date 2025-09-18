// Color constants for AskYourTutor platform
// Based on modern education platform design patterns

export const colors = {
  // Primary brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary blue
    600: '#2563eb', // Primary blue (darker)
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Secondary colors
  secondary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Secondary green
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Accent colors (orange/yellow for highlights)
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Main accent orange
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Neutral colors (grays)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Semantic colors
  success: {
    light: '#d1fae5',
    DEFAULT: '#10b981',
    dark: '#047857',
  },

  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },

  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },

  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#1d4ed8',
  },

  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
  },

  // Text colors
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#64748b',
    inverse: '#ffffff',
  },

  // Border colors
  border: {
    light: '#f1f5f9',
    DEFAULT: '#e2e8f0',
    dark: '#cbd5e1',
  },

  // Surface colors (for cards, modals, etc.)
  surface: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    elevated: '#ffffff',
  },
} as const;

// Convenience exports for commonly used colors
export const brandColors = {
  primary: colors.primary[600],
  primaryHover: colors.primary[700],
  secondary: colors.secondary[600],
  accent: colors.accent[500],
  background: colors.background.primary,
  text: colors.text.primary,
  textMuted: colors.text.muted,
  border: colors.border.DEFAULT,
} as const;

// Color utility functions
export const getColorWithOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

export const isDarkColor = (color: string): boolean => {
  // Simple check for dark colors (you can enhance this)
  const darkColors = [
    colors.neutral[700],
    colors.neutral[800], 
    colors.neutral[900],
    colors.primary[800],
    colors.primary[900],
  ];
  return darkColors.includes(color as any);
};
