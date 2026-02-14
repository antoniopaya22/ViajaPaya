import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TravelColors } from '@/constants/Colors';
import { BookingCard } from '@/features/bookings';
import { PlaceCard } from '@/features/places';
import { radius, shadow, spacing, typography } from '@/theme/tokens';
import { Booking, BOOKING_TYPES, BookingType, PlaceOfInterest, Trip } from '@/types/travel';

interface TripDetailScreenProps {
	trip: Trip;
	onUpdateTrip: (updatedTrip: Trip) => void;
	onBack?: () => void;
}

export default function TripDetailScreen({ trip, onUpdateTrip, onBack }: TripDetailScreenProps) {
	const [activeTab, setActiveTab] = useState<'bookings' | 'itinerary' | 'places'>('bookings');

	const addBooking = () => {
		Alert.alert(
			'Nueva Reserva',
			'Selecciona el tipo de reserva:',
			[
				{ text: 'Vuelo', onPress: () => showAddBookingForm('flight') },
				{ text: 'Hotel', onPress: () => showAddBookingForm('hotel') },
				{ text: 'Transporte', onPress: () => showAddBookingForm('transport') },
				{ text: 'Actividad', onPress: () => showAddBookingForm('activity') },
				{ text: 'Cancelar', style: 'cancel' },
			]
		);
	};

	const showAddBookingForm = (type: BookingType) => {
		Alert.prompt(
			`Nueva ${BOOKING_TYPES[type]}`,
			'Nombre de la reserva:',
			(text) => {
				if (text) {
					const newBooking: Booking = {
						id: Date.now().toString(),
						type,
						name: text,
						location: 'Ubicación por definir',
						date: new Date().toISOString().split('T')[0],
						time: '00:00',
						confirmationNumber: `CNF${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
					};
          
					const updatedTrip = {
						...trip,
						bookings: [...trip.bookings, newBooking],
					};
					onUpdateTrip(updatedTrip);
				}
			}
		);
	};

	const addPlace = () => {
		Alert.prompt(
			'Nuevo Lugar de Interés',
			'Nombre del lugar:',
			(text) => {
				if (text) {
					const newPlace: PlaceOfInterest = {
						id: Date.now().toString(),
						name: text,
						location: 'Ubicación por definir',
						description: '',
						visited: false,
					};
          
					const updatedTrip = {
						...trip,
						placesOfInterest: [...trip.placesOfInterest, newPlace],
					};
					onUpdateTrip(updatedTrip);
				}
			}
		);
	};

	const togglePlaceVisited = (placeId: string, visited: boolean) => {
		const updatedPlaces = trip.placesOfInterest.map(place =>
			place.id === placeId ? { ...place, visited } : place
		);
    
		const updatedTrip = {
			...trip,
			placesOfInterest: updatedPlaces,
		};
		onUpdateTrip(updatedTrip);
	};

	return (
		<ThemedView style={styles.container}>
			{/* Header with gradient and back button */}
			<LinearGradient
				colors={[TravelColors.gradient.start, TravelColors.gradient.end]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.header}
			>
				<TouchableOpacity
					style={styles.backButton}
					onPress={onBack}
				>
					<Ionicons name="arrow-back" size={24} color={TravelColors.textOnPrimary} />
				</TouchableOpacity>
				<ThemedView style={styles.headerContent}>
					<ThemedText type="title" style={styles.headerTitle}>{trip.name}</ThemedText>
					<ThemedText style={styles.destination}>{trip.destination}</ThemedText>
					<ThemedView style={styles.dateContainer}>
						<Ionicons name="calendar" size={16} color={TravelColors.textOnPrimary} />
						<ThemedText style={styles.dateText}>
							{trip.startDate} - {trip.endDate}
						</ThemedText>
					</ThemedView>
				</ThemedView>
			</LinearGradient>

			{/* Top Tabs */}
			<ThemedView style={styles.topTabContainer}>
				<TouchableOpacity
					style={[styles.topTab, activeTab === 'bookings' && styles.activeTopTab]}
					onPress={() => setActiveTab('bookings')}
					activeOpacity={0.8}
				>
					<ThemedView style={[styles.tabIconContainer, activeTab === 'bookings' && styles.activeTabIconContainer]}>
						<Ionicons 
							name="checkmark-circle" 
							size={20} 
							color={activeTab === 'bookings' ? TravelColors.textOnPrimary : TravelColors.primary} 
						/>
						{trip.bookings.length > 0 && (
							<ThemedView style={styles.badge}>
								<ThemedText style={styles.badgeText}>{trip.bookings.length}</ThemedText>
							</ThemedView>
						)}
					</ThemedView>
					<ThemedText style={[styles.topTabText, activeTab === 'bookings' && styles.activeTopTabText]}>
						Reservas
					</ThemedText>
					{activeTab === 'bookings' && <ThemedView style={styles.tabIndicator} />}
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.topTab, activeTab === 'itinerary' && styles.activeTopTab]}
					onPress={() => setActiveTab('itinerary')}
					activeOpacity={0.8}
				>
					<ThemedView style={[styles.tabIconContainer, activeTab === 'itinerary' && styles.activeTabIconContainer]}>
						<Ionicons 
							name="map" 
							size={20} 
							color={activeTab === 'itinerary' ? TravelColors.textOnPrimary : TravelColors.primary} 
						/>
					</ThemedView>
					<ThemedText style={[styles.topTabText, activeTab === 'itinerary' && styles.activeTopTabText]}>
						Itinerario
					</ThemedText>
					{activeTab === 'itinerary' && <ThemedView style={styles.tabIndicator} />}
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.topTab, activeTab === 'places' && styles.activeTopTab]}
					onPress={() => setActiveTab('places')}
					activeOpacity={0.8}
				>
					<ThemedView style={[styles.tabIconContainer, activeTab === 'places' && styles.activeTabIconContainer]}>
						<Ionicons 
							name="location" 
							size={20} 
							color={activeTab === 'places' ? TravelColors.textOnPrimary : TravelColors.primary} 
						/>
						{trip.placesOfInterest.length > 0 && (
							<ThemedView style={styles.badge}>
								<ThemedText style={styles.badgeText}>{trip.placesOfInterest.length}</ThemedText>
							</ThemedView>
						)}
					</ThemedView>
					<ThemedText style={[styles.topTabText, activeTab === 'places' && styles.activeTopTabText]}>
						Lugares
					</ThemedText>
					{activeTab === 'places' && <ThemedView style={styles.tabIndicator} />}
				</TouchableOpacity>
			</ThemedView>

			{/* Content */}
			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{activeTab === 'bookings' ? (
					<ThemedView style={styles.section}>
						{trip.bookings.map((booking) => (
							<BookingCard
								key={booking.id}
								booking={booking}
								onPress={() => Alert.alert('Reserva', `Detalles de: ${booking.name}`)}
							/>
						))}
						{trip.bookings.length === 0 && (
							<ThemedView style={styles.emptyState}>
								<Ionicons name="calendar-outline" size={64} color={TravelColors.gray300} />
								<ThemedText style={styles.emptyText}>No hay reservas aún</ThemedText>
								<ThemedText style={styles.emptySubtext}>
									Comienza agregando vuelos, hoteles o actividades para organizar tu viaje
								</ThemedText>
							</ThemedView>
						)}
					</ThemedView>
				) : activeTab === 'itinerary' ? (
					<ThemedView style={styles.section}>
						<ThemedView style={styles.emptyState}>
							<Ionicons name="map-outline" size={64} color={TravelColors.gray300} />
							<ThemedText style={styles.emptyText}>Itinerario próximamente</ThemedText>
							<ThemedText style={styles.emptySubtext}>
								Pronto podrás crear y gestionar el itinerario detallado de tu viaje
							</ThemedText>
						</ThemedView>
					</ThemedView>
				) : (
					<ThemedView style={styles.section}>
						{trip.placesOfInterest.map((place) => (
							<PlaceCard
								key={place.id}
								place={place}
								onPress={() => Alert.alert('Lugar', `Detalles de: ${place.name}`)}
								onToggleVisited={togglePlaceVisited}
							/>
						))}
						{trip.placesOfInterest.length === 0 && (
							<ThemedView style={styles.emptyState}>
								<Ionicons name="location-outline" size={64} color={TravelColors.gray300} />
								<ThemedText style={styles.emptyText}>No hay lugares de interés</ThemedText>
								<ThemedText style={styles.emptySubtext}>
									Agrega lugares que quieras visitar y mantén un registro de tus aventuras
								</ThemedText>
							</ThemedView>
						)}
					</ThemedView>
				)}
			</ScrollView>

			{/* Add Button */}
			<TouchableOpacity
				style={styles.addButton}
				onPress={activeTab === 'bookings' ? addBooking : activeTab === 'places' ? addPlace : () => Alert.alert('Itinerario', 'Próximamente...')}
			>
				<Ionicons name="add" size={24} color={TravelColors.textOnPrimary} />
			</TouchableOpacity>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: TravelColors.background,
	},
	header: { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.xl, paddingTop: 60, ...shadow.raised },
	backButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: radius.pill, width: 44, height: 44, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.3)', marginRight: spacing.lg, marginTop: 10 },
	headerContent: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	headerTitle: { color: TravelColors.textOnPrimary, ...typography.title, marginBottom: spacing.sm },
	destination: { fontSize: 16, color: TravelColors.textOnPrimary, marginBottom: spacing.md, fontWeight: '600', opacity: 0.9 },
	dateContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: spacing.lg, paddingVertical: 10, borderRadius: radius.md, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
	dateText: { fontSize: 14, color: TravelColors.textOnPrimary, fontWeight: '700', marginLeft: spacing.md },
	topTabContainer: { flexDirection: 'row', backgroundColor: TravelColors.cardBackground, ...shadow.card, borderBottomWidth: 1, borderBottomColor: TravelColors.gray200, paddingHorizontal: spacing.sm, paddingTop: spacing.sm },
	topTab: { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: spacing.sm, backgroundColor: 'transparent', borderRadius: radius.lg, marginHorizontal: 4, position: 'relative', minHeight: 80 },
	activeTopTab: { backgroundColor: 'rgba(255, 107, 53, 0.1)' },
	tabIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: TravelColors.gray100, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm, borderWidth: 2, borderColor: 'transparent' },
	activeTabIconContainer: { 
		backgroundColor: TravelColors.primary, 
		borderColor: TravelColors.secondary, 
		elevation: 4, 
		borderWidth: 2,
		...(Platform.OS === 'web' ? 
			{ boxShadow: '0px 2px 8px rgba(42, 160, 224, 0.3)' } : 
			{ shadowColor: TravelColors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8 }
		)
	},
	topTabText: { fontSize: 12, color: TravelColors.textSecondary, fontWeight: '600', textAlign: 'center' },
	activeTopTabText: { color: TravelColors.primary, fontWeight: '700' },
	tabIndicator: { position: 'absolute', bottom: 0, left: '50%', marginLeft: -15, width: 30, height: 3, backgroundColor: TravelColors.primary, borderRadius: 2 },
	badge: { position: 'absolute', top: -4, right: -4, backgroundColor: TravelColors.accent, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, borderWidth: 2, borderColor: TravelColors.cardBackground },
	badgeText: {
		fontSize: 11,
		color: TravelColors.textOnPrimary,
		fontWeight: '700',
	},
	content: {
		flex: 1,
	},
	section: { padding: spacing.xl },
	emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: spacing.xl },
	emptyText: { fontSize: 20, color: TravelColors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.md, fontWeight: '600' },
	emptySubtext: { fontSize: 16, color: TravelColors.textSecondary, textAlign: 'center', lineHeight: 24, fontWeight: '400' },
	addButton: { position: 'absolute', bottom: 30, right: spacing.xl, backgroundColor: TravelColors.primary, borderRadius: 32, width: 64, height: 64, justifyContent: 'center', alignItems: 'center', ...shadow.raised },
});
