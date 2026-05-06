import { supabase } from './supabaseClient';
import type { Todo, TodoCategory, TodoOwner } from '../types';

type TodoRow = {
  id: string;
  title: string;
  notes: string | null;
  category: TodoCategory;
  due_date: string | null;
  owner: TodoOwner;
  progress: number;
  in_progress: boolean;
  done: boolean;
  done_by: string | null;
  done_at: string | null;
  order_index: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

const rowToTodo = (row: TodoRow): Todo => ({
  id: row.id,
  title: row.title,
  notes: row.notes ?? undefined,
  category: row.category,
  dueDate: row.due_date ?? undefined,
  owner: row.owner,
  progress: row.progress ?? 0,
  inProgress: row.in_progress,
  done: row.done,
  doneBy: row.done_by ?? undefined,
  doneAt: row.done_at ?? undefined,
  orderIndex: row.order_index,
  createdBy: row.created_by ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const snap = (n: number): number => {
  const clamped = Math.max(0, Math.min(100, n));
  return Math.round(clamped / 25) * 25;
};

export const todoService = {
  async getAll(): Promise<Todo[]> {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
    return (data ?? []).map(rowToTodo);
  },

  async create(input: {
    title: string;
    category: TodoCategory;
    owner?: TodoOwner;
    dueDate?: string;
    notes?: string;
    createdBy: string;
  }): Promise<Todo> {
    const { data, error } = await supabase
      .from('todos')
      .insert({
        title: input.title,
        category: input.category,
        owner: input.owner ?? 'Unassigned',
        due_date: input.dueDate ?? null,
        notes: input.notes ?? null,
        created_by: input.createdBy,
        order_index: Date.now() % 1_000_000,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
    return rowToTodo(data as TodoRow);
  },

  async update(id: string, patch: Partial<Todo>): Promise<void> {
    const updates: Record<string, any> = {};
    if (patch.title !== undefined)       updates.title = patch.title;
    if (patch.notes !== undefined)       updates.notes = patch.notes || null;
    if (patch.category !== undefined)    updates.category = patch.category;
    if (patch.dueDate !== undefined)     updates.due_date = patch.dueDate || null;
    if (patch.owner !== undefined)       updates.owner = patch.owner;
    if (patch.progress !== undefined)    updates.progress = snap(patch.progress);
    if (patch.inProgress !== undefined)  updates.in_progress = patch.inProgress;
    if (patch.done !== undefined)        updates.done = patch.done;
    if (patch.doneBy !== undefined)      updates.done_by = patch.doneBy || null;
    if (patch.doneAt !== undefined)      updates.done_at = patch.doneAt || null;
    if (patch.orderIndex !== undefined)  updates.order_index = patch.orderIndex;

    const { error } = await supabase.from('todos').update(updates).eq('id', id);
    if (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  /**
   * Set progress (snapped to 0/25/50/75/100) and sync the legacy
   * `done` / `in_progress` / `done_by` / `done_at` columns so any other
   * code reading those still sees consistent state.
   */
  async setProgress(id: string, rawProgress: number, identity: string): Promise<void> {
    const progress = snap(rawProgress);
    const isDone = progress === 100;
    const isStarted = progress > 0 && progress < 100;
    await this.update(id, {
      progress,
      done: isDone,
      inProgress: isStarted,
      doneBy: isDone ? identity : '',
      doneAt: isDone ? new Date().toISOString() : '',
    });
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  subscribe(onChange: () => void) {
    const subscription = supabase
      .channel('todos_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        () => onChange()
      )
      .subscribe();
    return () => subscription.unsubscribe();
  },
};
