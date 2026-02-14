import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TravelColors } from '@/constants/Colors';
import { shadow, spacing } from '@/theme/tokens';

interface MenuDrawerProps {
	visible: boolean;
	onClose: () => void;
}

export default function MenuDrawer({ visible, onClose }: MenuDrawerProps) {
	const menuItems = [
		{ icon: 'person-outline', label: 'Mi Perfil', action: () => Alert.alert('Perfil', 'Próximamente...') },
		{ icon: 'settings-outline', label: 'Configuración', action: () => Alert.alert('Configuración', 'Próximamente...') },
		{ icon: 'help-circle-outline', label: 'Ayuda', action: () => Alert.alert('Ayuda', 'Próximamente...') },
		{ icon: 'information-circle-outline', label: 'Acerca de', action: () => Alert.alert('Acerca de', 'Travel App v1.0') },
	];

	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="slide"
			onRequestClose={onClose}
		>
			<TouchableOpacity 
				style={styles.overlay} 
				activeOpacity={1} 
				onPress={onClose}
			>
				<TouchableOpacity 
					style={styles.drawer} 
					activeOpacity={1}
					onPress={(e) => e.stopPropagation()}
				>
					{/* Header with gradient */}
					<LinearGradient
						colors={[TravelColors.gradient.start, TravelColors.gradient.end]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.drawerHeader}
					>
						<ThemedView style={styles.userSection}>
							<ThemedView style={styles.avatar}>
								<Ionicons name="person" size={32} color={TravelColors.textOnPrimary} />
							</ThemedView>
							<ThemedText style={styles.userName}>Usuario Viajero</ThemedText>
							<ThemedText style={styles.userEmail}>usuario@example.com</ThemedText>
						</ThemedView>
					</LinearGradient>

					{/* Menu Items */}
					<ThemedView style={styles.menuContent}>
						{menuItems.map((item, index) => (
							<TouchableOpacity
								key={index}
								style={styles.menuItem}
								onPress={() => {
									item.action();
									onClose();
								}}
							>
								<Ionicons name={item.icon as any} size={24} color={TravelColors.primary} />
								<ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
								<Ionicons name="chevron-forward" size={20} color={TravelColors.gray400} />
							</TouchableOpacity>
						))}
					</ThemedView>

					{/* Footer */}
					<ThemedView style={styles.drawerFooter}>
						<TouchableOpacity style={styles.logoutButton} onPress={onClose}>
							<Ionicons name="log-out-outline" size={20} color={TravelColors.error} />
							<ThemedText style={styles.logoutText}>Cerrar Sesión</ThemedText>
						</TouchableOpacity>
					</ThemedView>
				</TouchableOpacity>
			</TouchableOpacity>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	drawer: {
		width: '80%',
		height: '100%',
		backgroundColor: TravelColors.cardBackground,
		...shadow.raised,
		shadowOffset: { width: 4, height: 0 },
		shadowOpacity: 0.25,
	},
	drawerHeader: { paddingTop: 60, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl },
	userSection: {
		backgroundColor: 'transparent',
		alignItems: 'center',
	},
	avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg, borderWidth: 3, borderColor: 'rgba(255, 255, 255, 0.3)' },
	userName: { fontSize: 20, fontWeight: '700', color: TravelColors.textOnPrimary, marginBottom: spacing.xs },
	userEmail: {
		fontSize: 14,
		color: TravelColors.textOnPrimary,
		opacity: 0.8,
	},
	menuContent: { flex: 1, paddingTop: spacing.xl },
	menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, borderBottomWidth: 1, borderBottomColor: TravelColors.gray100 },
	menuLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: TravelColors.textPrimary, marginLeft: spacing.lg },
	drawerFooter: { paddingHorizontal: spacing.xl, paddingVertical: spacing.xl, borderTopWidth: 1, borderTopColor: TravelColors.gray200 },
	logoutButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
	logoutText: { fontSize: 16, fontWeight: '600', color: TravelColors.error, marginLeft: spacing.md },
});
