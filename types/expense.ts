export type ExpenseCategory =
  | 'transport'
  | 'accommodation'
  | 'food'
  | 'activities'
  | 'shopping'
  | 'health'
  | 'communication'
  | 'other';

export interface Expense {
  id: string;
  tripId: string;
  concept: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: string; // ISO date YYYY-MM-DD
  notes?: string;
  attachments?: ExpenseAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseAttachment {
  id: string;
  name: string;
  uri: string;
  type: 'image' | 'pdf';
  createdAt: string;
}

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, string> = {
  transport: 'Transporte',
  accommodation: 'Alojamiento',
  food: 'Comida',
  activities: 'Actividades',
  shopping: 'Compras',
  health: 'Salud',
  communication: 'Comunicación',
  other: 'Otros',
};

export const EXPENSE_ICONS: Record<ExpenseCategory, string> = {
  transport: 'airplane',
  accommodation: 'bed',
  food: 'restaurant',
  activities: 'ticket',
  shopping: 'bag-handle',
  health: 'medkit',
  communication: 'phone-portrait',
  other: 'pricetag',
};

export const EXPENSE_COLORS: Record<ExpenseCategory, string> = {
  transport: '#4299E1',
  accommodation: '#9F7AEA',
  food: '#ED8936',
  activities: '#48BB78',
  shopping: '#ED64A6',
  health: '#F56565',
  communication: '#0BC5EA',
  other: '#A0AEC0',
};

export const CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dólar estadounidense' },
  { code: 'GBP', symbol: '£', name: 'Libra esterlina' },
  { code: 'JPY', symbol: '¥', name: 'Yen japonés' },
  { code: 'CHF', symbol: 'CHF', name: 'Franco suizo' },
  { code: 'CAD', symbol: 'CA$', name: 'Dólar canadiense' },
  { code: 'AUD', symbol: 'AU$', name: 'Dólar australiano' },
  { code: 'CNY', symbol: '¥', name: 'Yuan chino' },
  { code: 'MXN', symbol: 'MX$', name: 'Peso mexicano' },
  { code: 'BRL', symbol: 'R$', name: 'Real brasileño' },
  { code: 'ARS', symbol: 'AR$', name: 'Peso argentino' },
  { code: 'CLP', symbol: 'CL$', name: 'Peso chileno' },
  { code: 'COP', symbol: 'CO$', name: 'Peso colombiano' },
  { code: 'PEN', symbol: 'S/', name: 'Sol peruano' },
  { code: 'SEK', symbol: 'kr', name: 'Corona sueca' },
  { code: 'NOK', symbol: 'kr', name: 'Corona noruega' },
  { code: 'DKK', symbol: 'kr', name: 'Corona danesa' },
  { code: 'PLN', symbol: 'zł', name: 'Zloty polaco' },
  { code: 'CZK', symbol: 'Kč', name: 'Corona checa' },
  { code: 'HUF', symbol: 'Ft', name: 'Florín húngaro' },
  { code: 'TRY', symbol: '₺', name: 'Lira turca' },
  { code: 'THB', symbol: '฿', name: 'Baht tailandés' },
  { code: 'INR', symbol: '₹', name: 'Rupia india' },
  { code: 'KRW', symbol: '₩', name: 'Won surcoreano' },
  { code: 'MAD', symbol: 'MAD', name: 'Dírham marroquí' },
  { code: 'EGP', symbol: 'E£', name: 'Libra egipcia' },
  { code: 'ZAR', symbol: 'R', name: 'Rand sudafricano' },
] as const;

export const getCurrencySymbol = (code: string): string => {
  const currency = CURRENCIES.find((c) => c.code === code);
  return currency ? currency.symbol : code;
};

export const formatAmount = (amount: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toFixed(2)}`;
};

export type ExpenseFormData = Omit<Expense, 'id' | 'tripId' | 'createdAt' | 'updatedAt'>;

export const getEmptyExpenseForm = (): ExpenseFormData => ({
  concept: '',
  amount: 0,
  currency: 'EUR',
  category: 'other',
  date: new Date().toISOString().split('T')[0],
  notes: '',
  attachments: [],
});

export const createExpense = (tripId: string, data: ExpenseFormData): Expense => {
  const now = new Date().toISOString();
  return {
    id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    tripId,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
};

// Budget calculation helpers

export const getTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getExpensesByCategory = (
  expenses: Expense[]
): Record<ExpenseCategory, number> => {
  const result: Record<ExpenseCategory, number> = {
    transport: 0,
    accommodation: 0,
    food: 0,
    activities: 0,
    shopping: 0,
    health: 0,
    communication: 0,
    other: 0,
  };

  expenses.forEach((expense) => {
    result[expense.category] += expense.amount;
  });

  return result;
};

export const getBudgetPercentage = (
  totalExpenses: number,
  budget: number | undefined
): number | null => {
  if (!budget || budget <= 0) return null;
  return Math.round((totalExpenses / budget) * 100);
};

export const getBudgetStatus = (
  percentage: number | null
): 'ok' | 'warning' | 'danger' => {
  if (percentage === null) return 'ok';
  if (percentage >= 100) return 'danger';
  if (percentage >= 80) return 'warning';
  return 'ok';
};

export const BUDGET_STATUS_COLORS: Record<'ok' | 'warning' | 'danger', string> = {
  ok: '#48BB78',
  warning: '#ED8936',
  danger: '#F56565',
};

export const getDailyAverageExpense = (
  expenses: Expense[],
  tripStartDate: string
): number => {
  if (expenses.length === 0) return 0;

  const now = new Date();
  const start = new Date(tripStartDate);
  const daysElapsed = Math.max(
    1,
    Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );

  const total = getTotalExpenses(expenses);
  return total / daysElapsed;
};
