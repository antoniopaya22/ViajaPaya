export type ColorScheme = 'light' | 'dark';

export const palette = {
  teal50: '#EDFBF9',
  teal100: '#D2F5EF',
  teal400: '#2DD4BF',
  teal500: '#14B8A6',
  teal600: '#0D9488',
  teal700: '#0B7A70',

  coral300: '#FF9C8F',
  coral400: '#FF8577',
  coral500: '#FF6B5B',
  coral600: '#F1503F',

  navy900: '#0B0D14',
  navy800: '#141422',
  navy700: '#1C1F2E',
  navy600: '#242840',
  navy500: '#2C3048',

  slate50: '#F7F8FB',
  slate100: '#EEF1F6',
  slate200: '#E2E5EC',
  slate300: '#C7CCD9',
  slate400: '#8B93A1',
  slate500: '#5B6472',
  slate600: '#3B4250',
  slate900: '#12141C',

  white: '#FFFFFF',
  black: '#000000',

  green500: '#16A34A',
  green400: '#4ADE80',
  amber500: '#D97706',
  amber400: '#FBBF24',
  red500: '#DC2626',
  red400: '#F87171',
  blue500: '#2563EB',
  blue400: '#60A5FA',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderStrong: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  primary: string;
  primaryMuted: string;
  onPrimary: string;
  gradientFrom: string;
  gradientTo: string;

  accent: string;
  onAccent: string;

  success: string;
  warning: string;
  danger: string;
  info: string;

  overlay: string;
}

export const Colors: Record<ColorScheme, ThemeColors> = {
  light: {
    background: palette.slate50,
    surface: palette.white,
    surfaceAlt: palette.slate100,
    border: palette.slate200,
    borderStrong: palette.slate300,

    textPrimary: palette.slate900,
    textSecondary: palette.slate500,
    textTertiary: palette.slate400,
    textInverse: palette.white,

    primary: palette.teal600,
    primaryMuted: palette.teal100,
    onPrimary: palette.white,
    gradientFrom: palette.teal500,
    gradientTo: palette.teal700,

    accent: palette.coral500,
    onAccent: palette.white,

    success: palette.green500,
    warning: palette.amber500,
    danger: palette.red500,
    info: palette.blue500,

    overlay: 'rgba(11, 13, 20, 0.5)',
  },
  dark: {
    background: palette.navy900,
    surface: palette.navy700,
    surfaceAlt: palette.navy600,
    border: palette.navy500,
    borderStrong: palette.slate600,

    textPrimary: '#F5F6FA',
    textSecondary: '#A7ADBE',
    textTertiary: '#6E7486',
    textInverse: palette.slate900,

    primary: palette.teal400,
    primaryMuted: 'rgba(45, 212, 191, 0.16)',
    onPrimary: palette.navy900,
    gradientFrom: palette.teal400,
    gradientTo: palette.teal600,

    accent: palette.coral400,
    onAccent: palette.navy900,

    success: palette.green400,
    warning: palette.amber400,
    danger: palette.red400,
    info: palette.blue400,

    overlay: 'rgba(0, 0, 0, 0.6)',
  },
};
