/**
 * Paleta de colores personalizada para la app de viajes
 * Usando tonos naranjas y degradados para una estética moderna
 */

export const TravelColors = {
  // Colores principales
  primary: '#FF6B35',      // Naranja vibrante
  primaryDark: '#E55A2B',  // Naranja oscuro
  secondary: '#FF9F43',    // Naranja claro
  accent: '#FFA726',       // Naranja dorado
  
  // Degradados
  gradient: {
    start: '#FF6B35',
    end: '#FF9F43',
  },
  
  // Colores de fondo
  background: '#FAFBFC',
  cardBackground: '#FFFFFF',
  surface: '#F8F9FA',
  
  // Colores de texto
  textPrimary: '#2D3748',
  textSecondary: '#718096',
  textLight: '#A0AEC0',
  textOnPrimary: '#FFFFFF',
  
  // Colores de estado
  success: '#48BB78',
  warning: '#ED8936',
  error: '#F56565',
  info: '#4299E1',
  
  // Colores neutros
  gray50: '#F7FAFC',
  gray100: '#EDF2F7',
  gray200: '#E2E8F0',
  gray300: '#CBD5E0',
  gray400: '#A0AEC0',
  gray500: '#718096',
  gray600: '#4A5568',
  gray700: '#2D3748',
  gray800: '#1A202C',
  gray900: '#171923',
  
  // Colores para iconos de reservas
  flight: '#4299E1',
  hotel: '#E53E3E',
  transport: '#38A169',
  activity: '#D69E2E',
};

// Mantenemos la estructura original para compatibilidad
const tintColorLight = TravelColors.primary;
const tintColorDark = TravelColors.primary;

export const Colors = {
  light: {
    text: TravelColors.textPrimary,
    background: TravelColors.background,
    tint: tintColorLight,
    icon: TravelColors.textSecondary,
    tabIconDefault: TravelColors.textSecondary,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: TravelColors.textPrimary,
    background: TravelColors.background,
    tint: tintColorDark,
    icon: TravelColors.textSecondary,
    tabIconDefault: TravelColors.textSecondary,
    tabIconSelected: tintColorDark,
  },
};
