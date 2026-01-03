import { supabase } from './supabaseClient'
import type { Guest } from '../types'
import type { Database } from '../types/database'

type GuestRow = Database['public']['Tables']['guests']['Row']
type GuestInsert = Database['public']['Tables']['guests']['Insert']
type GuestUpdate = Database['public']['Tables']['guests']['Update']

export interface GuestUpdateData {
  id: string
  data: Partial<Guest>
}

// Convert Supabase guest format to our Guest type
const convertSupabaseGuestToGuest = (supabaseGuest: GuestRow): Guest => ({
  id: supabaseGuest.id,
  familyId: supabaseGuest.family_id || undefined,
  firstName: supabaseGuest.first_name,
  lastName: supabaseGuest.last_name,
  email: supabaseGuest.email || undefined,
  rsvpStatus: supabaseGuest.rsvp_status as Guest['rsvpStatus'],
  accommodation: (supabaseGuest.accommodation as Guest['accommodation']) || undefined,
  roomDetail: supabaseGuest.room_detail || undefined,
  bookingMethod: supabaseGuest.booking_method || undefined,
  mealChoice: supabaseGuest.meal_choice || undefined,
  note: supabaseGuest.note || undefined,
  plusOne: supabaseGuest.plus_one || false,
  plusOneName: supabaseGuest.plus_one_name || undefined,
  lastUpdated: supabaseGuest.last_updated || undefined,
})

// Convert our Guest type to Supabase format
const convertGuestToSupabase = (guest: Partial<Guest>): GuestUpdate => {
  return {
    family_id: guest.familyId,
    first_name: guest.firstName,
    last_name: guest.lastName,
    email: guest.email,
    rsvp_status: guest.rsvpStatus,
    accommodation: guest.accommodation === '' ? null : guest.accommodation,
    room_detail: guest.roomDetail,
    booking_method: guest.bookingMethod,
    meal_choice: guest.mealChoice,
    note: guest.note,
    plus_one: guest.plusOne,
    plus_one_name: guest.plusOneName,
    last_updated: guest.lastUpdated || new Date().toISOString(),
  }
}

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

    if (!data) return []

    // Cast data to avoid 'never' inference issues
    const guests = data as unknown as GuestRow[]
    return guests.map(convertSupabaseGuestToGuest)
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

    const guest = data as unknown as GuestRow
    return convertSupabaseGuestToGuest(guest)
  },

  // Create new guest
  async createGuest(guestData: Omit<Guest, 'id' | 'lastUpdated'>): Promise<Guest> {
    const insertData: GuestInsert = {
      family_id: guestData.familyId,
      first_name: guestData.firstName,
      last_name: guestData.lastName,
      email: guestData.email,
      rsvp_status: guestData.rsvpStatus,
      accommodation: guestData.accommodation === '' ? null : guestData.accommodation,
      room_detail: guestData.roomDetail,
      booking_method: guestData.bookingMethod,
      meal_choice: guestData.mealChoice,
      note: guestData.note,
      plus_one: guestData.plusOne,
      plus_one_name: guestData.plusOneName,
      last_updated: new Date().toISOString()
    }

    const { data, error } = await (supabase
      .from('guests') as any)
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Error creating guest:', error)
      throw error
    }

    const guest = data as unknown as GuestRow
    return convertSupabaseGuestToGuest(guest)
  },

  // Update guest
  async updateGuest(id: string, updates: Partial<Guest>): Promise<Guest> {
    const updateData: GuestUpdate = {
      ...convertGuestToSupabase(updates),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await (supabase
      .from('guests') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating guest:', error)
      throw error
    }

    const guest = data as unknown as GuestRow
    return convertSupabaseGuestToGuest(guest)
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
  async batchUpdateGuests(updates: GuestUpdateData[]): Promise<Guest[]> {
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

    if (!data) return []

    const guests = data as unknown as GuestRow[]
    return guests.map(convertSupabaseGuestToGuest)
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

    // Cast data to known shape
    const guests = data as unknown as Pick<GuestRow, 'rsvp_status'>[]

    const stats = {
      total: guests.length,
      attending: guests.filter(g => g.rsvp_status === 'Attending').length,
      declined: guests.filter(g => g.rsvp_status === 'Declined').length,
      pending: guests.filter(g => g.rsvp_status === 'Pending').length,
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

    const guests = data as unknown as Pick<GuestRow, 'rsvp_status' | 'updated_at'>[]

    // Group by date and status
    const trends: Record<string, { date: string; attending: number; declined: number; pending: number }> = {}

    guests.forEach(guest => {
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

    const guests = data as unknown as Pick<GuestRow, 'accommodation' | 'rsvp_status'>[]

    const analytics = {
      andaz: guests.filter(g => g.accommodation === 'andaz').length,
      ac_hotel: guests.filter(g => g.accommodation === 'ac_hotel').length,
      self: guests.filter(g => g.accommodation === 'self').length,
      unknown: guests.filter(g => !g.accommodation).length,
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

    const guests = data as unknown as Pick<GuestRow, 'rsvp_status' | 'created_at' | 'updated_at'>[]

    const totalInvitations = guests.length
    const responses = guests.filter(g => g.rsvp_status !== 'Pending').length
    const attending = guests.filter(g => g.rsvp_status === 'Attending').length

    // Calculate average response time
    const responseTimes = guests
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
