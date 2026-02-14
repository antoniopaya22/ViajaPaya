import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TravelColors } from '@/constants/Colors';
import { radius, shadow, spacing } from '@/theme/tokens';
import { Booking, BOOKING_TYPES } from '@/types/travel';
import { bookingColor, bookingIcon } from '@/utils/booking';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface BookingCardProps {
	booking: Booking;
	onPress?: () => void;
}

const fallbackIcon = 'calendar';

export default function BookingCard({ booking, onPress }: BookingCardProps) {
	const iconName = bookingIcon[booking.type] || fallbackIcon;
	const iconColor = bookingColor[booking.type] || TravelColors.gray400;

	return (
		<TouchableOpacity style={styles.card} onPress={onPress}>
			<ThemedView style={styles.cardContent}>
				<ThemedView style={styles.header}>
					<ThemedView style={styles.typeContainer}>
						<Ionicons name={iconName as any} size={20} color={iconColor} />
						<ThemedText style={[styles.typeText, { color: iconColor }]}>
							{BOOKING_TYPES[booking.type]}
						</ThemedText>
					</ThemedView>
					<ThemedText style={styles.confirmationNumber}>
						{booking.confirmationNumber}
					</ThemedText>
				</ThemedView>
        
				<ThemedText type="subtitle" style={styles.name}>
					{booking.name}
				</ThemedText>
        
				<ThemedView style={styles.detailsContainer}>
					<ThemedView style={styles.detailRow}>
						<Ionicons name="location" size={16} color={TravelColors.textSecondary} />
						<ThemedText style={styles.detailText}>{booking.location}</ThemedText>
					</ThemedView>
          
					<ThemedView style={styles.detailRow}>
						<Ionicons name="calendar" size={16} color={TravelColors.textSecondary} />
						<ThemedText style={styles.detailText}>{booking.date}</ThemedText>
					</ThemedView>
          
					<ThemedView style={styles.detailRow}>
						<Ionicons name="time" size={16} color={TravelColors.textSecondary} />
						<ThemedText style={styles.detailText}>{booking.time}</ThemedText>
					</ThemedView>
				</ThemedView>
			</ThemedView>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: TravelColors.cardBackground,
		borderRadius: radius.lg,
		marginBottom: spacing.lg,
		...shadow.card,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: TravelColors.gray200,
	},
	cardContent: { padding: spacing.xl },
	header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
	typeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: TravelColors.gray50, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: TravelColors.gray200 },
	typeText: { fontSize: 13, fontWeight: '700', marginLeft: spacing.sm },
	confirmationNumber: { fontSize: 12, color: TravelColors.textSecondary, fontFamily: 'monospace', backgroundColor: TravelColors.gray50, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.sm, borderWidth: 1, borderColor: TravelColors.gray200 },
	name: { marginBottom: spacing.lg, fontSize: 18, fontWeight: '600', color: TravelColors.textPrimary },
	detailsContainer: { gap: spacing.md },
	detailRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: TravelColors.gray50, paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: radius.md, borderWidth: 1, borderColor: TravelColors.gray200 },
	detailText: { fontSize: 14, color: TravelColors.textPrimary, marginLeft: spacing.md, flex: 1, fontWeight: '500' },
});
