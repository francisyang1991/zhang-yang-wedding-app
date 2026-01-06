
import { Accommodation, GuestPost, ScheduleEvent, Guest } from './types';

export const ANDAZ_ACTIVITIES = [
  'GoPro HERO 8 Camera Rental',
  'GoPro Experience Lab',
  'Guided Kayak Tours',
  'Daily Outrigger Canoe Excursions',
  'Stand Up Paddle Board Lessons',
  'Snorkel Equipment and Body Board Rentals',
  'Yoga and other Fitness Classes',
  'Single & Tandem Bikes/Helmets',
  'Ukulele Lessons',
  'Hula Lessons',
  'Coconut Husking',
  'Lei Making Lessons',
  'Walk Story Property Tour',
  '45-Minute Beach Portrait Session (Includes a $50 Photo Credit)'
];

export const ONSITE_OPTIONS: Accommodation[] = [
  {
    id: 'andaz-standard',
    name: 'Andaz Maui - Standard Room',
    type: 'Onsite',
    category: 'Onsite',
    description: 'Resort View. Official room block for June 11-13.',
    distanceToVenue: '0 min (Onsite)',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000',
      'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1000',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000',
    ],
    pricePerNight: 720, // 770 - 50
    totalPrice: 1440, // 2 nights
    currency: 'USD',
    rating: 4.8,
    maxGuests: 4,
    bedCount: 2,
    comfortCapacity: 2,
    sqft: 400,
    bedConfig: '1 King / 2 Queen',
    activities: ANDAZ_ACTIVITIES,
    benefits: [
      '✨ Minimal Stay 2 nights',
      '✨ GIFT: We cover 1 Night',
      'Complimentary Minibar (Non-alc)'
    ],
    isRecommended: true
  },
  {
    id: 'andaz-partial-ocean',
    name: 'Andaz Maui - Partial Ocean View',
    type: 'Onsite',
    category: 'Onsite',
    description: 'Beautiful partial views of the Pacific.',
    distanceToVenue: '0 min (Onsite)',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop',
    pricePerNight: 770, // 820 - 50
    totalPrice: 1540, // 2 nights
    currency: 'USD',
    rating: 4.8,
    maxGuests: 4,
    bedCount: 2,
    comfortCapacity: 2,
    sqft: 400,
    bedConfig: '1 King / 2 Queen',
    activities: ANDAZ_ACTIVITIES,
    benefits: [
      '✨ Minimal Stay 2 nights',
      '✨ GIFT: We cover 1 Night'
    ],
    isRecommended: false
  },
  {
    id: 'andaz-ocean-view',
    name: 'Andaz Maui - Full Ocean View',
    type: 'Onsite',
    category: 'Onsite',
    description: 'Guaranteed Full Ocean View on upper floors.',
    distanceToVenue: '0 min (Onsite)',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000',
    ],
    pricePerNight: 820, 
    totalPrice: 1640, // 2 nights
    currency: 'USD',
    rating: 4.9,
    maxGuests: 4,
    bedCount: 2,
    comfortCapacity: 2,
    sqft: 400,
    bedConfig: '1 King / 2 Queen',
    activities: ['All Resort Activities Included'],
    benefits: [
      '✨ Minimal Stay 2 nights',
      '✨ GIFT: We cover 1 Night'
    ],
    isRecommended: false
  },
  {
    id: 'andaz-villa-garden',
    name: 'Andaz "Ilikai" 3-Bedroom Villa Garden View',
    type: 'Onsite',
    category: 'Onsite',
    description: 'RSVP first; we will coordinate villa sharing later. Required stay June 11-14.',
    distanceToVenue: '0 min (Onsite)',
    imageUrl: 'https://images.unsplash.com/photo-1572007633395-9b71a393d142?q=80&w=1000&auto=format&fit=crop', // Lush garden villa look
    pricePerNight: 1900, 
    totalPrice: 5700, // 3 nights (June 11-14)
    currency: 'USD',
    rating: 4.9,
    maxGuests: 8,
    bedCount: 4,
    comfortCapacity: 6,
    sqft: 1900,
    bedConfig: '1 King + 2 Queens + 1 Queen',
    activities: ['Plunge Pool Access', 'Gourmet Kitchen', ...ANDAZ_ACTIVITIES],
    benefits: [
      '✨ Required Stay: June 11-14',
      '💎 Luxury Resident Style'
    ],
    isRecommended: false,
    hiddenFromChart: true
  },
  {
    id: 'andaz-villa-ocean',
    name: 'Andaz "Ilikai" 3-Bedroom Villa Ocean View',
    type: 'Onsite',
    category: 'Onsite',
    description: 'RSVP first; we will coordinate villa sharing later. Only 2 available with great value!',
    distanceToVenue: '0 min (Onsite)',
    imageUrl: 'https://images.unsplash.com/photo-1512918760532-493e9be6fb33?q=80&w=1000&auto=format&fit=crop',
    pricePerNight: 2213, // 2263 - 50
    totalPrice: 6639, // 3 nights (June 11-14)
    currency: 'USD',
    rating: 4.9,
    maxGuests: 8,
    bedCount: 4,
    comfortCapacity: 6,
    sqft: 1900,
    bedConfig: '1 King + 2 Queens + 1 Queen',
    activities: ['Plunge Pool Access', 'Gourmet Kitchen', ...ANDAZ_ACTIVITIES],
    benefits: [
      '✨ Required Stay: June 11-14',
      '💎 Luxury Resident Style'
    ],
    isRecommended: false,
    hiddenFromChart: true
  }
];

export const MANUAL_HOTEL_OPTIONS: Accommodation[] = [
  {
    id: 'ac-hotel-wailea-king',
    name: 'AC Hotel Wailea - 1 King Bed',
    type: 'Hotel',
    category: 'Budget',
    description: 'Newest Stylish Hotel in Wailea! Modern design and walking distance to shops.',
    distanceToVenue: '5 min drive',
    imageUrl: 'https://placehold.co/800x600/e2e8f0/94a3b8?text=AC+Hotel+Room',
    pricePerNight: 480,
    totalPrice: 960,
    currency: 'USD',
    maxGuests: 2,
    bedCount: 1,
    comfortCapacity: 2,
    sqft: 310,
    bedConfig: '1 King',
    activities: ['Infinity Pool', 'Walking Distance to Shops'],
    benefits: [
      'Newest Hotel in Wailea',
      'Marriott Bonvoy Points'
    ],
    isRecommended: true,
    bookingUrl: 'https://mi.bookmarriott.com/proposals/view/cd4b51c5-60ce-47b4-ab85-e5c4e331127b'
  },
  {
    id: 'ac-hotel-wailea-queen',
    name: 'AC Hotel Wailea - 2 Queen Beds',
    type: 'Hotel',
    category: 'Budget',
    description: 'Newest Stylish Hotel in Wailea! Modern design. Perfect for friends sharing.',
    distanceToVenue: '5 min drive',
    imageUrl: 'https://placehold.co/800x600/e2e8f0/94a3b8?text=AC+Hotel+Room',
    pricePerNight: 480,
    totalPrice: 960,
    currency: 'USD',
    maxGuests: 4,
    bedCount: 2,
    comfortCapacity: 2,
    sqft: 350,
    bedConfig: '2 Queens',
    activities: ['Infinity Pool', 'Walking Distance to Shops'],
    benefits: [
      'Newest Hotel in Wailea',
      'Marriott Bonvoy Points'
    ],
    isRecommended: true,
    bookingUrl: 'https://mi.bookmarriott.com/proposals/view/cd4b51c5-60ce-47b4-ab85-e5c4e331127b'
  }
];

export const WEDDING_SCHEDULE: ScheduleEvent[] = [
  {
    id: 'evt-1',
    day: 'Thursday',
    date: 'June 11, 2026',
    time: '5:00 PM',
    title: 'Welcome Sunset Drinks',
    location: 'Bumbye Beach Bar (Andaz)',
    description: 'Kick off the weekend with tropical cocktails and appetizers by the infinity pool. Casual island attire.',
    icon: 'Cheers',
    attire: 'Casual Island'
  },
  {
    id: 'evt-2',
    day: 'Friday',
    date: 'June 12, 2026',
    time: '4:00 PM',
    title: 'Wedding Ceremony',
    location: 'Laule’a 3 (Lawn 3)',
    description: 'Guests arrive by 3:30 PM. The ceremony will be on the grass (Laule’a 3), so rethink stilettos!',
    icon: 'Ring',
    attire: 'Semi-Formal / Cocktail'
  },
  {
    id: 'evt-2b',
    day: 'Friday',
    date: 'June 12, 2026',
    time: '4:45 PM - 6:15 PM',
    title: 'Cocktail Hour',
    location: 'Laule’a 3',
    description: 'Enjoy sunset drinks and hors d\'oeuvres following the ceremony.',
    icon: 'Cheers',
    attire: 'Semi-Formal / Cocktail'
  },
  {
    id: 'evt-3',
    day: 'Friday',
    date: 'June 12, 2026',
    time: '6:30 PM - 10:00 PM',
    title: 'Reception Dinner & Dancing',
    location: 'Laule’a 1, Oceanfront Lawn',
    description: 'Dinner, dancing, and celebration under the stars at Laule’a 1.',
    icon: 'Party',
    attire: 'Semi-Formal / Cocktail'
  },
  {
    id: 'evt-4',
    day: 'Saturday',
    date: 'June 13, 2026',
    time: '11:00 AM',
    title: 'Recovery Brunch',
    location: 'Ka’ana Kitchen',
    description: 'Come grab some coffee and local bites before heading to the beach.',
    icon: 'Sun',
    attire: 'Casual'
  }
];

export const MOCK_GUEST_POSTS: GuestPost[] = [
  {
    id: 'post-1',
    name: 'Sarah & Mike',
    type: 'Have a Villa',
    message: 'We booked a 3-Bedroom Villa! Looking for another couple to take the second room to split costs.',
    contact: 'sarah.m@email.com',
    date: '2 hours ago'
  }
];

export const MOCK_GUEST_LIST: Guest[] = [
  { id: 'g1', familyId: 'f1', firstName: 'Tony', lastName: 'Stark', rsvpStatus: 'Pending', email: 'tony@stark.com' },
];