export type ChecklistCategory =
  | 'clothing'
  | 'technology'
  | 'documents'
  | 'hygiene'
  | 'medication'
  | 'accessories'
  | 'other';

export interface ChecklistItem {
  id: string;
  tripId: string;
  name: string;
  category: ChecklistCategory;
  quantity: number;
  isPacked: boolean;
  createdAt: string;
  updatedAt: string;
}

export const CHECKLIST_CATEGORIES: Record<ChecklistCategory, string> = {
  clothing: 'Ropa',
  technology: 'Tecnología',
  documents: 'Documentos',
  hygiene: 'Higiene',
  medication: 'Medicamentos',
  accessories: 'Accesorios',
  other: 'Otros',
};

export const CHECKLIST_ICONS: Record<ChecklistCategory, string> = {
  clothing: 'shirt',
  technology: 'laptop',
  documents: 'document-text',
  hygiene: 'water',
  medication: 'medkit',
  accessories: 'glasses',
  other: 'cube',
};

export const CHECKLIST_COLORS: Record<ChecklistCategory, string> = {
  clothing: '#9F7AEA',
  technology: '#4299E1',
  documents: '#ED8936',
  hygiene: '#0BC5EA',
  medication: '#F56565',
  accessories: '#ED64A6',
  other: '#A0AEC0',
};

export type ChecklistFormData = Omit<ChecklistItem, 'id' | 'tripId' | 'createdAt' | 'updatedAt'>;

export const getEmptyChecklistForm = (
  category: ChecklistCategory = 'other'
): ChecklistFormData => ({
  name: '',
  category,
  quantity: 1,
  isPacked: false,
});

export const createChecklistItem = (
  tripId: string,
  data: ChecklistFormData
): ChecklistItem => {
  const now = new Date().toISOString();
  return {
    id: `chk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    tripId,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
};

// Template types

export type TemplateType = 'beach' | 'mountain' | 'business' | 'generic';

export const TEMPLATE_NAMES: Record<TemplateType, string> = {
  beach: 'Viaje de playa',
  mountain: 'Montaña / Aventura',
  business: 'Viaje de negocios',
  generic: 'Viaje genérico',
};

export const TEMPLATE_ICONS: Record<TemplateType, string> = {
  beach: 'sunny',
  mountain: 'trail-sign',
  business: 'briefcase',
  generic: 'airplane',
};

export interface TemplateItem {
  name: string;
  category: ChecklistCategory;
  quantity: number;
}

export const CHECKLIST_TEMPLATES: Record<TemplateType, TemplateItem[]> = {
  beach: [
    { name: 'Bañador', category: 'clothing', quantity: 2 },
    { name: 'Protector solar', category: 'hygiene', quantity: 1 },
    { name: 'Toalla de playa', category: 'accessories', quantity: 1 },
    { name: 'Gafas de sol', category: 'accessories', quantity: 1 },
    { name: 'Chanclas', category: 'clothing', quantity: 1 },
    { name: 'Sombrero / gorra', category: 'accessories', quantity: 1 },
    { name: 'After sun', category: 'hygiene', quantity: 1 },
    { name: 'Camisetas', category: 'clothing', quantity: 4 },
    { name: 'Pantalones cortos', category: 'clothing', quantity: 3 },
    { name: 'Ropa interior', category: 'clothing', quantity: 5 },
    { name: 'Cargador móvil', category: 'technology', quantity: 1 },
    { name: 'Pasaporte / DNI', category: 'documents', quantity: 1 },
    { name: 'Tarjeta sanitaria', category: 'documents', quantity: 1 },
    { name: 'Bolsa impermeable', category: 'accessories', quantity: 1 },
    { name: 'Cepillo de dientes', category: 'hygiene', quantity: 1 },
    { name: 'Champú / gel', category: 'hygiene', quantity: 1 },
    { name: 'Desodorante', category: 'hygiene', quantity: 1 },
    { name: 'Sandalias', category: 'clothing', quantity: 1 },
    { name: 'Libro / e-reader', category: 'accessories', quantity: 1 },
    { name: 'Snorkel', category: 'accessories', quantity: 1 },
  ],
  mountain: [
    { name: 'Botas de montaña', category: 'clothing', quantity: 1 },
    { name: 'Mochila de senderismo', category: 'accessories', quantity: 1 },
    { name: 'Cantimplora', category: 'accessories', quantity: 1 },
    { name: 'Linterna / frontal', category: 'accessories', quantity: 1 },
    { name: 'Chubasquero', category: 'clothing', quantity: 1 },
    { name: 'Forro polar', category: 'clothing', quantity: 1 },
    { name: 'Pantalones de trekking', category: 'clothing', quantity: 2 },
    { name: 'Camisetas técnicas', category: 'clothing', quantity: 3 },
    { name: 'Calcetines de trekking', category: 'clothing', quantity: 4 },
    { name: 'Ropa interior', category: 'clothing', quantity: 5 },
    { name: 'Gorra / gorro', category: 'accessories', quantity: 1 },
    { name: 'Gafas de sol', category: 'accessories', quantity: 1 },
    { name: 'Protector solar', category: 'hygiene', quantity: 1 },
    { name: 'Protector labial', category: 'hygiene', quantity: 1 },
    { name: 'Botiquín básico', category: 'medication', quantity: 1 },
    { name: 'Bastones de trekking', category: 'accessories', quantity: 1 },
    { name: 'Navaja multiusos', category: 'accessories', quantity: 1 },
    { name: 'Mapa / GPS', category: 'technology', quantity: 1 },
    { name: 'Power bank', category: 'technology', quantity: 1 },
    { name: 'Pasaporte / DNI', category: 'documents', quantity: 1 },
  ],
  business: [
    { name: 'Traje / blazer', category: 'clothing', quantity: 1 },
    { name: 'Camisas', category: 'clothing', quantity: 3 },
    { name: 'Pantalones de vestir', category: 'clothing', quantity: 2 },
    { name: 'Zapatos de vestir', category: 'clothing', quantity: 1 },
    { name: 'Cinturón', category: 'accessories', quantity: 1 },
    { name: 'Corbata', category: 'accessories', quantity: 1 },
    { name: 'Ropa interior', category: 'clothing', quantity: 4 },
    { name: 'Calcetines', category: 'clothing', quantity: 4 },
    { name: 'Pijama', category: 'clothing', quantity: 1 },
    { name: 'Portátil', category: 'technology', quantity: 1 },
    { name: 'Cargador portátil', category: 'technology', quantity: 1 },
    { name: 'Adaptador de enchufe', category: 'technology', quantity: 1 },
    { name: 'Cargador móvil', category: 'technology', quantity: 1 },
    { name: 'Auriculares', category: 'technology', quantity: 1 },
    { name: 'Tarjetas de visita', category: 'documents', quantity: 1 },
    { name: 'Pasaporte / DNI', category: 'documents', quantity: 1 },
    { name: 'Tarjeta de embarque', category: 'documents', quantity: 1 },
    { name: 'Neceser', category: 'hygiene', quantity: 1 },
    { name: 'Cepillo de dientes', category: 'hygiene', quantity: 1 },
    { name: 'Desodorante', category: 'hygiene', quantity: 1 },
  ],
  generic: [
    { name: 'Camisetas', category: 'clothing', quantity: 4 },
    { name: 'Pantalones', category: 'clothing', quantity: 2 },
    { name: 'Ropa interior', category: 'clothing', quantity: 5 },
    { name: 'Calcetines', category: 'clothing', quantity: 5 },
    { name: 'Pijama', category: 'clothing', quantity: 1 },
    { name: 'Sudadera / jersey', category: 'clothing', quantity: 1 },
    { name: 'Zapatillas cómodas', category: 'clothing', quantity: 1 },
    { name: 'Cepillo de dientes', category: 'hygiene', quantity: 1 },
    { name: 'Pasta de dientes', category: 'hygiene', quantity: 1 },
    { name: 'Champú / gel', category: 'hygiene', quantity: 1 },
    { name: 'Desodorante', category: 'hygiene', quantity: 1 },
    { name: 'Cargador móvil', category: 'technology', quantity: 1 },
    { name: 'Power bank', category: 'technology', quantity: 1 },
    { name: 'Auriculares', category: 'technology', quantity: 1 },
    { name: 'Adaptador enchufe', category: 'technology', quantity: 1 },
    { name: 'Pasaporte / DNI', category: 'documents', quantity: 1 },
    { name: 'Tarjeta sanitaria', category: 'documents', quantity: 1 },
    { name: 'Seguro de viaje', category: 'documents', quantity: 1 },
    { name: 'Medicación habitual', category: 'medication', quantity: 1 },
    { name: 'Gafas de sol', category: 'accessories', quantity: 1 },
  ],
};

// Helpers

export const getChecklistProgress = (
  items: ChecklistItem[]
): { packed: number; total: number; percentage: number } => {
  const total = items.length;
  const packed = items.filter((item) => item.isPacked).length;
  const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;
  return { packed, total, percentage };
};

export const getChecklistByCategory = (
  items: ChecklistItem[]
): Record<ChecklistCategory, ChecklistItem[]> => {
  const result: Record<ChecklistCategory, ChecklistItem[]> = {
    clothing: [],
    technology: [],
    documents: [],
    hygiene: [],
    medication: [],
    accessories: [],
    other: [],
  };

  items.forEach((item) => {
    result[item.category].push(item);
  });

  return result;
};

export const getCategoryProgress = (
  items: ChecklistItem[]
): { packed: number; total: number } => {
  const total = items.length;
  const packed = items.filter((item) => item.isPacked).length;
  return { packed, total };
};
