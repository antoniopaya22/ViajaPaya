import { useState } from 'react';
import { View } from 'react-native';

import { useAuth } from '@/contexts/AuthProvider';
import { Button, Screen, Text, TextField } from '@/components/ui';
import { useTheme } from '@/theme';

type Step = 'email' | 'code';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function LoginScreen() {
  const { spacing } = useTheme();
  const { sendOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      setError('Introduce un email válido.');
      return;
    }
    setError(null);
    setSubmitting(true);
    const { error: sendError } = await sendOtp(email.trim());
    setSubmitting(false);
    if (sendError) {
      setError(sendError);
      return;
    }
    setStep('code');
  };

  const handleVerifyOtp = async () => {
    if (code.trim().length < 6) {
      setError('El código tiene 6 dígitos.');
      return;
    }
    setError(null);
    setSubmitting(true);
    const { error: verifyError } = await verifyOtp(email.trim(), code.trim());
    setSubmitting(false);
    if (verifyError) {
      setError(verifyError);
    }
    // Si no hay error, AuthProvider actualiza la sesión y el AuthGate redirige solo.
  };

  return (
    <Screen scroll>
      <View style={{ paddingTop: spacing.huge, gap: spacing.xxs, alignItems: 'center' }}>
        <Text variant="display">ViajaPayá</Text>
        <Text variant="subtitle" color="textSecondary">
          Tu viaje, siempre a mano
        </Text>
      </View>

      <View style={{ marginTop: spacing.xxxl, gap: spacing.md }}>
        {step === 'email' ? (
          <>
            <Text variant="h3">Inicia sesión</Text>
            <Text variant="body" color="textSecondary">
              Te enviamos un código de acceso a tu email, sin contraseña.
            </Text>
            <TextField
              label="Email"
              placeholder="tu@email.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={error}
            />
            <Button label="Enviar código" onPress={handleSendOtp} loading={submitting} fullWidth />
          </>
        ) : (
          <>
            <Text variant="h3">Revisa tu email</Text>
            <Text variant="body" color="textSecondary">
              Hemos enviado un código de 6 dígitos a {email}.
            </Text>
            <TextField
              label="Código"
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
              error={error}
            />
            <Button label="Verificar" onPress={handleVerifyOtp} loading={submitting} fullWidth />
            <Button
              label="Cambiar email"
              variant="ghost"
              fullWidth
              onPress={() => {
                setStep('email');
                setCode('');
                setError(null);
              }}
            />
          </>
        )}
      </View>
    </Screen>
  );
}
