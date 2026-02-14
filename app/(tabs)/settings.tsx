import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Linking, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Layout } from "@/constants/theme";
import { clearAllData } from "@/services/storage";
import WaveHeader from "@/components/ui/WaveHeader";

// ─── Settings row types ──────────────────────────────────────────────

type SettingsRowType = "toggle" | "navigation" | "action" | "info";

interface SettingsRow {
  id: string;
  type: SettingsRowType;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  description?: string;
  value?: boolean;
  infoValue?: string;
  destructive?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

interface SettingsSection {
  title: string;
  rows: SettingsRow[];
}

// ─── Component ───────────────────────────────────────────────────────

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  // Preference states
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState("EUR");

  // ─── Handlers ───────────────────────────────────────────────────

  const handleClearData = () => {
    Alert.alert(
      "Borrar todos los datos",
      "¿Estás seguro? Se eliminarán todos los viajes, documentos y ajustes. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar todo",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert("Datos eliminados", "Todos los datos han sido borrados correctamente.");
            } catch (error) {
              Alert.alert("Error", "No se pudieron borrar los datos.");
            }
          },
        },
      ],
    );
  };

  const handleExportData = () => {
    Alert.alert("Exportar datos", "Esta funcionalidad estará disponible próximamente.");
  };

  const handleRateApp = () => {
    Alert.alert("Valorar app", "Gracias por tu interés. El enlace estará disponible cuando la app se publique.");
  };

  const handleContactSupport = () => {
    Linking.openURL("mailto:soporte@viajapaya.app?subject=ViajaPayá - Soporte");
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      "Política de privacidad",
      "Tus datos se almacenan únicamente en tu dispositivo. No recopilamos ni enviamos información personal a ningún servidor.",
    );
  };

  const handleTermsOfService = () => {
    Alert.alert("Términos de servicio", "Los términos de servicio estarán disponibles próximamente.");
  };

  const handleSelectCurrency = () => {
    Alert.alert(
      "Moneda predeterminada",
      "Actualmente configurada como EUR. El selector de moneda estará disponible próximamente.",
    );
  };

  // ─── Sections definition ────────────────────────────────────────

  const sections: SettingsSection[] = [
    {
      title: "Preferencias",
      rows: [
        {
          id: "dark_mode",
          type: "toggle",
          icon: "moon-outline",
          iconColor: "#667EEA",
          label: "Modo oscuro",
          description: "Tema oscuro para la interfaz",
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          id: "notifications",
          type: "toggle",
          icon: "notifications-outline",
          iconColor: "#F56565",
          label: "Notificaciones",
          description: "Recordatorios de viajes y actividades",
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: "haptics",
          type: "toggle",
          icon: "phone-portrait-outline",
          iconColor: "#48BB78",
          label: "Vibración",
          description: "Respuesta háptica al interactuar",
          value: haptics,
          onToggle: setHaptics,
        },
        {
          id: "currency",
          type: "navigation",
          icon: "cash-outline",
          iconColor: "#ED8936",
          label: "Moneda predeterminada",
          infoValue: defaultCurrency,
          onPress: handleSelectCurrency,
        },
      ],
    },
    {
      title: "Datos",
      rows: [
        {
          id: "auto_backup",
          type: "toggle",
          icon: "cloud-upload-outline",
          iconColor: "#4299E1",
          label: "Copia de seguridad",
          description: "Próximamente",
          value: autoBackup,
          onToggle: setAutoBackup,
        },
        {
          id: "export",
          type: "navigation",
          icon: "download-outline",
          iconColor: "#9F7AEA",
          label: "Exportar datos",
          description: "Descargar tus viajes en formato JSON",
          onPress: handleExportData,
        },
        {
          id: "clear_data",
          type: "action",
          icon: "trash-outline",
          iconColor: Colors.error,
          label: "Borrar todos los datos",
          description: "Eliminar viajes, documentos y ajustes",
          destructive: true,
          onPress: handleClearData,
        },
      ],
    },
    {
      title: "Acerca de",
      rows: [
        {
          id: "version",
          type: "info",
          icon: "information-circle-outline",
          iconColor: Colors.textTertiary,
          label: "Versión",
          infoValue: "1.0.0",
        },
        {
          id: "rate",
          type: "navigation",
          icon: "star-outline",
          iconColor: "#ECC94B",
          label: "Valorar la app",
          description: "Ayúdanos con tu valoración",
          onPress: handleRateApp,
        },
        {
          id: "support",
          type: "navigation",
          icon: "chatbubble-ellipses-outline",
          iconColor: "#0BC5EA",
          label: "Contactar soporte",
          description: "Enviar email al equipo",
          onPress: handleContactSupport,
        },
        {
          id: "privacy",
          type: "navigation",
          icon: "shield-checkmark-outline",
          iconColor: "#48BB78",
          label: "Política de privacidad",
          onPress: handlePrivacyPolicy,
        },
        {
          id: "terms",
          type: "navigation",
          icon: "document-text-outline",
          iconColor: "#A0AEC0",
          label: "Términos de servicio",
          onPress: handleTermsOfService,
        },
      ],
    },
  ];

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <View style={styles.screen}>
      {/* ─── Header with wave ────────────────────────────────── */}
      <WaveHeader>
        <Text style={styles.headerSubtitle}>Configuración</Text>
        <Text style={styles.headerTitle}>Ajustes</Text>
      </WaveHeader>

      {/* ─── Content ─────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + Layout.tabBarHeight + Spacing["3xl"] + 16,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionTitleLine} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionTitleLine} />
            </View>

            <View style={styles.sectionCard}>
              {section.rows.map((row, index) => {
                const isLast = index === section.rows.length - 1;

                return (
                  <TouchableOpacity
                    key={row.id}
                    style={[styles.row, !isLast && styles.rowBorder]}
                    onPress={row.type !== "toggle" && row.type !== "info" ? row.onPress : undefined}
                    activeOpacity={row.type === "toggle" || row.type === "info" ? 1 : 0.6}
                    disabled={row.type === "toggle" || row.type === "info"}
                  >
                    {/* Icon */}
                    <View
                      style={[
                        styles.rowIconContainer,
                        {
                          backgroundColor: `${row.iconColor}12`,
                        },
                      ]}
                    >
                      <Ionicons name={row.icon} size={18} color={row.iconColor} />
                    </View>

                    {/* Content */}
                    <View style={styles.rowContent}>
                      <Text style={[styles.rowLabel, row.destructive && styles.rowLabelDestructive]} numberOfLines={1}>
                        {row.label}
                      </Text>
                      {row.description ? (
                        <Text style={styles.rowDescription} numberOfLines={1}>
                          {row.description}
                        </Text>
                      ) : null}
                    </View>

                    {/* Right accessory */}
                    {row.type === "toggle" && row.onToggle ? (
                      <Switch
                        value={row.value}
                        onValueChange={row.onToggle}
                        trackColor={{
                          false: Colors.border,
                          true: Colors.primaryLight,
                        }}
                        thumbColor={row.value ? Colors.primary : Colors.card}
                        ios_backgroundColor={Colors.border}
                        style={styles.switch}
                      />
                    ) : row.type === "navigation" ? (
                      <View style={styles.rowRight}>
                        {row.infoValue ? (
                          <View style={styles.rowInfoPill}>
                            <Text style={styles.rowInfoValue}>{row.infoValue}</Text>
                          </View>
                        ) : null}
                        <View style={styles.rowChevron}>
                          <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
                        </View>
                      </View>
                    ) : row.type === "info" ? (
                      <View style={styles.rowInfoPill}>
                        <Text style={styles.rowInfoValue}>{row.infoValue}</Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* ─── App branding footer ───────────────────────────── */}
        <View style={styles.footer}>
          <View style={styles.footerLogoContainer}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.footerLogoGradient}
            >
              <Ionicons name="airplane" size={24} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={styles.footerAppName}>ViajaPayá</Text>
          <Text style={styles.footerTagline}>Tu organizador de viajes personal</Text>

          {/* Version & copyright row */}
          <View style={styles.footerMetaRow}>
            <Text style={styles.footerCopyright}>v1.0.0 · © {new Date().getFullYear()} ViajaPayá</Text>
          </View>

          {/* Made with love badge */}
          <View style={styles.madeWithLove}>
            <Text style={styles.madeWithLoveText}>Hecho con </Text>
            <Ionicons name="heart" size={12} color={Colors.primary} />
            <Text style={styles.madeWithLoveText}> para viajeros</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ─── Header ─────────────────────────────────────
  headerSubtitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: "rgba(255,255,255,0.75)",
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: FontWeights.bold,
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },

  // ─── Content ────────────────────────────────────
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.sm,
  },

  // ─── Section ────────────────────────────────────
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
    gap: Spacing.md,
  },
  sectionTitleLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  // ─── Row ────────────────────────────────────────
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.base,
    minHeight: 62,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
    marginHorizontal: Spacing.base,
    paddingHorizontal: 0,
  },
  rowIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  rowContent: {
    flex: 1,
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    letterSpacing: -0.1,
  },
  rowLabelDestructive: {
    color: Colors.error,
  },
  rowDescription: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: Spacing.sm,
    gap: Spacing.sm,
  },
  rowInfoPill: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 1,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  rowInfoValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  rowChevron: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  switch: {
    marginLeft: Spacing.sm,
    transform: Platform.OS === "android" ? [{ scale: 0.9 }] : [],
  },

  // ─── Footer ─────────────────────────────────────
  footer: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
    marginTop: Spacing.sm,
  },
  footerLogoContainer: {
    marginBottom: Spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  footerLogoGradient: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  footerAppName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    letterSpacing: -0.3,
  },
  footerTagline: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  footerMetaRow: {
    marginBottom: Spacing.sm,
  },
  footerCopyright: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
  },
  madeWithLove: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
  },
  madeWithLoveText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
});
