import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TravelColors } from '@/constants/Colors';
import { radius, shadow, spacing } from '@/theme/tokens';
import { PlaceOfInterest } from '@/types/travel';

interface PlaceCardProps {
	place: PlaceOfInterest;
	onPress?: () => void;
	onToggleVisited?: (id: string, visited: boolean) => void;
}

export default function PlaceCard({ place, onPress, onToggleVisited }: PlaceCardProps) {
	return (
		<TouchableOpacity style={styles.card} onPress={onPress}>
			<ThemedView style={styles.cardContent}>
				<ThemedView style={styles.header}>
					<ThemedText type="subtitle" style={styles.name}>
						{place.name}
					</ThemedText>
					<TouchableOpacity
						style={styles.visitedButton}
						onPress={() => onToggleVisited?.(place.id, !place.visited)}
					>
						<Ionicons
							name={place.visited ? 'checkmark-circle' : 'checkmark-circle-outline'}
							size={24}
							color={place.visited ? TravelColors.success : TravelColors.gray400}
						/>
					</TouchableOpacity>
				</ThemedView>
        
				<ThemedView style={styles.locationContainer}>
					<Ionicons name="location" size={16} color={TravelColors.textSecondary} />
					<ThemedText style={styles.locationText}>{place.location}</ThemedText>
				</ThemedView>
        
				{place.description && (
					<ThemedText style={styles.description}>{place.description}</ThemedText>
				)}
        
				{place.rating && (
					<ThemedView style={styles.ratingContainer}>
						<Ionicons name="star" size={16} color={TravelColors.warning} />
						<ThemedText style={styles.ratingText}>{place.rating}/5</ThemedText>
					</ThemedView>
				)}
        
				{place.notes && (
					<ThemedView style={styles.notesContainer}>
						<Ionicons name="document-text" size={16} color={TravelColors.textSecondary} />
						<ThemedText style={styles.notesText}>{place.notes}</ThemedText>
					</ThemedView>
				)}
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
	header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
	name: { flex: 1, marginRight: spacing.lg, fontSize: 18, fontWeight: '600', color: TravelColors.textPrimary },
	visitedButton: { padding: spacing.sm, borderRadius: radius.md, backgroundColor: TravelColors.gray50, borderWidth: 1, borderColor: TravelColors.gray200 },
	locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, backgroundColor: TravelColors.gray50, paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: radius.md, borderWidth: 1, borderColor: TravelColors.gray200 },
	locationText: { fontSize: 14, color: TravelColors.textPrimary, marginLeft: spacing.md, flex: 1, fontWeight: '500' },
	description: { fontSize: 15, color: TravelColors.textSecondary, lineHeight: 22, marginBottom: spacing.md, fontWeight: '400' },
	ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, backgroundColor: `${TravelColors.warning}20`, paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.md, alignSelf: 'flex-start', borderWidth: 1, borderColor: `${TravelColors.warning}40` },
	ratingText: { fontSize: 14, color: TravelColors.warning, marginLeft: 6, fontWeight: '600' },
	notesContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.md, backgroundColor: `${TravelColors.primary}10`, paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: radius.md, borderWidth: 1, borderColor: `${TravelColors.primary}30` },
	notesText: { fontSize: 13, color: TravelColors.primary, marginLeft: spacing.md, flex: 1, fontStyle: 'italic', fontWeight: '500' },
});
