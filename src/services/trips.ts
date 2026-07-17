import { supabase } from '@/services/supabase';
import type { Trip, TripInput } from '@/types/trip';

interface TripRow {
  id: string;
  user_id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget_total: number | null;
  created_at: string;
  updated_at: string;
}

function fromRow(row: TripRow): Trip {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    budgetTotal: row.budget_total,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listTrips(): Promise<Trip[]> {
  const { data, error } = await supabase.from('trips').select('*').order('start_date', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as TripRow[]).map(fromRow);
}

export async function createTrip(userId: string, input: TripInput): Promise<Trip> {
  const { data, error } = await supabase
    .from('trips')
    .insert({
      user_id: userId,
      name: input.name,
      destination: input.destination,
      start_date: input.startDate,
      end_date: input.endDate,
      budget_total: input.budgetTotal,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as TripRow);
}

export async function updateTrip(id: string, input: TripInput): Promise<Trip> {
  const { data, error } = await supabase
    .from('trips')
    .update({
      name: input.name,
      destination: input.destination,
      start_date: input.startDate,
      end_date: input.endDate,
      budget_total: input.budgetTotal,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as TripRow);
}

export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase.from('trips').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function getTrip(id: string): Promise<Trip | null> {
  const { data, error } = await supabase.from('trips').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as TripRow) : null;
}
