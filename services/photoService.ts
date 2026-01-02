import { supabase } from './supabaseClient'
import type { Database } from '../types/database'

type Photo = Database['public']['Tables']['photos']['Row']
type PhotoInsert = Database['public']['Tables']['photos']['Insert']
type PhotoUpdate = Database['public']['Tables']['photos']['Update']

export const photoService = {
  // Upload photo to Supabase storage and create database record
  async uploadPhoto(
    file: File,
    category: Photo['category'],
    metadata: {
      altText?: string
      caption?: string
      isFeatured?: boolean
    } = {}
  ): Promise<Photo> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `photos/${category}/${fileName}`

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Error uploading file:', uploadError)
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath)

      // Create thumbnail URL (placeholder for now)
      const thumbnailUrl = urlData.publicUrl // In production, generate actual thumbnails

      // Create database record
      const photoData: PhotoInsert = {
        filename: fileName,
        original_name: file.name,
        url: urlData.publicUrl,
        thumbnail_url: thumbnailUrl,
        category,
        alt_text: metadata.altText || file.name,
        caption: metadata.caption,
        is_featured: metadata.isFeatured || false,
        uploaded_by: 'admin' // In production, get from auth
      }

      const { data, error } = await supabase
        .from('photos')
        .insert([photoData])
        .select()
        .single()

      if (error) {
        console.error('Error creating photo record:', error)
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('photos').remove([filePath])
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in uploadPhoto:', error)
      throw error
    }
  },

  // Get all photos
  async getAllPhotos(): Promise<Photo[]> {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching photos:', error)
      throw error
    }

    return data
  },

  // Get photos by category
  async getPhotosByCategory(category: Photo['category']): Promise<Photo[]> {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('category', category)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching photos by category:', error)
      throw error
    }

    return data
  },

  // Get featured photo by category
  async getFeaturedPhoto(category: Photo['category']): Promise<Photo | null> {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('category', category)
      .eq('is_featured', true)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching featured photo:', error)
      throw error
    }

    return data || null
  },

  // Update photo
  async updatePhoto(id: string, updates: PhotoUpdate): Promise<Photo> {
    const { data, error } = await supabase
      .from('photos')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating photo:', error)
      throw error
    }

    return data
  },

  // Delete photo
  async deletePhoto(id: string): Promise<void> {
    // Get photo record first to get file path
    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('filename, category')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching photo for deletion:', fetchError)
      throw fetchError
    }

    // Delete from storage
    const filePath = `photos/${photo.category}/${photo.filename}`
    const { error: storageError } = await supabase.storage
      .from('photos')
      .remove([filePath])

    if (storageError) {
      console.error('Error deleting file from storage:', storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('photos')
      .delete()
      .eq('id', id)

    if (dbError) {
      console.error('Error deleting photo from database:', dbError)
      throw dbError
    }
  },

  // Reorder photos
  async reorderPhotos(photoIds: string[]): Promise<void> {
    const updates = photoIds.map((id, index) =>
      supabase
        .from('photos')
        .update({
          order_index: index,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
    )

    const results = await Promise.all(updates)

    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      console.error('Error reordering photos:', errors)
      throw new Error('Failed to reorder some photos')
    }
  },

  // Set featured photo (only one per category)
  async setFeaturedPhoto(photoId: string, category: Photo['category']): Promise<void> {
    // First, unset all featured photos in this category
    await supabase
      .from('photos')
      .update({ is_featured: false })
      .eq('category', category)

    // Then set the new featured photo
    const { error } = await supabase
      .from('photos')
      .update({
        is_featured: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', photoId)

    if (error) {
      console.error('Error setting featured photo:', error)
      throw error
    }
  }
}