import { supabase } from './supabaseClient';
import type { Database } from '../types/database';
import { ScheduleEvent } from '../types';

// We need to define the Row type manually or extend Database if we regenerated types
// For now, we'll map manually to ScheduleEvent
type ScheduleEventRow = {
  id: string;
  day: string;
  date: string;
  time: string;
  title: string;
  location: string;
  description: string;
  icon: 'Cheers' | 'Ring' | 'Party' | 'Sun' | string;
  attire: string;
  order_index: number;
};

export const scheduleService = {
  // Get all schedule events
  async getSchedule(): Promise<ScheduleEvent[]> {
    const { data, error } = await supabase
      .from('schedule_events')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }

    // Map to ScheduleEvent interface
    return data.map((row: any) => ({
      id: row.id,
      day: row.day,
      date: row.date,
      time: row.time,
      title: row.title,
      location: row.location,
      description: row.description,
      icon: row.icon as any,
      attire: row.attire
    }));
  },

  // Update a schedule event
  async updateEvent(id: string, updates: Partial<ScheduleEvent>): Promise<void> {
    const { error } = await supabase
      .from('schedule_events')
      .update({
        day: updates.day,
        date: updates.date,
        time: updates.time,
        title: updates.title,
        location: updates.location,
        description: updates.description,
        icon: updates.icon,
        attire: updates.attire,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }
};
