import { ThemedText } from '@/components/ThemedText';
import { Trip } from '@/types';
import { addDays, isAfter, toISODate } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface CreateTripModalProps { visible: boolean; onClose: () => void; onCreateTrip: (trip: Partial<Trip>) => void; }

export default function CreateTripModal({ visible, onClose, onCreateTrip }: CreateTripModalProps) {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const resetForm = () => { setTripName(''); setDestination(''); setStartDate(''); setEndDate(''); }; const handleClose = () => { resetForm(); onClose(); };
  const getTomorrowDate = (): string => toISODate(addDays(new Date(), 1));
  const getMinEndDate = (): string => { if (startDate) { const s = new Date(startDate); s.setDate(s.getDate() + 1); return s.toISOString().split('T')[0]; } return getTomorrowDate(); };
  const validateForm = () => { if (!tripName.trim()) return Alert.alert('Error','Por favor, ingresa un nombre para el viaje.'), false; if (!destination.trim()) return Alert.alert('Error','Por favor, ingresa un destino.'), false; if (!startDate) return Alert.alert('Error','Por favor, selecciona una fecha de inicio.'), false; if (!endDate) return Alert.alert('Error','Por favor, selecciona una fecha de fin.'), false; if (isAfter(startDate, endDate) || startDate === endDate) return Alert.alert('Error','La fecha de fin debe ser posterior a la fecha de inicio.'), false; return true; };
  const handleCreateTrip = () => { if (!validateForm()) return; onCreateTrip({ name: tripName.trim(), destination: destination.trim(), startDate, endDate, bookings: [], placesOfInterest: [] }); handleClose(); };
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose} accessibilityRole="button" accessibilityLabel="Cerrar modal"><Ionicons name="close" size={24} color="#666" /></TouchableOpacity>
          <ThemedText style={styles.title}>Crear Nuevo Viaje</ThemedText>
          <View style={styles.placeholder} />
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}><ThemedText style={styles.label}>Nombre del viaje</ThemedText><View style={styles.inputContainer}><Ionicons name="airplane-outline" size={20} color="#007AFF" style={styles.inputIcon} /><TextInput style={styles.textInput} value={tripName} onChangeText={setTripName} placeholder="Ej: Vacaciones en Europa" placeholderTextColor="#999" autoFocus returnKeyType="next" /></View></View>
          <View style={styles.inputGroup}><ThemedText style={styles.label}>Destino</ThemedText><View style={styles.inputContainer}><Ionicons name="location-outline" size={20} color="#007AFF" style={styles.inputIcon} /><TextInput style={styles.textInput} value={destination} onChangeText={setDestination} placeholder="Ej: París, Londres, Madrid" placeholderTextColor="#999" returnKeyType="next" /></View></View>
          <View style={styles.dateContainer}>
            <View style={styles.dateGroup}><ThemedText style={styles.label}>Fecha de inicio</ThemedText><View style={styles.inputContainer}><Ionicons name="calendar-outline" size={20} color="#007AFF" style={styles.inputIcon} />{Platform.OS === 'web' ? <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={getTomorrowDate()} style={styles.webDateInput as any} /> : <TextInput style={styles.textInput} value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" placeholderTextColor="#999" />}</View></View>
            <View style={styles.dateGroup}><ThemedText style={styles.label}>Fecha de fin</ThemedText><View style={styles.inputContainer}><Ionicons name="calendar-outline" size={20} color="#007AFF" style={styles.inputIcon} />{Platform.OS === 'web' ? <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={getMinEndDate()} style={styles.webDateInput as any} /> : <TextInput style={styles.textInput} value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD" placeholderTextColor="#999" />}</View></View>
          </View>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateTrip} accessibilityRole="button" accessibilityLabel="Crear viaje"><Ionicons name="add-circle-outline" size={20} color="white" /><ThemedText style={styles.createButtonText}>Crear Viaje</ThemedText></TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 20, 
    backgroundColor: 'white', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e1e5e9', 
    elevation: 3,
    ...(Platform.OS === 'web' ? 
      { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' } : 
      { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }
    )
  },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  placeholder: { width: 40 },
  content: { flex: 1, padding: 20 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderWidth: 1.5, 
    borderColor: '#e1e5e9', 
    elevation: 1,
    ...(Platform.OS === 'web' ? 
      { boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)' } : 
      { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }
    )
  },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, fontSize: 16, color: '#1a1a1a', padding: 0 },
  webDateInput: { flex: 1, fontSize: 16, color: '#1a1a1a', backgroundColor: 'transparent' },
  dateContainer: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  dateGroup: { flex: 1 },
  createButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#007AFF', 
    borderRadius: 12, 
    paddingVertical: 16, 
    paddingHorizontal: 24, 
    elevation: 6, 
    gap: 8,
    ...(Platform.OS === 'web' ? 
      { boxShadow: '0px 4px 8px rgba(0, 122, 255, 0.3)' } : 
      { shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }
    )
  },
  createButtonText: { fontSize: 16, fontWeight: '600', color: 'white' },
});
