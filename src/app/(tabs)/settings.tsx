import { Pressable, View } from 'react-native';

import { useAuth } from '@/contexts/AuthProvider';
import { Avatar, Card, Divider, Header, ListRow, Screen, Text } from '@/components/ui';
import { useTheme, type SchemePreference } from '@/theme';
import { displayNameFromEmail } from '@/utils/user';

const SCHEME_OPTIONS: { value: SchemePreference; label: string }[] = [
  { value: 'system', label: 'Automático' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
];

export default function SettingsScreen() {
  const { colors, spacing, radius, preference, setPreference } = useTheme();
  const { user, signOut } = useAuth();
  const email = user?.email ?? '';

  return (
    <Screen scroll>
      <Header title="Ajustes" />

      <Card style={{ marginTop: spacing.xs }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Avatar name={email ? displayNameFromEmail(email) : '?'} />
          <View>
            <Text variant="title">{email ? displayNameFromEmail(email) : 'Sin nombre'}</Text>
            <Text variant="bodySmall" color="textSecondary">
              {email}
            </Text>
          </View>
        </View>
      </Card>

      <Text variant="overline" color="textTertiary" style={{ marginTop: spacing.xl, marginBottom: spacing.xs }}>
        APARIENCIA
      </Text>
      <Card>
        <Text variant="title" style={{ marginBottom: spacing.sm }}>
          Tema
        </Text>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.surfaceAlt,
            borderRadius: radius.md,
            padding: 4,
            gap: 4,
          }}
        >
          {SCHEME_OPTIONS.map((option) => {
            const active = preference === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setPreference(option.value)}
                style={{
                  flex: 1,
                  paddingVertical: spacing.xs,
                  borderRadius: radius.sm,
                  alignItems: 'center',
                  backgroundColor: active ? colors.surface : 'transparent',
                }}
              >
                <Text variant="bodySmall" color={active ? 'textPrimary' : 'textSecondary'}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Text variant="overline" color="textTertiary" style={{ marginTop: spacing.xl, marginBottom: spacing.xs }}>
        CUENTA
      </Text>
      <Card>
        <ListRow icon="shield-checkmark-outline" title="Privacidad y datos" />
        <Divider />
        <ListRow icon="log-out-outline" title="Cerrar sesión" onPress={signOut} showChevron={false} />
      </Card>

      <Text variant="overline" color="textTertiary" style={{ marginTop: spacing.xl, marginBottom: spacing.xs }}>
        ACERCA DE
      </Text>
      <Card>
        <ListRow icon="information-circle-outline" title="Versión" subtitle="1.0.0" showChevron={false} />
      </Card>
    </Screen>
  );
}
