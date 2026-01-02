
export type AccommodationType = 'Onsite' | 'Hotel' | 'Airbnb';
export type AccommodationCategory = 'Onsite' | 'Budget' | 'Airbnb_Medium' | 'Airbnb_Large';

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  category: AccommodationCategory; 
  description: string;
  distanceToVenue: string; 
  imageUrl: string;
  images?: string[]; // Multiple images for gallery
  
  // Pricing
  pricePerNight: number;
  totalPrice: number; 
  currency: string;
  
  // Features
  rating?: number;
  activities: string[];
  benefits: string[];
  maxGuests: number;
  
  // New Details
  sqft?: number;
  bedConfig?: string; // e.g. "1 King" or "2 Queens"
  bedCount?: number; // Total physical beds
  comfortCapacity?: number; // Calculated based on King=2, Queen=1
  virtualTourUrl?: string;
  
  // Link
  bookingUrl?: string;
  isRecommended?: boolean;
  
  // Config
  hiddenFromChart?: boolean; // If true, exclude from comparison charts
}

export interface ChartDataPoint {
  name: string;
  price: number;
  type: string;
}

export interface GuestPost {
  id: string;
  name: string;
  type: 'Looking for Group' | 'Have a Villa';
  message: string;
  contact: string;
  date: string;
}

export interface ScheduleEvent {
  id: string;
  day: string;
  date: string;
  time: string;
  title: string;
  location: string;
  description: string;
  icon: 'Cheers' | 'Ring' | 'Party' | 'Sun';
  attire: string;
  isPrivate?: boolean; // For future filtering
}

// Phase 5: Guest Management Types
export type RsvpStatus = 'Pending' | 'Attending' | 'Declined';

export interface Guest {
  id: string;
  familyId?: string; // Links guests together
  firstName: string;
  lastName: string;
  email?: string;
  rsvpStatus: RsvpStatus;
  accommodation?: 'andaz' | 'ac_hotel' | 'self' | '';
  roomDetail?: string; // e.g., 'standard_king'
  bookingMethod?: string; // e.g., 'group_rate'
  mealChoice?: string; // e.g., 'Standard', 'Veg', 'Kids'
  note?: string;
  lastUpdated?: string;
}
