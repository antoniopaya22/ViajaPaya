import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TravelColors } from '@/constants/Colors';
import { Trip } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  trip: Trip;
  onPress: () => void;
  onLongPress: () => void;
  getImage: (id: string, destination: string) => string;
}

export const TripListItem: React.FC<Props> = ({ trip, onPress, onLongPress, getImage }) => {
  return (
    <TouchableOpacity style={styles.tripCard} onPress={onPress} onLongPress={onLongPress} delayLongPress={800} activeOpacity={0.8}>
      <View style={styles.tripImageContainer}>
        <Image source={{ uri: getImage(trip.id, trip.destination) }} style={styles.tripImage} resizeMode="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.imageOverlay}>
          <ThemedView style={styles.tripImageContent}>
            <ThemedText style={styles.tripImageTitle}>{trip.name}</ThemedText>
            <ThemedView style={styles.tripImageDestination}>
              <Ionicons name="location" size={16} color="white" />
              <ThemedText style={styles.tripImageDestinationText}>{trip.destination}</ThemedText>
            </ThemedView>
          </ThemedView>
        </LinearGradient>
      </View>

      <ThemedView style={styles.tripCardContent}>
        <ThemedView style={styles.dateContainer}>
          <Ionicons name="calendar" size={18} color={TravelColors.primary} />
          <ThemedText style={styles.dateText}>
            {trip.startDate} - {trip.endDate}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <ThemedView style={[styles.statIcon, { backgroundColor: TravelColors.gray100 }]}> 
              <Ionicons name="checkmark-circle" size={18} color={TravelColors.success} />
            </ThemedView>
            <ThemedText style={styles.statText}>{trip.bookings.length} reservas</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedView style={[styles.statIcon, { backgroundColor: TravelColors.gray100 }]}> 
              <Ionicons name="location" size={18} color={TravelColors.warning} />
            </ThemedView>
            <ThemedText style={styles.statText}>{trip.placesOfInterest.length} lugares</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tripCard: {
    backgroundColor: TravelColors.cardBackground,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TravelColors.gray100,
    ...(Platform.OS === 'web' ? 
      { boxShadow: '0px 6px 16px rgba(42, 160, 224, 0.15)' } : 
      { shadowColor: TravelColors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 16 }
    )
  },
  tripImageContainer: { height: 160, position: 'relative' },
  tripImage: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', justifyContent: 'flex-end' },
  tripImageContent: { backgroundColor: 'transparent', padding: 20, paddingBottom: 16 },
  tripImageTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: 'white', 
    marginBottom: 8,
    ...(Platform.OS === 'web' ? 
      { textShadow: '0px 1px 4px rgba(0,0,0,0.8)' } : 
      { textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }
    )
  },
  tripImageDestination: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' },
  tripImageDestinationText: { 
    fontSize: 16, 
    color: 'white', 
    marginLeft: 6, 
    fontWeight: '600',
    ...(Platform.OS === 'web' ? 
      { textShadow: '0px 1px 3px rgba(0,0,0,0.6)' } : 
      { textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }
    )
  },
  tripCardContent: { padding: 20, paddingTop: 16 },
  dateContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: TravelColors.gray50, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, alignSelf: 'flex-start', borderWidth: 1, borderColor: TravelColors.gray200 },
  dateText: { fontSize: 14, color: TravelColors.textPrimary, fontWeight: '700', marginLeft: 10 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: TravelColors.gray50, borderRadius: 16, paddingVertical: 16, borderWidth: 1, borderColor: TravelColors.gray200 },
  statItem: { flexDirection: 'row', alignItems: 'center' },
  statIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  statText: { fontSize: 14, color: TravelColors.textSecondary, fontWeight: '600' },
});

export default TripListItem;
