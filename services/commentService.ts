import { supabase } from './supabaseClient';
import type { Comment } from '../types';

type CommentRow = {
  id: string;
  todo_id: string;
  author: string;
  body: string;
  mentions: string[];
  created_at: string;
  updated_at: string;
};

const rowToComment = (row: CommentRow): Comment => ({
  id: row.id,
  todoId: row.todo_id,
  author: row.author,
  body: row.body,
  mentions: Array.isArray(row.mentions) ? row.mentions : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const MENTION_PATTERN = /@(Francis|Yuwen|Manna)\b/g;

/** Extract @mention display names from a body string. */
export const parseMentions = (body: string): string[] => {
  const matches = body.matchAll(MENTION_PATTERN);
  const seen = new Set<string>();
  for (const m of matches) seen.add(m[1]);
  return [...seen];
};

export const commentService = {
  async getAll(): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('todo_comments')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
    return (data ?? []).map(rowToComment);
  },

  async listForTodo(todoId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('todo_comments')
      .select('*')
      .eq('todo_id', todoId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments for todo:', error);
      throw error;
    }
    return (data ?? []).map(rowToComment);
  },

  async create(input: { todoId: string; author: string; body: string }): Promise<Comment> {
    const mentions = parseMentions(input.body);
    const { data, error } = await supabase
      .from('todo_comments')
      .insert({
        todo_id: input.todoId,
        author: input.author,
        body: input.body,
        mentions,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
    return rowToComment(data as CommentRow);
  },

  async update(id: string, body: string): Promise<void> {
    const mentions = parseMentions(body);
    const { error } = await supabase
      .from('todo_comments')
      .update({ body, mentions })
      .eq('id', id);
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('todo_comments').delete().eq('id', id);
    if (error) throw error;
  },

  subscribe(onChange: () => void) {
    const subscription = supabase
      .channel('todo_comments_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todo_comments' },
        () => onChange()
      )
      .subscribe();
    return () => subscription.unsubscribe();
  },
};
