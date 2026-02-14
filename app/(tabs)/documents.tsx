import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows, Layout } from "@/constants/theme";
import EmptyState from "@/components/ui/EmptyState";
import FAB from "@/components/ui/FAB";
import WaveHeader from "@/components/ui/WaveHeader";

const PERSONAL_DOCS_KEY = "@viajapaya/personal_documents";

// ─── Document type definitions ───────────────────────────────────────

type PersonalDocType = "dni" | "passport" | "visa" | "health_card" | "travel_insurance" | "driving_license" | "other";

interface DocTypeConfig {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
}

const DOC_TYPE_CONFIG: Record<PersonalDocType, DocTypeConfig> = {
  dni: {
    label: "DNI / ID Card",
    icon: "id-card",
    color: "#4299E1",
    description: "Documento de identidad nacional",
  },
  passport: {
    label: "Pasaporte",
    icon: "book",
    color: "#9F7AEA",
    description: "Pasaporte internacional",
  },
  visa: {
    label: "Visado",
    icon: "document-attach",
    color: "#ED8936",
    description: "Visados y permisos de entrada",
  },
  health_card: {
    label: "Tarjeta Sanitaria",
    icon: "medkit",
    color: "#F56565",
    description: "Tarjeta sanitaria europea u otra",
  },
  travel_insurance: {
    label: "Seguro de Viaje",
    icon: "shield-checkmark",
    color: "#48BB78",
    description: "Póliza y datos de seguro",
  },
  driving_license: {
    label: "Carnet de Conducir",
    icon: "car",
    color: "#667EEA",
    description: "Carnet nacional o internacional",
  },
  other: {
    label: "Otro Documento",
    icon: "document-text",
    color: "#A0AEC0",
    description: "Certificados, carnets, etc.",
  },
};

const DOC_TYPES_ORDER: PersonalDocType[] = [
  "dni",
  "passport",
  "visa",
  "health_card",
  "travel_insurance",
  "driving_license",
  "other",
];

// ─── Placeholder personal document interface ─────────────────────────

interface PersonalDocument {
  id: string;
  type: PersonalDocType;
  name: string;
  documentNumber?: string;
  expiryDate?: string;
  countryIssuer?: string;
  holderName?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function getExpiryStatus(expiryDate?: string): "valid" | "expiring_soon" | "expired" | "unknown" {
  if (!expiryDate) return "unknown";
  try {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    if (expiry < now) return "expired";
    if (expiry < sixMonthsFromNow) return "expiring_soon";
    return "valid";
  } catch {
    return "unknown";
  }
}

const EXPIRY_STATUS_CONFIG = {
  valid: {
    label: "Vigente",
    color: Colors.success,
    bgColor: Colors.successMuted,
    icon: "checkmark-circle" as keyof typeof Ionicons.glyphMap,
  },
  expiring_soon: {
    label: "Caduca pronto",
    color: Colors.warning,
    bgColor: Colors.warningMuted,
    icon: "alert-circle" as keyof typeof Ionicons.glyphMap,
  },
  expired: {
    label: "Caducado",
    color: Colors.error,
    bgColor: Colors.errorMuted,
    icon: "close-circle" as keyof typeof Ionicons.glyphMap,
  },
  unknown: {
    label: "Sin fecha",
    color: Colors.textTertiary,
    bgColor: Colors.secondaryMuted,
    icon: "help-circle" as keyof typeof Ionicons.glyphMap,
  },
};

function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return isoDate;
  }
}

// ─── Component ───────────────────────────────────────────────────────

export default function PersonalDocumentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [documents, setDocuments] = useState<PersonalDocument[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<PersonalDocType | "all">("all");

  // ─── Load documents from AsyncStorage ──────────────────────────
  const loadDocuments = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(PERSONAL_DOCS_KEY);
      if (raw) {
        const parsed: PersonalDocument[] = JSON.parse(raw);
        // Sort by most recently updated
        parsed.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setDocuments(parsed);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.warn("[PersonalDocs] Error loading documents:", error);
      setDocuments([]);
    }
  }, []);

  // Reload every time the screen is focused (e.g. coming back from form)
  useFocusEffect(
    useCallback(() => {
      loadDocuments();
    }, [loadDocuments]),
  );

  const filteredDocuments = selectedFilter === "all" ? documents : documents.filter((d) => d.type === selectedFilter);

  const isEmpty = documents.length === 0;

  // Counts by type for filter badges
  const countsByType: Record<PersonalDocType, number> = {
    dni: 0,
    passport: 0,
    visa: 0,
    health_card: 0,
    travel_insurance: 0,
    driving_license: 0,
    other: 0,
  };
  documents.forEach((d) => {
    countsByType[d.type] = (countsByType[d.type] || 0) + 1;
  });

  // Expiry alerts
  const expiringDocs = documents.filter((d) => {
    const status = getExpiryStatus(d.expiryDate);
    return status === "expired" || status === "expiring_soon";
  });

  const handleAddDocument = () => {
    router.push({
      pathname: "/document-form",
      params: { mode: "personal" },
    } as any);
  };

  const handleDocumentPress = (doc: PersonalDocument) => {
    router.push({
      pathname: "/document-form",
      params: { mode: "personal", docId: doc.id },
    } as any);
  };

  return (
    <View style={styles.screen}>
      {/* ─── Header with wave ────────────────────────────────── */}
      <WaveHeader extraBottomPadding={!isEmpty ? 4 : 0}>
        {/* Title row */}
        <View style={styles.headerTop}>
          <View style={styles.headerTitleArea}>
            <Text style={styles.headerSubtitle}>Documentación</Text>
            <Text style={styles.headerTitle}>Mi Cartera</Text>
          </View>
          <TouchableOpacity style={styles.headerIconButton} onPress={handleAddDocument} activeOpacity={0.7}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Expiry alert banner */}
        {expiringDocs.length > 0 && (
          <View style={styles.alertBanner}>
            <View style={styles.alertIconCircle}>
              <Ionicons name="alert-circle" size={16} color="#FDE68A" />
            </View>
            <Text style={styles.alertText}>
              {expiringDocs.length} documento
              {expiringDocs.length > 1 ? "s" : ""} requiere
              {expiringDocs.length > 1 ? "n" : ""} atención
            </Text>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.6)" />
          </View>
        )}

        {/* Filter chips (shown when there are documents) */}
        {!isEmpty && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
            style={styles.filtersScroll}
          >
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === "all" && styles.filterChipActive]}
              onPress={() => setSelectedFilter("all")}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, selectedFilter === "all" && styles.filterChipTextActive]}>
                Todos
              </Text>
              <View style={[styles.filterBadge, selectedFilter === "all" && styles.filterBadgeActive]}>
                <Text style={[styles.filterBadgeText, selectedFilter === "all" && styles.filterBadgeTextActive]}>
                  {documents.length}
                </Text>
              </View>
            </TouchableOpacity>

            {DOC_TYPES_ORDER.filter((t) => countsByType[t] > 0).map((type) => {
              const config = DOC_TYPE_CONFIG[type];
              const isActive = selectedFilter === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(type)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={config.icon}
                    size={14}
                    color={isActive ? "#FFFFFF" : "rgba(255,255,255,0.7)"}
                    style={styles.filterChipIcon}
                  />
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{config.label}</Text>
                  <View style={[styles.filterBadge, isActive && styles.filterBadgeActive]}>
                    <Text style={[styles.filterBadgeText, isActive && styles.filterBadgeTextActive]}>
                      {countsByType[type]}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </WaveHeader>

      {/* ─── Content ─────────────────────────────────────────── */}
      {isEmpty ? (
        <ScrollView contentContainerStyle={styles.emptyScrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero empty state */}
          <EmptyState
            icon="wallet-outline"
            title="Tu cartera digital"
            description="Guarda tus documentos personales de forma segura y tenlos siempre a mano cuando viajes."
          />

          {/* Document type grid — invites user to add */}
          <View style={styles.docTypeGrid}>
            <Text style={styles.docTypeGridTitle}>¿Qué documento quieres añadir?</Text>
            <View style={styles.docTypeGridContainer}>
              {DOC_TYPES_ORDER.map((type) => {
                const config = DOC_TYPE_CONFIG[type];
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.docTypeCard, Shadows.sm]}
                    onPress={handleAddDocument}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.docTypeIconCircle, { backgroundColor: `${config.color}14` }]}>
                      <Ionicons name={config.icon} size={24} color={config.color} />
                    </View>
                    <Text style={styles.docTypeCardLabel} numberOfLines={2}>
                      {config.label}
                    </Text>
                    <Ionicons
                      name="add-circle-outline"
                      size={16}
                      color={Colors.textTertiary}
                      style={styles.docTypeAddIcon}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Security notice */}
          <View style={styles.securityNotice}>
            <Ionicons name="lock-closed-outline" size={18} color={Colors.accent} style={styles.securityIcon} />
            <Text style={styles.securityText}>
              Tus documentos se almacenan de forma segura en tu dispositivo. No se suben a ningún servidor.
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: insets.bottom + Layout.tabBarHeight + Spacing["3xl"] + 16,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filteredDocuments.length === 0 ? (
            <EmptyState
              icon="document-text-outline"
              title="Sin documentos"
              description={`No tienes documentos de tipo "${
                selectedFilter !== "all" ? DOC_TYPE_CONFIG[selectedFilter].label : ""
              }".`}
              compact
            />
          ) : (
            filteredDocuments.map((doc) => {
              const typeConfig = DOC_TYPE_CONFIG[doc.type];
              const expiryStatus = getExpiryStatus(doc.expiryDate);
              const expiryConfig = EXPIRY_STATUS_CONFIG[expiryStatus];

              return (
                <TouchableOpacity
                  key={doc.id}
                  style={styles.documentCard}
                  onPress={() => handleDocumentPress(doc)}
                  activeOpacity={0.7}
                >
                  {/* Left color accent */}
                  <View style={[styles.docAccent, { backgroundColor: typeConfig.color }]} />

                  {/* Left icon */}
                  <View style={[styles.docIconContainer, { backgroundColor: `${typeConfig.color}10` }]}>
                    <Ionicons name={typeConfig.icon} size={20} color={typeConfig.color} />
                  </View>

                  {/* Content */}
                  <View style={styles.docContent}>
                    <Text style={styles.docName} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    <Text style={styles.docType} numberOfLines={1}>
                      {typeConfig.label}
                      {doc.documentNumber ? ` · ${doc.documentNumber}` : ""}
                    </Text>

                    {/* Expiry badge */}
                    <View style={styles.docMetaRow}>
                      <View style={[styles.expiryBadge, { backgroundColor: expiryConfig.bgColor }]}>
                        <Ionicons
                          name={expiryConfig.icon}
                          size={11}
                          color={expiryConfig.color}
                          style={styles.expiryBadgeIcon}
                        />
                        <Text style={[styles.expiryBadgeText, { color: expiryConfig.color }]}>
                          {expiryStatus !== "unknown" && doc.expiryDate
                            ? formatDate(doc.expiryDate)
                            : expiryConfig.label}
                        </Text>
                      </View>

                      {doc.countryIssuer && <Text style={styles.docCountry}>{doc.countryIssuer}</Text>}
                    </View>
                  </View>

                  {/* Right arrow */}
                  <View style={styles.docChevron}>
                    <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}

      {/* ─── FAB ─────────────────────────────────────────────── */}
      {!isEmpty && (
        <FAB
          icon="add"
          onPress={handleAddDocument}
          style={{
            bottom: insets.bottom + Layout.tabBarHeight + Spacing.base + 8,
          }}
        />
      )}
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitleArea: {
    flex: 1,
  },
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
  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  // ─── Alert banner ───────────────────────────────
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  alertIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  alertText: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: "#FFFFFF",
  },

  // ─── Filters ────────────────────────────────────
  filtersScroll: {
    marginTop: Spacing.base,
    marginHorizontal: -20,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  filterChipActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderColor: "rgba(255,255,255,0.35)",
  },
  filterChipIcon: {
    marginRight: Spacing.xs,
  },
  filterChipText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: "rgba(255,255,255,0.7)",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: FontWeights.semibold,
  },
  filterBadge: {
    marginLeft: Spacing.xs + 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xs + 1,
  },
  filterBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  filterBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: "rgba(255,255,255,0.6)",
  },
  filterBadgeTextActive: {
    color: "#FFFFFF",
  },

  // ─── Empty state content ────────────────────────
  emptyScrollContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingBottom: Spacing["5xl"],
  },

  // ─── Document type grid ─────────────────────────
  docTypeGrid: {
    marginTop: Spacing.sm,
  },
  docTypeGridTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.base,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  docTypeGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  docTypeCard: {
    width: "47%",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: "center",
    minHeight: 128,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  docTypeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  docTypeCardLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  docTypeAddIcon: {
    marginTop: Spacing.xs,
  },

  // ─── Security notice ────────────────────────────
  securityNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.accentMuted,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: "rgba(0, 180, 216, 0.1)",
  },
  securityIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  securityText: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    lineHeight: FontSizes.sm * 1.6,
  },

  // ─── Document list ──────────────────────────────
  listContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.sm,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md + 2,
    paddingLeft: 0,
    paddingRight: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: "hidden",
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
  docAccent: {
    width: 3.5,
    alignSelf: "stretch",
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
    marginRight: Spacing.md,
  },
  docIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  docContent: {
    flex: 1,
    justifyContent: "center",
  },
  docName: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 3,
    letterSpacing: -0.1,
  },
  docType: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs + 1,
  },
  docMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  expiryBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing["2xs"] + 1,
  },
  expiryBadgeIcon: {
    marginRight: Spacing.xs,
  },
  expiryBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  docCountry: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
  },
  docChevron: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
});
