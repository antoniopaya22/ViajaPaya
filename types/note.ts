export type NoteCategory =
  | 'food'
  | 'language'
  | 'directions'
  | 'emergency'
  | 'tips'
  | 'general';

export interface Note {
  id: string;
  tripId: string;
  title: string;
  content: string;
  category?: NoteCategory;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const NOTE_CATEGORIES: Record<NoteCategory, string> = {
  food: 'Restaurantes y comida',
  language: 'Idioma y frases útiles',
  directions: 'Direcciones y lugares',
  emergency: 'Emergencias y seguridad',
  tips: 'Consejos y tips',
  general: 'General',
};

export const NOTE_ICONS: Record<NoteCategory, string> = {
  food: 'restaurant',
  language: 'chatbubbles',
  directions: 'navigate',
  emergency: 'warning',
  tips: 'bulb',
  general: 'document-text',
};

export const NOTE_COLORS: Record<NoteCategory, string> = {
  food: '#ED8936',
  language: '#9F7AEA',
  directions: '#4299E1',
  emergency: '#F56565',
  tips: '#ECC94B',
  general: '#A0AEC0',
};

export type NoteFormData = Omit<Note, 'id' | 'tripId' | 'createdAt' | 'updatedAt'>;

export const getEmptyNoteForm = (): NoteFormData => ({
  title: '',
  content: '',
  category: 'general',
  isPinned: false,
});

export const createNote = (tripId: string, data: NoteFormData): Note => {
  const now = new Date().toISOString();
  return {
    id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    tripId,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Sorts notes so pinned notes come first, then by most recent update.
 */
export const sortNotes = (notes: Note[]): Note[] => {
  return [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
};

/**
 * Returns a preview of the note content (first ~80 characters).
 */
export const getNotePreview = (content: string, maxLength: number = 80): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trimEnd() + '...';
};

/**
 * Filters notes by category. Returns all notes if category is undefined.
 */
export const filterNotesByCategory = (
  notes: Note[],
  category?: NoteCategory
): Note[] => {
  if (!category) return notes;
  return notes.filter((note) => note.category === category);
};

/**
 * Searches notes by title or content matching a query string.
 */
export const searchNotes = (notes: Note[], query: string): Note[] => {
  if (!query.trim()) return notes;
  const normalizedQuery = query.toLowerCase().trim();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(normalizedQuery) ||
      note.content.toLowerCase().includes(normalizedQuery)
  );
};
