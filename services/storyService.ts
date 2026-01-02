import { supabase } from './supabaseClient'
import type { Database } from '../types/database'

type StoryContent = Database['public']['Tables']['story_content']['Row']
type StoryContentInsert = Database['public']['Tables']['story_content']['Insert']
type StoryContentUpdate = Database['public']['Tables']['story_content']['Update']

export interface StoryContentWithStatus extends StoryContent {
  status: 'draft' | 'published'
}

export const storyService = {
  // Get all story content
  async getAllStoryContent(): Promise<StoryContentWithStatus[]> {
    const { data, error } = await supabase
      .from('story_content')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching story content:', error)
      throw error
    }

    return data.map(content => ({
      ...content,
      status: content.is_active ? 'published' : 'draft'
    }))
  },

  // Get published story content only
  async getPublishedStoryContent(): Promise<StoryContent[]> {
    const { data, error } = await supabase
      .from('story_content')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching published story content:', error)
      throw error
    }

    return data
  },

  // Get story content by ID
  async getStoryContentById(id: string): Promise<StoryContentWithStatus | null> {
    const { data, error } = await supabase
      .from('story_content')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows found
      console.error('Error fetching story content:', error)
      throw error
    }

    return {
      ...data,
      status: data.is_active ? 'published' : 'draft'
    }
  },

  // Create new story content (draft by default)
  async createStoryContent(content: Omit<StoryContentInsert, 'id' | 'created_at' | 'updated_at'>): Promise<StoryContentWithStatus> {
    const { data, error } = await supabase
      .from('story_content')
      .insert([{
        ...content,
        is_active: false // Start as draft
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating story content:', error)
      throw error
    }

    return {
      ...data,
      status: 'draft'
    }
  },

  // Update story content
  async updateStoryContent(id: string, updates: StoryContentUpdate): Promise<StoryContentWithStatus> {
    const { data, error } = await supabase
      .from('story_content')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating story content:', error)
      throw error
    }

    return {
      ...data,
      status: data.is_active ? 'published' : 'draft'
    }
  },

  // Publish story content (set is_active to true)
  async publishStoryContent(id: string): Promise<StoryContentWithStatus> {
    return this.updateStoryContent(id, { is_active: true })
  },

  // Unpublish story content (set is_active to false)
  async unpublishStoryContent(id: string): Promise<StoryContentWithStatus> {
    return this.updateStoryContent(id, { is_active: false })
  },

  // Delete story content
  async deleteStoryContent(id: string): Promise<void> {
    const { error } = await supabase
      .from('story_content')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting story content:', error)
      throw error
    }
  },

  // Reorder story content
  async reorderStoryContent(contentIds: string[]): Promise<void> {
    const updates = contentIds.map((id, index) =>
      supabase
        .from('story_content')
        .update({
          order_index: index,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
    )

    const results = await Promise.all(updates)

    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      console.error('Error reordering story content:', errors)
      throw new Error('Failed to reorder some story content')
    }
  },

  // Get story content statistics
  async getStoryStats() {
    const { data, error } = await supabase
      .from('story_content')
      .select('is_active')

    if (error) {
      console.error('Error fetching story stats:', error)
      throw error
    }

    const stats = {
      total: data.length,
      published: data.filter(content => content.is_active).length,
      drafts: data.filter(content => !content.is_active).length,
    }

    return stats
  }
}