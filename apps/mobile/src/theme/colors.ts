/**
 * Woodsy papyrus theme colors matching the Stashl.ink mascot
 * Based on warm browns, teals, and cream backgrounds for a natural feel
 */
export const colors = {
  // Main background and surface colors
  background: '#f5f5dc', // Cream/beige background
  foreground: '#3d2914', // Dark brown text
  card: '#ede4d3', // Light tan card background
  cardForeground: '#3d2914', // Dark brown text on cards

  // Interactive elements
  primary: '#2b5f5f', // Deep teal for primary actions
  primaryForeground: '#f5f5dc', // Cream text on teal
  secondary: '#d2b48c', // Warm tan for secondary elements
  secondaryForeground: '#3d2914', // Dark brown text on tan

  // Text variants
  muted: '#d2b48c', // Warm tan muted background  
  mutedForeground: '#8b6914', // Medium brown muted text

  // Borders and inputs
  border: 'rgba(61, 41, 20, 0.2)', // Subtle brown border
  input: 'rgba(61, 41, 20, 0.1)', // Light brown input background

  // Status colors
  destructive: '#cd853f', // Muted orange-brown for delete actions
  success: '#6b8e23', // Olive green for success
  warning: '#ff6347', // Tomato orange for warnings

  // Link-specific colors
  linkAccent: '#ff4500', // Bright orange accent from mascot

  // Shadow colors for elevation
  shadowColor: '#3d2914',
} as const;

export type ColorKey = keyof typeof colors;
