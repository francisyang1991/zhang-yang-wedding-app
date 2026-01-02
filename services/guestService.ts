import { supabase } from './supabaseClient'
import type { Guest } from '../types'

export interface GuestUpdate {
  id: string
  data: Partial<Guest>
}

// Convert Supabase guest format to our Guest type
const convertSupabaseGuestToGuest = (supabaseGuest: any): Guest => ({
  id: supabaseGuest.id,
  familyId: supabaseGuest.family_id,
  firstName: supabaseGuest.first_name,
  lastName: supabaseGuest.last_name,
  email: supabaseGuest.email,
  rsvpStatus: supabaseGuest.rsvp_status,
  accommodation: supabaseGuest.accommodation,
  roomDetail: supabaseGuest.room_detail,
  bookingMethod: supabaseGuest.booking_method,
  mealChoice: supabaseGuest.meal_choice,
  note: supabaseGuest.note,
  lastUpdated: supabaseGuest.last_updated,
})

// Convert our Guest type to Supabase format
const convertGuestToSupabase = (guest: Partial<Guest>) => ({
  family_id: guest.familyId,
  first_name: guest.firstName,
  last_name: guest.lastName,
  email: guest.email,
  rsvp_status: guest.rsvpStatus,
  accommodation: guest.accommodation,
  room_detail: guest.roomDetail,
  booking_method: guest.bookingMethod,
  meal_choice: guest.mealChoice,
  note: guest.note,
  last_updated: guest.lastUpdated || new Date().toISOString(),
})

export const guestService = {
  // Get all guests
  async getAllGuests(): Promise<Guest[]> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching guests:', error)
      throw error
    }

    return data.map(convertSupabaseGuestToGuest)
  },

  // Get guest by ID
  async getGuestById(id: string): Promise<Guest | null> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching guest:', error)
      return null
    }

    return convertSupabaseGuestToGuest(data)
  },

  // Create new guest
  async createGuest(guestData: Omit<Guest, 'id' | 'lastUpdated'>): Promise<Guest> {
    const { data, error } = await supabase
      .from('guests')
      .insert([convertGuestToSupabase(guestData)])
      .select()
      .single()

    if (error) {
      console.error('Error creating guest:', error)
      throw error
    }

    return convertSupabaseGuestToGuest(data)
  },

  // Update guest
  async updateGuest(id: string, updates: Partial<Guest>): Promise<Guest> {
    const { data, error } = await supabase
      .from('guests')
      .update({
        ...convertGuestToSupabase(updates),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating guest:', error)
      throw error
    }

    return convertSupabaseGuestToGuest(data)
  },

  // Delete guest
  async deleteGuest(id: string): Promise<void> {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting guest:', error)
      throw error
    }
  },

  // Batch update guests (for RSVP modal)
  async batchUpdateGuests(updates: GuestUpdate[]): Promise<Guest[]> {
    const results: Guest[] = []

    for (const update of updates) {
      try {
        const guest = await this.updateGuest(update.id, update.data)
        results.push(guest)
      } catch (error) {
        console.error(`Error updating guest ${update.id}:`, error)
        // Continue with other updates even if one fails
      }
    }

    return results
  },

  // Get guests by RSVP status
  async getGuestsByStatus(status: Guest['rsvpStatus']): Promise<Guest[]> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('rsvp_status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching guests by status:', error)
      throw error
    }

    return data.map(convertSupabaseGuestToGuest)
  },

  // Get guest statistics
  async getGuestStats() {
    const { data, error } = await supabase
      .from('guests')
      .select('rsvp_status')

    if (error) {
      console.error('Error fetching guest stats:', error)
      throw error
    }

    const stats = {
      total: data.length,
      attending: data.filter(g => g.rsvp_status === 'Attending').length,
      declined: data.filter(g => g.rsvp_status === 'Declined').length,
      pending: data.filter(g => g.rsvp_status === 'Pending').length,
    }

    return stats
  }
}