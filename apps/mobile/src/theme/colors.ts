/**
 * Dark theme colors matching the web app
 * Converted from OKLCH to hex values for React Native compatibility
 */
export const colors = {
  // Main background and surface colors
  background: '#1a1a1a', // Very dark background
  foreground: '#fafafa', // Light text on dark background
  card: '#2a2a2a', // Dark card background
  cardForeground: '#fafafa', // Light text on cards

  // Interactive elements
  primary: '#f0f0f0', // Light accent color
  primaryForeground: '#2a2a2a', // Dark text on light background
  secondary: '#3a3a3a', // Medium dark for secondary elements
  secondaryForeground: '#fafafa', // Light text on secondary

  // Text variants
  muted: '#3a3a3a', // Muted background
  mutedForeground: '#a0a0a0', // Muted text color

  // Borders and inputs
  border: 'rgba(255, 255, 255, 0.1)', // Subtle border
  input: 'rgba(255, 255, 255, 0.15)', // Input background

  // Status colors
  destructive: '#ef4444', // Red for delete/error actions
  success: '#22c55e', // Green for success
  warning: '#f59e0b', // Orange for warnings

  // Link-specific colors
  linkAccent: '#60a5fa', // Blue for links

  // Shadow colors for elevation
  shadowColor: '#000000',
} as const;

export type ColorKey = keyof typeof colors;
