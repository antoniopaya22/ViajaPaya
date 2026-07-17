import { EmptyState, Header, Screen } from '@/components/ui';

export default function DocumentsScreen() {
  return (
    <Screen scroll>
      <Header title="Documentos" subtitle="Pasaportes, entradas y billetes a mano" />

      <EmptyState
        icon="document-text-outline"
        title="Aún no tienes documentos"
        description="Adjunta tu pasaporte, DNI o las entradas de tus reservas para tenerlos siempre a mano, incluso sin conexión."
        actionLabel="Añadir documento"
      />
    </Screen>
  );
}
