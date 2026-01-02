
import React, { useState, useEffect } from 'react';
import { ONSITE_OPTIONS, MANUAL_HOTEL_OPTIONS, WEDDING_SCHEDULE, MOCK_GUEST_LIST, ANDAZ_ACTIVITIES } from './constants';
import AccommodationCard from './components/AccommodationCard';
import BookingStrategy from './components/BookingStrategy';
import GuestShareBoard from './components/GuestShareBoard';
import Timeline from './components/Timeline';
import OurStory from './components/OurStory';
import TravelInfo from './components/TravelInfo';
import RSVPModal from './components/RSVPModal';
import AdminDashboard from './components/AdminDashboard';
import MenuPreview from './components/MenuPreview';
import ScheduleModal from './components/ScheduleModal';
import { Accommodation, Guest } from './types';
import { photoService } from './services/photoService';
import { guestService } from './services/guestService';
import { supabase } from './services/supabaseClient';
import { Calendar, MapPin, Heart, Gift, Check, Plane, ChevronDown, ChevronUp, Lock, Sparkles } from 'lucide-react';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop", // Resort Pool
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2000&auto=format&fit=crop", // Palms
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2000&auto=format&fit=crop", // Villa/Modern
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2000&auto=format&fit=crop"  // Wedding Vibe
];

// Default fallback photo URL
const DEFAULT_COUPLE_PHOTO = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=400&auto=format&fit=crop&crop=face";

const App: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([
    ...ONSITE_OPTIONS,
    ...MANUAL_HOTEL_OPTIONS
  ]);
  
  // Persistence Layer: Load from Supabase
  const [guestList, setGuestList] = useState<Guest[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  
  // Section Folding States
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);

  // Pricing Mode State (Kept for cards, removed for chart)
  const [pricingMode, setPricingMode] = useState<'max' | 'comfort'>('max');
  const [viewMode, setViewMode] = useState<'total' | 'perPerson'>('total');
  
  // Hero Slideshow State
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [couplePhotoUrl, setCouplePhotoUrl] = useState<string>(DEFAULT_COUPLE_PHOTO);

  const onsite = accommodations.filter(a => a.category === 'Onsite');
  const budget = accommodations.filter(a => a.category === 'Budget');

  // Load guests from Supabase on mount
  useEffect(() => {
    const loadGuests = async () => {
      try {
        const guests = await guestService.getAllGuests();
        setGuestList(guests);
      } catch (error) {
        console.error('Error loading guests:', error);
        // Fallback to mock data if Supabase fails
        setGuestList(MOCK_GUEST_LIST);
      } finally {
        setIsLoadingGuests(false);
      }
    };

    loadGuests();

    // Set up real-time subscription for guest changes
    const subscription = supabase
      .channel('app_guests_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'guests'
      }, async (payload) => {
        console.log('Real-time guest update in App:', payload);
        try {
          // Reload guests when any change occurs
          const updatedGuests = await guestService.getAllGuests();
          setGuestList(updatedGuests);
        } catch (error) {
          console.error('Error reloading guests:', error);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Hero Slideshow Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch couple photo from database
  useEffect(() => {
    const fetchCouplePhoto = async () => {
      try {
        const featuredPhoto = await photoService.getFeaturedPhoto('couple');
        if (featuredPhoto) {
          setCouplePhotoUrl(featuredPhoto.url);
        }
      } catch (error) {
        console.error('Error fetching couple photo:', error);
        // Keep the placeholder image if fetch fails
      }
    };

    fetchCouplePhoto();
  }, []);

  const handleRsvpSave = async (updates: { id: string; data: Partial<Guest> }[]) => {
    try {
      // Save to Supabase
      await guestService.batchUpdateGuests(updates);

      // Update local state by reloading from Supabase
      const updatedGuests = await guestService.getAllGuests();
      setGuestList(updatedGuests);
    } catch (error) {
      console.error('Error saving RSVP:', error);
      // Fallback: Update local state optimistically
      setGuestList(prev => {
        const newList = [...prev];
        updates.forEach(update => {
          const index = newList.findIndex(g => g.id === update.id);
          if (index >= 0) {
            newList[index] = {
              ...newList[index],
              ...update.data,
              lastUpdated: new Date().toISOString()
            };
          } else {
            const newGuest = {
              id: update.id,
              familyId: update.data.familyId || `fam-${Date.now()}`,
              firstName: update.data.firstName || 'Guest',
              lastName: update.data.lastName || '',
              email: update.data.email,
              rsvpStatus: update.data.rsvpStatus || 'Pending',
              accommodation: update.data.accommodation,
              roomDetail: update.data.roomDetail,
              bookingMethod: update.data.bookingMethod,
              mealChoice: update.data.mealChoice,
              note: update.data.note,
              lastUpdated: new Date().toISOString()
            } as Guest;
            newList.push(newGuest);
          }
        });
        return newList;
      });
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen font-sans text-wedding-text relative">
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
             <a 
               href="#welcome" 
               onClick={(e) => scrollToSection(e, 'welcome')}
               className="font-serif text-2xl font-bold tracking-tight text-wedding-text hover:text-wedding-gold transition-colors cursor-pointer"
             >
               X<span className="text-wedding-gold">&</span>Y
             </a>
             <div className="hidden md:flex space-x-6 lg:space-x-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <a href="#welcome" onClick={(e) => scrollToSection(e, 'welcome')} className="hover:text-wedding-gold transition-colors cursor-pointer">Home</a>
                <button onClick={() => setIsScheduleOpen(true)} className="hover:text-wedding-gold transition-colors cursor-pointer uppercase">Schedule</button>
                <a href="#accommodations" onClick={(e) => scrollToSection(e, 'accommodations')} className="hover:text-wedding-gold transition-colors cursor-pointer">Stay</a>
                <a href="#menu" onClick={(e) => scrollToSection(e, 'menu')} className="hover:text-wedding-gold transition-colors cursor-pointer">Menu</a>
                <a href="#travel" onClick={(e) => scrollToSection(e, 'travel')} className="hover:text-wedding-gold transition-colors cursor-pointer">Travel</a>
                <a href="#story" onClick={(e) => scrollToSection(e, 'story')} className="hover:text-wedding-gold transition-colors cursor-pointer">Story</a>
             </div>
             <button 
               onClick={() => setIsRsvpOpen(true)}
               className="bg-wedding-gold text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#b08d4a] transition-colors shadow-lg shadow-wedding-gold/30">
                RSVP Now
             </button>
          </div>
        </div>
      </nav>

      <header id="welcome" className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0 bg-gray-900">
           {HERO_IMAGES.map((img, index) => (
             <div 
               key={index}
               className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}
             >
               <img 
                 src={img} 
                 alt={`Wedding Venue ${index + 1}`} 
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-black/40"></div>
             </div>
           ))}
        </div>

        {/* Couple Profile Photo */}
        <div className="absolute left-4 md:left-8 lg:left-16 top-1/2 transform -translate-y-1/2 z-5 hidden sm:block">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm bg-white/10">
              <img
                src={couplePhotoUrl}
                alt="Xiaodong & Yuwen"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full bg-wedding-gold flex items-center justify-center text-white font-serif text-2xl md:text-3xl lg:text-4xl font-bold">
                        X&Y
                      </div>
                    `;
                  }
                }}
              />
            </div>
            {/* Decorative ring */}
            <div className="absolute -inset-2 border-2 border-wedding-gold/30 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="relative z-10 text-white max-w-4xl mx-auto animate-fade-in md:ml-16 lg:ml-24">
           <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-6 text-wedding-sand drop-shadow-md">Please join us for</p>
           <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl mb-8 leading-none drop-shadow-xl">Xiaodong <span className="text-wedding-gold">&</span> Yuwen</h1>
           <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 text-sm md:text-lg font-light tracking-wide bg-black/20 backdrop-blur-md p-4 rounded-full inline-flex border border-white/20">
              <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-wedding-gold" />
                 <span>June 12, 2026</span>
              </div>
              <div className="hidden md:block w-px h-5 bg-white/40"></div>
              <div className="flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-wedding-gold" />
                 <span>Wailea, Maui</span>
              </div>
           </div>
        </div>
      </header>

      {/* STAY (Accommodations) */}
      <section id="accommodations" className="py-20 bg-gray-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6 text-center mb-16">
           <Heart className="w-6 h-6 text-wedding-gold mx-auto mb-6" />
           <h2 className="font-serif text-3xl md:text-4xl text-wedding-text mb-6">Stay With Us in Paradise</h2>
           <p className="text-gray-600 leading-relaxed mb-8 font-light text-lg">
             We have secured a block of rooms at the stunning <strong>Andaz Maui</strong>. 
             Xiaodong & Yuwen are providing a special gift to our guests to help with travel costs.
           </p>
           <div className="bg-white border border-wedding-gold/20 rounded-xl p-6 mb-8 shadow-sm">
              <div className="flex flex-col items-center">
                 <div className="bg-wedding-gold text-white p-2 rounded-full mb-3 shadow-lg">
                    <Gift className="w-6 h-6" />
                 </div>
                 <h3 className="font-serif text-xl font-bold text-wedding-text mb-2">Our Gift to You</h3>
                 <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 inline-block max-w-lg">
                    <div className="flex items-start gap-3 text-left">
                       <Check className="w-5 h-5 text-wedding-gold shrink-0 mt-0.5" />
                       <span>We will cover <strong>1 night's stay</strong> for the 06/12 wedding day (rate similar to standard room block rate in Andaz).</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Resort Inclusions Panel */}
            <div className="mb-12 bg-wedding-sand/30 border border-wedding-gold/20 rounded-2xl p-8 text-center max-w-5xl mx-auto shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-wedding-gold" />
                    <h3 className="font-serif text-2xl text-wedding-text">Andaz Resort Inclusions</h3>
                </div>
                <p className="text-gray-500 text-sm mb-6 max-w-2xl mx-auto">
                    Guests staying at the Andaz enjoy complimentary access to a wide range of activities and rentals as part of their stay.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3 text-left">
                    {ANDAZ_ACTIVITIES.map((activity, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-wedding-gold shrink-0"></div>
                            <span className="text-xs text-gray-700">{activity}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-20">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <h3 className="font-serif text-3xl text-wedding-text text-center min-w-max">Official Room Block</h3>
                    <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto justify-center">
                    {onsite.map(acc => <AccommodationCard key={acc.id} data={acc} pricingMode={pricingMode} viewMode={viewMode} />)}
                </div>
            </div>
            
            <div className="mb-20">
                <BookingStrategy />
            </div>

            {budget.length > 0 && (
            <div className="mb-20">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <h3 className="font-serif text-2xl text-wedding-text text-center min-w-max">Alternative Recommendation</h3>
                    <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                    {budget.map(acc => <AccommodationCard key={acc.id} data={acc} pricingMode={pricingMode} viewMode={viewMode} />)}
                </div>
            </div>
            )}
        </div>
      </section>

      {/* MENU follows STAY */}
      <section id="menu" className="py-20 bg-white border-b border-gray-100 scroll-mt-24">
         <MenuPreview />
      </section>

      <section id="travel" className="py-20 bg-white border-t border-gray-100 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-6">
           <div className="text-center mb-12">
               <Plane className="w-6 h-6 text-wedding-gold mx-auto mb-4" />
               <h2 className="font-serif text-3xl md:text-4xl text-wedding-text mb-4">Travel & Rental Cars</h2>
               <p className="text-gray-500 max-w-lg mx-auto">Essential information for your journey. <strong>Book your rental car early!</strong></p>
           </div>
           <TravelInfo />
        </div>
      </section>

      <section id="story" className="py-20 bg-gray-50 scroll-mt-24 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
            {isStoryOpen ? (
               <div className="animate-fade-in">
                  <OurStory />
                  <button onClick={() => setIsStoryOpen(false)} className="mt-12 text-gray-400 hover:text-wedding-gold text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto transition-colors">
                     <ChevronUp className="w-4 h-4" /> Fold Story
                  </button>
               </div>
            ) : (
               <div className="py-10">
                  <h2 className="font-serif text-3xl text-wedding-text mb-4">Our Journey</h2>
                  <button onClick={() => setIsStoryOpen(true)} className="bg-white border border-gray-200 text-gray-600 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:border-wedding-gold transition-all flex items-center gap-2 mx-auto">
                     Read Our Story <ChevronDown className="w-4 h-4" />
                  </button>
               </div>
            )}
        </div>
      </section>

      <section id="share-board" className="py-20 bg-white scroll-mt-24 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
               <span className="text-wedding-gold font-bold text-xs uppercase tracking-widest">Community</span>
               <h2 className="font-serif text-3xl text-wedding-text mt-2">Share a Stay</h2>
            </div>
            <GuestShareBoard />
        </div>
      </section>

      <section id="map" className="bg-wedding-text text-white py-20 scroll-mt-24">
         <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-start justify-between gap-12">
            <div className="lg:w-1/3">
               <h2 className="font-serif text-3xl mb-6">Location</h2>
               <p className="text-gray-400 leading-relaxed mb-8">Andaz Maui at Wailea Resort on Mokapu Beach.</p>
               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-2 rounded-full"><MapPin className="text-wedding-gold w-5 h-5" /></div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Address</h4>
                      <p className="text-gray-400 text-sm">3550 Wailea Alanui Dr, Wailea, HI 96753</p>
                    </div>
                  </div>
               </div>
            </div>
            <div className="lg:w-2/3 w-full h-[400px] bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
               <iframe width="100%" height="100%" src="https://maps.google.com/maps?q=Andaz+Maui+at+Wailea+Resort&t=&z=15&ie=UTF8&iwloc=&output=embed" frameBorder="0"></iframe>
            </div>
         </div>
      </section>

      <footer className="bg-black text-white/30 py-12 text-center text-xs relative">
        <p>&copy; 2026 Xiaodong & Yuwen Wedding. All rights reserved.</p>
        <button onClick={() => setIsAdminOpen(true)} className="absolute bottom-4 right-4 text-white/10 hover:text-white/40 flex items-center gap-1 transition-colors">
           <Lock className="w-3 h-3" /> Admin
        </button>
      </footer>

      <RSVPModal isOpen={isRsvpOpen} onClose={() => setIsRsvpOpen(false)} guestList={guestList} onSave={handleRsvpSave} />
      <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} events={WEDDING_SCHEDULE} />
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
};

export default App;
