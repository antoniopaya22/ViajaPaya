import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
  Shadows,
  Layout,
} from '@/constants/theme';
import { getTripById } from '@/services/storage';
import { Trip } from '@/types/trip';

// ─── Trip Document types (mirrored from documents screen) ────────────

type TripDocumentType =
  | 'boarding_pass'
  | 'hotel_booking'
  | 'car_rental'
  | 'activity_ticket'
  | 'travel_insurance'
  | 'visa'
  | 'itinerary'
  | 'receipt'
  | 'other';

interface TripDocument {
  id: string;
  tripId: string;
  type: TripDocumentType;
  name: string;
  description?: string;
  referenceNumber?: string;
  date?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Personal Document types (mirrored from tabs/documents) ──────────

type PersonalDocType =
  | 'dni'
  | 'passport'
  | 'visa'
  | 'health_card'
  | 'travel_insurance'
  | 'driving_license'
  | 'other';

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

// ─── Config maps ─────────────────────────────────────────────────────

interface DocTypeConfig {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const TRIP_DOC_CONFIG: Record<TripDocumentType, DocTypeConfig> = {
  boarding_pass: { label: 'Tarjeta de embarque', icon: 'airplane', color: '#4299E1' },
  hotel_booking: { label: 'Reserva de hotel', icon: 'bed', color: '#9F7AEA' },
  car_rental: { label: 'Alquiler de coche', icon: 'car', color: '#48BB78' },
  activity_ticket: { label: 'Entrada / Ticket', icon: 'ticket', color: '#ED8936' },
  travel_insurance: { label: 'Seguro de viaje', icon: 'shield-checkmark', color: '#38B2AC' },
  visa: { label: 'Visado', icon: 'document-attach', color: '#E53E3E' },
  itinerary: { label: 'Itinerario', icon: 'map', color: '#667EEA' },
  receipt: { label: 'Recibo / Factura', icon: 'receipt', color: '#D69E2E' },
  other: { label: 'Otro documento', icon: 'document-text', color: '#A0AEC0' },
};

const PERSONAL_DOC_CONFIG: Record<PersonalDocType, DocTypeConfig> = {
  dni: { label: 'DNI / ID Card', icon: 'id-card', color: '#4299E1' },
  passport: { label: 'Pasaporte', icon: 'book', color: '#9F7AEA' },
  visa: { label: 'Visado', icon: 'document-attach', color: '#ED8936' },
  health_card: { label: 'Tarjeta Sanitaria', icon: 'medkit', color: '#F56565' },
  travel_insurance: { label: 'Seguro de Viaje', icon: 'shield-checkmark', color: '#48BB78' },
  driving_license: { label: 'Carnet de Conducir', icon: 'car', color: '#667EEA' },
  other: { label: 'Otro Documento', icon: 'document-text', color: '#A0AEC0' },
};

const TRIP_DOC_TYPES: TripDocumentType[] = [
  'boarding_pass',
  'hotel_booking',
  'car_rental',
  'activity_ticket',
  'travel_insurance',
  'visa',
  'itinerary',
  'receipt',
  'other',
];

const PERSONAL_DOC_TYPES: PersonalDocType[] = [
  'dni',
  'passport',
  'visa',
  'health_card',
  'travel_insurance',
  'driving_license',
  'other',
];

// ─── Storage keys ────────────────────────────────────────────────────

const PERSONAL_DOCS_KEY = '@viajapaya/personal_documents';
const tripDocsKey = (tripId: string) => `@viajapaya/trip_docs_${tripId}`;

// ─── Helpers ─────────────────────────────────────────────────────────

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ─── Main Component ──────────────────────────────────────────────────

export default function DocumentFormScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    tripId?: string;
    docId?: string;
    docType?: string;
    personalDocType?: string;
    mode?: string; // 'personal' | 'trip' — defaults to 'trip' if tripId present
  }>();

  const { tripId, docId, docType, personalDocType } = params;

  // Determine mode: personal documents vs trip documents
  const isPersonalMode = params.mode === 'personal' || (!tripId && !docType);
  const isEditing = !!docId;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  // ─── Trip document form state ─────────────────────────────────
  const [tripDocName, setTripDocName] = useState('');
  const [tripDocDescription, setTripDocDescription] = useState('');
  const [tripDocRefNumber, setTripDocRefNumber] = useState('');
  const [tripDocDate, setTripDocDate] = useState('');
  const [tripDocNotes, setTripDocNotes] = useState('');
  const [selectedTripDocType, setSelectedTripDocType] = useState<TripDocumentType>(
    (docType as TripDocumentType) || 'other'
  );

  // ─── Personal document form state ─────────────────────────────
  const [personalDocName, setPersonalDocName] = useState('');
  const [personalDocNumber, setPersonalDocNumber] = useState('');
  const [personalDocExpiry, setPersonalDocExpiry] = useState('');
  const [personalDocCountry, setPersonalDocCountry] = useState('');
  const [personalDocHolder, setPersonalDocHolder] = useState('');
  const [selectedPersonalDocType, setSelectedPersonalDocType] = useState<PersonalDocType>(
    (personalDocType as PersonalDocType) || 'passport'
  );

  const nameInputRef = useRef<TextInput>(null);

  // ─── Load data ────────────────────────────────────────────────

  useEffect(() => {
    loadData();
  }, [tripId, docId]);

  const loadData = async () => {
    try {
      // Load trip info if trip mode
      if (tripId) {
        const loadedTrip = await getTripById(tripId);
        setTrip(loadedTrip);
      }

      // Load existing document for editing
      if (isEditing && docId) {
        if (isPersonalMode) {
          await loadPersonalDocument(docId);
        } else if (tripId) {
          await loadTripDocument(tripId, docId);
        }
      }
    } catch (error) {
      console.warn('[DocumentForm] Error loading:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTripDocument = async (tid: string, did: string) => {
    try {
      const raw = await AsyncStorage.getItem(tripDocsKey(tid));
      if (raw) {
        const docs: TripDocument[] = JSON.parse(raw);
        const doc = docs.find((d) => d.id === did);
        if (doc) {
          setTripDocName(doc.name);
          setTripDocDescription(doc.description || '');
          setTripDocRefNumber(doc.referenceNumber || '');
          setTripDocDate(doc.date || '');
          setTripDocNotes(doc.notes || '');
          setSelectedTripDocType(doc.type);
        }
      }
    } catch (error) {
      console.warn('[DocumentForm] Error loading trip doc:', error);
    }
  };

  const loadPersonalDocument = async (did: string) => {
    try {
      const raw = await AsyncStorage.getItem(PERSONAL_DOCS_KEY);
      if (raw) {
        const docs: PersonalDocument[] = JSON.parse(raw);
        const doc = docs.find((d) => d.id === did);
        if (doc) {
          setPersonalDocName(doc.name);
          setPersonalDocNumber(doc.documentNumber || '');
          setPersonalDocExpiry(doc.expiryDate || '');
          setPersonalDocCountry(doc.countryIssuer || '');
          setPersonalDocHolder(doc.holderName || '');
          setSelectedPersonalDocType(doc.type);
        }
      }
    } catch (error) {
      console.warn('[DocumentForm] Error loading personal doc:', error);
    }
  };

  // ─── Track changes ────────────────────────────────────────────

  const markChanged = useCallback(() => {
    setHasChanges(true);
  }, []);

  // ─── Save trip document ───────────────────────────────────────

  const handleSaveTripDoc = useCallback(async () => {
    if (!tripId) return;

    const trimmedName = tripDocName.trim();
    if (!trimmedName) {
      Alert.alert('Nombre requerido', 'Escribe un nombre para el documento.', [{ text: 'OK' }]);
      return;
    }

    setSaving(true);

    try {
      const key = tripDocsKey(tripId);
      const raw = await AsyncStorage.getItem(key);
      let docs: TripDocument[] = raw ? JSON.parse(raw) : [];
      const now = new Date().toISOString();

      if (isEditing && docId) {
        const idx = docs.findIndex((d) => d.id === docId);
        if (idx !== -1) {
          docs[idx] = {
            ...docs[idx],
            type: selectedTripDocType,
            name: trimmedName,
            description: tripDocDescription.trim() || undefined,
            referenceNumber: tripDocRefNumber.trim() || undefined,
            date: tripDocDate.trim() || undefined,
            notes: tripDocNotes.trim() || undefined,
            updatedAt: now,
          };
        }
      } else {
        const newDoc: TripDocument = {
          id: generateId('tripdoc'),
          tripId,
          type: selectedTripDocType,
          name: trimmedName,
          description: tripDocDescription.trim() || undefined,
          referenceNumber: tripDocRefNumber.trim() || undefined,
          date: tripDocDate.trim() || undefined,
          notes: tripDocNotes.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        docs.push(newDoc);
      }

      await AsyncStorage.setItem(key, JSON.stringify(docs));
      setHasChanges(false);
      router.back();
    } catch (error) {
      console.warn('[DocumentForm] Error saving trip doc:', error);
      Alert.alert('Error', 'No se pudo guardar el documento.', [{ text: 'OK' }]);
    } finally {
      setSaving(false);
    }
  }, [tripId, docId, isEditing, selectedTripDocType, tripDocName, tripDocDescription, tripDocRefNumber, tripDocDate, tripDocNotes, router]);

  // ─── Save personal document ───────────────────────────────────

  const handleSavePersonalDoc = useCallback(async () => {
    const trimmedName = personalDocName.trim();
    if (!trimmedName) {
      Alert.alert('Nombre requerido', 'Escribe un nombre para el documento.', [{ text: 'OK' }]);
      return;
    }

    setSaving(true);

    try {
      const raw = await AsyncStorage.getItem(PERSONAL_DOCS_KEY);
      let docs: PersonalDocument[] = raw ? JSON.parse(raw) : [];
      const now = new Date().toISOString();

      if (isEditing && docId) {
        const idx = docs.findIndex((d) => d.id === docId);
        if (idx !== -1) {
          docs[idx] = {
            ...docs[idx],
            type: selectedPersonalDocType,
            name: trimmedName,
            documentNumber: personalDocNumber.trim() || undefined,
            expiryDate: personalDocExpiry.trim() || undefined,
            countryIssuer: personalDocCountry.trim() || undefined,
            holderName: personalDocHolder.trim() || undefined,
            updatedAt: now,
          };
        }
      } else {
        const newDoc: PersonalDocument = {
          id: generateId('pdoc'),
          type: selectedPersonalDocType,
          name: trimmedName,
          documentNumber: personalDocNumber.trim() || undefined,
          expiryDate: personalDocExpiry.trim() || undefined,
          countryIssuer: personalDocCountry.trim() || undefined,
          holderName: personalDocHolder.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        docs.push(newDoc);
      }

      await AsyncStorage.setItem(PERSONAL_DOCS_KEY, JSON.stringify(docs));
      setHasChanges(false);
      router.back();
    } catch (error) {
      console.warn('[DocumentForm] Error saving personal doc:', error);
      Alert.alert('Error', 'No se pudo guardar el documento.', [{ text: 'OK' }]);
    } finally {
      setSaving(false);
    }
  }, [docId, isEditing, selectedPersonalDocType, personalDocName, personalDocNumber, personalDocExpiry, personalDocCountry, personalDocHolder, router]);

  // ─── Delete ───────────────────────────────────────────────────

  const handleDelete = useCallback(() => {
    if (!docId) return;

    Alert.alert(
      'Eliminar documento',
      '¿Estás seguro de que quieres eliminar este documento? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (isPersonalMode) {
                const raw = await AsyncStorage.getItem(PERSONAL_DOCS_KEY);
                let docs: PersonalDocument[] = raw ? JSON.parse(raw) : [];
                docs = docs.filter((d) => d.id !== docId);
                await AsyncStorage.setItem(PERSONAL_DOCS_KEY, JSON.stringify(docs));
              } else if (tripId) {
                const key = tripDocsKey(tripId);
                const raw = await AsyncStorage.getItem(key);
                let docs: TripDocument[] = raw ? JSON.parse(raw) : [];
                docs = docs.filter((d) => d.id !== docId);
                await AsyncStorage.setItem(key, JSON.stringify(docs));
              }
              router.back();
            } catch (error) {
              console.warn('[DocumentForm] Error deleting:', error);
              Alert.alert('Error', 'No se pudo eliminar el documento.', [{ text: 'OK' }]);
            }
          },
        },
      ]
    );
  }, [docId, isPersonalMode, tripId, router]);

  // ─── Discard confirmation ─────────────────────────────────────

  const handleGoBack = useCallback(() => {
    if (hasChanges) {
      Alert.alert('Descartar cambios', '¿Deseas salir sin guardar los cambios?', [
        { text: 'Seguir editando', style: 'cancel' },
        { text: 'Descartar', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  }, [hasChanges, router]);

  // ─── Derived ──────────────────────────────────────────────────

  const canSave = isPersonalMode
    ? personalDocName.trim().length > 0 && hasChanges
    : tripDocName.trim().length > 0 && hasChanges;

  const activeTripDocConfig = TRIP_DOC_CONFIG[selectedTripDocType];
  const activePersonalDocConfig = PERSONAL_DOC_CONFIG[selectedPersonalDocType];

  const pageTitle = isPersonalMode
    ? isEditing
      ? 'Editar documento'
      : 'Nuevo documento personal'
    : isEditing
    ? 'Editar documento'
    : 'Nuevo documento';

  const pageSubtitle = isPersonalMode ? 'Mi Cartera' : trip?.name || 'Documento del viaje';

  // ─── Loading ──────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // ─── Render ───────────────────────────────────────────────────

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* ─── Header ──────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {pageTitle}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {pageSubtitle}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {isEditing && (
            <TouchableOpacity
              style={styles.headerDeleteButton}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color={Colors.error} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            onPress={isPersonalMode ? handleSavePersonalDoc : handleSaveTripDoc}
            disabled={!canSave || saving}
            activeOpacity={0.7}
          >
            {saving ? (
              <ActivityIndicator size="small" color={Colors.textInverse} />
            ) : (
              <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
                Guardar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Form ────────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.formContent,
            { paddingBottom: insets.bottom + Spacing['3xl'] },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Type Selector ──────────────────────────────── */}
          <Text style={styles.sectionLabel}>Tipo de documento</Text>
          <TouchableOpacity
            style={[
              styles.typeSelector,
              Shadows.sm,
              {
                borderLeftColor: isPersonalMode
                  ? activePersonalDocConfig.color
                  : activeTripDocConfig.color,
              },
            ]}
            onPress={() => setShowTypePicker(!showTypePicker)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.typeSelectorIcon,
                {
                  backgroundColor: `${
                    isPersonalMode ? activePersonalDocConfig.color : activeTripDocConfig.color
                  }14`,
                },
              ]}
            >
              <Ionicons
                name={isPersonalMode ? activePersonalDocConfig.icon : activeTripDocConfig.icon}
                size={22}
                color={isPersonalMode ? activePersonalDocConfig.color : activeTripDocConfig.color}
              />
            </View>
            <Text style={styles.typeSelectorText}>
              {isPersonalMode ? activePersonalDocConfig.label : activeTripDocConfig.label}
            </Text>
            <Ionicons
              name={showTypePicker ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={Colors.textTertiary}
            />
          </TouchableOpacity>

          {/* Type picker dropdown */}
          {showTypePicker && (
            <View style={[styles.typePicker, Shadows.md]}>
              {(isPersonalMode ? PERSONAL_DOC_TYPES : TRIP_DOC_TYPES).map((type) => {
                const config = isPersonalMode
                  ? PERSONAL_DOC_CONFIG[type as PersonalDocType]
                  : TRIP_DOC_CONFIG[type as TripDocumentType];
                const isActive = isPersonalMode
                  ? selectedPersonalDocType === type
                  : selectedTripDocType === type;

                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typePickerItem,
                      isActive && { backgroundColor: `${config.color}14` },
                    ]}
                    onPress={() => {
                      if (isPersonalMode) {
                        setSelectedPersonalDocType(type as PersonalDocType);
                      } else {
                        setSelectedTripDocType(type as TripDocumentType);
                      }
                      setShowTypePicker(false);
                      markChanged();
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[styles.typePickerIconCircle, { backgroundColor: `${config.color}20` }]}
                    >
                      <Ionicons name={config.icon} size={18} color={config.color} />
                    </View>
                    <Text
                      style={[
                        styles.typePickerText,
                        isActive && { color: config.color, fontWeight: FontWeights.semibold },
                      ]}
                    >
                      {config.label}
                    </Text>
                    {isActive && (
                      <Ionicons name="checkmark-circle" size={18} color={config.color} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ─── Form fields ───────────────────────────────── */}
          {isPersonalMode ? (
            <>
              {/* Personal document fields */}
              <Text style={styles.sectionLabel}>Información del documento</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Nombre del documento <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  ref={nameInputRef}
                  style={styles.textInput}
                  placeholder="Ej: Pasaporte de María"
                  placeholderTextColor={Colors.textTertiary}
                  value={personalDocName}
                  onChangeText={(t) => {
                    setPersonalDocName(t);
                    markChanged();
                  }}
                  returnKeyType="next"
                  maxLength={100}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Titular</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Nombre del titular"
                  placeholderTextColor={Colors.textTertiary}
                  value={personalDocHolder}
                  onChangeText={(t) => {
                    setPersonalDocHolder(t);
                    markChanged();
                  }}
                  returnKeyType="next"
                  maxLength={100}
                />
              </View>

              <View style={styles.rowFields}>
                <View style={[styles.fieldGroup, styles.halfField]}>
                  <Text style={styles.fieldLabel}>Número de documento</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ej: AB1234567"
                    placeholderTextColor={Colors.textTertiary}
                    value={personalDocNumber}
                    onChangeText={(t) => {
                      setPersonalDocNumber(t);
                      markChanged();
                    }}
                    returnKeyType="next"
                    autoCapitalize="characters"
                    maxLength={30}
                  />
                </View>
                <View style={[styles.fieldGroup, styles.halfField]}>
                  <Text style={styles.fieldLabel}>País emisor</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ej: España"
                    placeholderTextColor={Colors.textTertiary}
                    value={personalDocCountry}
                    onChangeText={(t) => {
                      setPersonalDocCountry(t);
                      markChanged();
                    }}
                    returnKeyType="next"
                    maxLength={50}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Fecha de caducidad</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="AAAA-MM-DD (ej: 2028-06-15)"
                  placeholderTextColor={Colors.textTertiary}
                  value={personalDocExpiry}
                  onChangeText={(t) => {
                    setPersonalDocExpiry(t);
                    markChanged();
                  }}
                  returnKeyType="done"
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                />
                <Text style={styles.fieldHint}>
                  Te avisaremos cuando esté próximo a caducar
                </Text>
              </View>

              {/* Security note */}
              <View style={styles.securityNote}>
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color={Colors.accent}
                  style={styles.securityIcon}
                />
                <Text style={styles.securityText}>
                  Tus documentos se almacenan de forma segura en tu dispositivo. No se
                  suben a ningún servidor.
                </Text>
              </View>
            </>
          ) : (
            <>
              {/* Trip document fields */}
              <Text style={styles.sectionLabel}>Información del documento</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Nombre <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  ref={nameInputRef}
                  style={styles.textInput}
                  placeholder="Ej: Vuelo Madrid-Roma, Reserva Hotel Luna..."
                  placeholderTextColor={Colors.textTertiary}
                  value={tripDocName}
                  onChangeText={(t) => {
                    setTripDocName(t);
                    markChanged();
                  }}
                  returnKeyType="next"
                  maxLength={150}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Descripción</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Breve descripción del documento"
                  placeholderTextColor={Colors.textTertiary}
                  value={tripDocDescription}
                  onChangeText={(t) => {
                    setTripDocDescription(t);
                    markChanged();
                  }}
                  returnKeyType="next"
                  maxLength={200}
                />
              </View>

              <View style={styles.rowFields}>
                <View style={[styles.fieldGroup, styles.halfField]}>
                  <Text style={styles.fieldLabel}>Nº de referencia</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ej: ABC123"
                    placeholderTextColor={Colors.textTertiary}
                    value={tripDocRefNumber}
                    onChangeText={(t) => {
                      setTripDocRefNumber(t);
                      markChanged();
                    }}
                    returnKeyType="next"
                    autoCapitalize="characters"
                    maxLength={50}
                  />
                </View>
                <View style={[styles.fieldGroup, styles.halfField]}>
                  <Text style={styles.fieldLabel}>Fecha</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="AAAA-MM-DD"
                    placeholderTextColor={Colors.textTertiary}
                    value={tripDocDate}
                    onChangeText={(t) => {
                      setTripDocDate(t);
                      markChanged();
                    }}
                    returnKeyType="next"
                    keyboardType="numbers-and-punctuation"
                    maxLength={10}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Notas adicionales</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Cualquier información extra relevante..."
                  placeholderTextColor={Colors.textTertiary}
                  value={tripDocNotes}
                  onChangeText={(t) => {
                    setTripDocNotes(t);
                    markChanged();
                  }}
                  multiline
                  textAlignVertical="top"
                  maxLength={500}
                  scrollEnabled={false}
                />
              </View>

              {/* Tip */}
              <View style={styles.tipContainer}>
                <Ionicons
                  name="bulb-outline"
                  size={16}
                  color={Colors.categoryDocument}
                  style={styles.tipIcon}
                />
                <Text style={styles.tipText}>
                  Guarda el número de referencia para encontrar fácilmente tus reservas y
                  confirmaciones.
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },

  // ─── Header ─────────────────────────────────────────────────

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  headerBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  headerTitleArea: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    lineHeight: 22,
  },
  headerSubtitle: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerDeleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.errorMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.border,
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textInverse,
  },
  saveButtonTextDisabled: {
    color: Colors.textTertiary,
  },

  // ─── Form content ──────────────────────────────────────────

  formContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },

  // ─── Type selector ─────────────────────────────────────────

  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
  },
  typeSelectorIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  typeSelectorText: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },

  // ─── Type picker dropdown ──────────────────────────────────

  typePicker: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    marginTop: -Spacing.sm,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderLight,
  },
  typePickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  typePickerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  typePickerText: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },

  // ─── Section / Field styles ────────────────────────────────

  sectionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  textInput: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: Layout.inputHeight,
  },
  textArea: {
    minHeight: 100,
    paddingTop: Spacing.md,
  },
  fieldHint: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    lineHeight: FontSizes.sm * 1.5,
  },
  rowFields: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfField: {
    flex: 1,
  },

  // ─── Tips & security ───────────────────────────────────────

  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.infoMuted,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginTop: Spacing.sm,
  },
  tipIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    lineHeight: FontSizes.sm * 1.6,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.accentMuted,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginTop: Spacing.lg,
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
});
