import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TravelColors } from '@/constants/Colors';
import { MenuDrawer } from '@/features/navigation';
import { TripDetailScreen } from '@/features/trips';
import TripListItem from '@/features/trips/components/TripListItem';
import { useTrips } from '@/features/trips/hooks/useTrips';
import CreateTripModal from '@/features/trips/modals/CreateTripModal';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TripsScreen() {
  const {
    trips,
    selectedTrip,
    selectTrip,
    addTrip,
    isCreateModalVisible,
    closeCreateModal,
    createTrip,
    refresh,
    isRefreshing,
    deleteTrip,
    getTripImage,
    updateTrip,
  } = useTrips();

  if (selectedTrip) {
    return (
      <TripDetailScreen
        trip={selectedTrip}
        onUpdateTrip={updateTrip}
        onBack={() => selectTrip(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with gradient and menu button */}
      <LinearGradient
        colors={[TravelColors.gradient.start, TravelColors.gradient.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => { /* TODO: implementar estado de menú global */ }}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={22} color={TravelColors.textOnPrimary} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>Mis Viajes</ThemedText>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={addTrip}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={22} color={TravelColors.textOnPrimary} />
        </TouchableOpacity>
      </LinearGradient>
      
      <FlatList
        data={trips}
        renderItem={({ item }) => (
          <TripListItem
            trip={item}
            onPress={() => selectTrip(item)}
            onLongPress={() => deleteTrip(item.id)}
            getImage={getTripImage}
          />
        )}
        keyExtractor={(item) => item.id}
        style={styles.tripsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            colors={[TravelColors.primary, TravelColors.secondary]} // Android
            tintColor={TravelColors.primary} // iOS
            title="Recargando viajes..."
            titleColor={TravelColors.textSecondary}
            progressBackgroundColor={TravelColors.cardBackground}
          />
        }
        ListEmptyComponent={() => (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={80} color={TravelColors.gray300} />
            <ThemedText style={styles.emptyTitle}>¡Comienza tu aventura!</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Crea tu primer viaje y comienza a planear experiencias increíbles
            </ThemedText>
            <TouchableOpacity 
              style={styles.emptyButton} 
              onPress={addTrip}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color={TravelColors.textOnPrimary} />
              <ThemedText style={styles.emptyButtonText}>Crear mi primer viaje</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      />

      {/* Menu Drawer */}
  {/* Menu Drawer (estado local podría moverse a un ui slice si crece) */}
  <MenuDrawer visible={false} onClose={() => {}} />

      {/* Create Trip Modal */}
      <CreateTripModal
        visible={isCreateModalVisible}
        onClose={closeCreateModal}
        onCreateTrip={createTrip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TravelColors.background,
    paddingBottom: Platform.OS === 'android' ? 5 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    elevation: 8,
    ...(Platform.OS === 'web' ? 
      { boxShadow: '0px 4px 12px rgba(42, 160, 224, 0.3)' } : 
      { shadowColor: TravelColors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }
    )
  },
  menuButton: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  headerTitle: {
    color: TravelColors.textOnPrimary,
    fontSize: 28,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    ...(Platform.OS === 'web' ? 
      { textShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)' } : 
      { textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }
    )
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    elevation: 4,
    ...(Platform.OS === 'web' ? 
      { boxShadow: '0px 2px 8px rgba(42, 160, 224, 0.2)' } : 
      { shadowColor: TravelColors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8 }
    )
  },
  tripsList: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: TravelColors.textPrimary,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: TravelColors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  emptyButton: {
    backgroundColor: TravelColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...(Platform.OS === 'web' ? 
      { boxShadow: '0px 4px 12px rgba(42, 160, 224, 0.3)' } : 
      { shadowColor: TravelColors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }
    )
  },
  emptyButtonText: {
    color: TravelColors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});
