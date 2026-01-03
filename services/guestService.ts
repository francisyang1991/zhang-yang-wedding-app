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
  },

  // Get RSVP trends over time
  async getRsvpTrends(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('guests')
      .select('rsvp_status, updated_at')
      .gte('updated_at', startDate.toISOString())
      .order('updated_at', { ascending: true })

    if (error) {
      console.error('Error fetching RSVP trends:', error)
      throw error
    }

    // Group by date and status
    const trends: Record<string, { date: string; attending: number; declined: number; pending: number }> = {}

    data.forEach(guest => {
      const date = new Date(guest.updated_at).toISOString().split('T')[0] // YYYY-MM-DD format
      if (!trends[date]) {
        trends[date] = { date, attending: 0, declined: 0, pending: 0 }
      }

      if (guest.rsvp_status === 'Attending') trends[date].attending++
      else if (guest.rsvp_status === 'Declined') trends[date].declined++
      else if (guest.rsvp_status === 'Pending') trends[date].pending++
    })

    return Object.values(trends).sort((a, b) => a.date.localeCompare(b.date))
  },

  // Get accommodation preferences analytics
  async getAccommodationAnalytics() {
    const { data, error } = await supabase
      .from('guests')
      .select('accommodation, rsvp_status')
      .eq('rsvp_status', 'Attending')

    if (error) {
      console.error('Error fetching accommodation analytics:', error)
      throw error
    }

    const analytics = {
      andaz: data.filter(g => g.accommodation === 'andaz').length,
      ac_hotel: data.filter(g => g.accommodation === 'ac_hotel').length,
      self: data.filter(g => g.accommodation === 'self').length,
      unknown: data.filter(g => !g.accommodation).length,
    }

    return analytics
  },

  // Get response rate analytics
  async getResponseRateAnalytics() {
    const { data, error } = await supabase
      .from('guests')
      .select('rsvp_status, created_at, updated_at')

    if (error) {
      console.error('Error fetching response rate analytics:', error)
      throw error
    }

    const totalInvitations = data.length
    const responses = data.filter(g => g.rsvp_status !== 'Pending').length
    const attending = data.filter(g => g.rsvp_status === 'Attending').length

    // Calculate average response time
    const responseTimes = data
      .filter(g => g.rsvp_status !== 'Pending' && g.updated_at)
      .map(g => new Date(g.updated_at).getTime() - new Date(g.created_at).getTime())
      .filter(time => time > 0)

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0

    return {
      totalInvitations,
      responses,
      attending,
      responseRate: totalInvitations > 0 ? (responses / totalInvitations) * 100 : 0,
      attendanceRate: totalInvitations > 0 ? (attending / totalInvitations) * 100 : 0,
      avgResponseTimeMs: avgResponseTime,
      avgResponseTimeDays: Math.round(avgResponseTime / (1000 * 60 * 60 * 24)),
    }
  }
}