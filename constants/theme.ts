/**
 * ViajaPayá Design System
 *
 * A warm, travel-inspired design system with modern aesthetics.
 * Primary orange evokes adventure and excitement.
 */

// ─── Color Palette ───────────────────────────────────────────────────

export const Colors = {
  // Brand
  primary: '#FF6B35',
  primaryLight: '#FF8F66',
  primaryDark: '#E55A2B',
  primaryMuted: 'rgba(255, 107, 53, 0.12)',
  primaryMutedStrong: 'rgba(255, 107, 53, 0.20)',

  // Secondary (Deep navy — contrast & sophistication)
  secondary: '#1B2838',
  secondaryLight: '#2D3E50',
  secondaryMuted: 'rgba(27, 40, 56, 0.08)',

  // Accent (Tropical blue — freshness)
  accent: '#00B4D8',
  accentLight: '#48CAE4',
  accentDark: '#0096B7',
  accentMuted: 'rgba(0, 180, 216, 0.12)',

  // Backgrounds
  background: '#F5F6F8',
  backgroundAlt: '#EDEEF2',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  sheetBackground: '#FFFFFF',

  // Text
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textLink: '#FF6B35',

  // Borders & Dividers
  border: '#E5E7EB',
  borderLight: '#F0F1F3',
  divider: '#F0F1F3',

  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  successMuted: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningMuted: 'rgba(245, 158, 11, 0.12)',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorMuted: 'rgba(239, 68, 68, 0.12)',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  infoMuted: 'rgba(59, 130, 246, 0.12)',

  // Trip status badges
  tripUpcoming: '#3B82F6',
  tripOngoing: '#10B981',
  tripPast: '#9CA3AF',

  // Category colors (for transport, accommodation, etc.)
  categoryTransport: '#4299E1',
  categoryAccommodation: '#9F7AEA',
  categoryActivity: '#48BB78',
  categoryExpense: '#ED8936',
  categoryDocument: '#667EEA',
  categoryChecklist: '#ED64A6',
  categoryNote: '#ECC94B',

  // Overlay & Shadow
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',

  // Skeleton loading
  skeleton: '#E5E7EB',
  skeletonHighlight: '#F0F1F3',

  // Dark mode overrides (for future use)
  dark: {
    background: '#0F1117',
    backgroundAlt: '#1A1D27',
    card: '#1E2230',
    cardElevated: '#252A3A',
    text: '#F0F1F3',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    border: '#2D3344',
    borderLight: '#252A3A',
    divider: '#252A3A',
  },
} as const;

// ─── Typography ──────────────────────────────────────────────────────

export const FontSizes = {
  /** 10px — Labels, badges */
  xs: 10,
  /** 12px — Captions, metadata */
  sm: 12,
  /** 14px — Body small, secondary text */
  md: 14,
  /** 16px — Body, default */
  base: 16,
  /** 18px — Subtitles */
  lg: 18,
  /** 20px — Section headers */
  xl: 20,
  /** 24px — Page titles */
  '2xl': 24,
  /** 28px — Hero text */
  '3xl': 28,
  /** 34px — Display */
  '4xl': 34,
} as const;

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const LineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
};

/** Pre-composed text styles for consistency */
export const Typography = {
  displayLarge: {
    fontSize: FontSizes['4xl'],
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes['4xl'] * LineHeights.tight,
    color: Colors.text,
  },
  displayMedium: {
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes['3xl'] * LineHeights.tight,
    color: Colors.text,
  },
  heading1: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes['2xl'] * LineHeights.tight,
    color: Colors.text,
  },
  heading2: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.xl * LineHeights.tight,
    color: Colors.text,
  },
  heading3: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.lg * LineHeights.normal,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.base * LineHeights.normal,
    color: Colors.textSecondary,
  },
  body: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.base * LineHeights.relaxed,
    color: Colors.text,
  },
  bodySmall: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.md * LineHeights.relaxed,
    color: Colors.text,
  },
  caption: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.sm * LineHeights.normal,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.sm * LineHeights.normal,
    color: Colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  badge: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.xs * LineHeights.normal,
    letterSpacing: 0.3,
  },
  button: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.base * LineHeights.normal,
  },
  buttonSmall: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.md * LineHeights.normal,
  },
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────

export const Spacing = {
  /** 2px */
  '2xs': 2,
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  base: 16,
  /** 20px */
  lg: 20,
  /** 24px */
  xl: 24,
  /** 32px */
  '2xl': 32,
  /** 40px */
  '3xl': 40,
  /** 48px */
  '4xl': 48,
  /** 64px */
  '5xl': 64,
} as const;

// ─── Border Radius ───────────────────────────────────────────────────

export const BorderRadius = {
  /** 4px — Chips, small tags */
  xs: 4,
  /** 8px — Buttons, inputs */
  sm: 8,
  /** 12px — Cards */
  md: 12,
  /** 16px — Modals, sheets */
  lg: 16,
  /** 20px — Large containers */
  xl: 20,
  /** 24px — Hero cards */
  '2xl': 24,
  /** 9999px — Fully rounded (pills, avatars) */
  full: 9999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHover: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  fab: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;

// ─── Layout ──────────────────────────────────────────────────────────

export const Layout = {
  /** Horizontal padding for screen content */
  screenPaddingHorizontal: Spacing.lg,
  /** Top padding below safe area */
  screenPaddingTop: Spacing.base,
  /** Max width for content on tablets (future) */
  maxContentWidth: 600,
  /** Standard height for touch targets (iOS HIG / Material) */
  touchTargetSize: 44,
  /** Height for regular buttons */
  buttonHeight: 52,
  /** Height for small buttons */
  buttonHeightSmall: 40,
  /** Height for input fields */
  inputHeight: 52,
  /** Height for bottom tab bar */
  tabBarHeight: 64,
  /** FAB size */
  fabSize: 56,
  /** Icon sizes */
  iconSizeSmall: 16,
  iconSizeMedium: 20,
  iconSizeLarge: 24,
  iconSizeXL: 32,
  /** Avatar sizes */
  avatarSmall: 32,
  avatarMedium: 48,
  avatarLarge: 64,
  /** Card thumbnail size */
  thumbnailSmall: 40,
  thumbnailMedium: 56,
  thumbnailLarge: 80,
} as const;

// ─── Animation ───────────────────────────────────────────────────────

export const Animation = {
  /** Fast micro-interactions (button press, toggle) */
  fast: 150,
  /** Normal transitions (screen transitions, modals) */
  normal: 250,
  /** Slow/smooth transitions (page reveals, complex animations) */
  slow: 400,
  /** Spring config for bouncy feel */
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  /** Gentle spring for page transitions */
  springGentle: {
    damping: 20,
    stiffness: 120,
    mass: 1,
  },
} as const;

// ─── Z-Index ─────────────────────────────────────────────────────────

export const ZIndex = {
  base: 0,
  card: 1,
  sticky: 10,
  header: 20,
  dropdown: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
  tooltip: 70,
} as const;

// ─── Icon names mapping ──────────────────────────────────────────────
// Ionicons names used throughout the app for consistency

export const AppIcons = {
  // Navigation
  home: 'home',
  homeOutline: 'home-outline',
  wallet: 'wallet',
  walletOutline: 'wallet-outline',
  settings: 'settings',
  settingsOutline: 'settings-outline',
  back: 'chevron-back',
  forward: 'chevron-forward',
  close: 'close',
  menu: 'menu',

  // Actions
  add: 'add',
  addCircle: 'add-circle',
  edit: 'create-outline',
  delete: 'trash-outline',
  share: 'share-outline',
  search: 'search',
  filter: 'filter',
  sort: 'swap-vertical',
  copy: 'copy-outline',
  check: 'checkmark',
  checkCircle: 'checkmark-circle',

  // Trip related
  trip: 'airplane',
  tripOutline: 'airplane-outline',
  destination: 'location',
  calendar: 'calendar',
  calendarOutline: 'calendar-outline',
  clock: 'time-outline',
  countdown: 'hourglass-outline',

  // Sections
  timeline: 'list',
  transport: 'airplane',
  accommodation: 'bed',
  activity: 'ticket',
  budget: 'cash',
  checklist: 'checkbox',
  notes: 'document-text',
  documents: 'folder-open',
  personalDocs: 'id-card',

  // Transport types
  flight: 'airplane',
  train: 'train',
  bus: 'bus',
  ferry: 'boat',
  car: 'car',
  transfer: 'car-sport',

  // UI elements
  star: 'star',
  starOutline: 'star-outline',
  pin: 'pin',
  pinOutline: 'pin-outline',
  warning: 'warning',
  info: 'information-circle',
  camera: 'camera',
  image: 'image',
  attach: 'attach',
  qr: 'qr-code',
  map: 'map',
  call: 'call',
  mail: 'mail',
  globe: 'globe',
  chevronDown: 'chevron-down',
  chevronUp: 'chevron-up',
  chevronRight: 'chevron-forward',
  ellipsis: 'ellipsis-horizontal',
  empty: 'compass-outline',
} as const;

// ─── Theme export ────────────────────────────────────────────────────

const Theme = {
  Colors,
  FontSizes,
  FontWeights,
  LineHeights,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Layout,
  Animation,
  ZIndex,
  AppIcons,
} as const;

export default Theme;
