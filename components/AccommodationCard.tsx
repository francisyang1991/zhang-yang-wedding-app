
import React, { useState } from 'react';
import { Accommodation } from '../types';
import { MapPin, Check, Star, Home, Hotel, Maximize, Bed, ExternalLink, ChevronLeft, ChevronRight, Bot, AlertTriangle, UserCheck, Info } from 'lucide-react';

interface Props {
  data: Accommodation;
  pricingMode: 'max' | 'comfort';
  viewMode: 'total' | 'perPerson';
}

const AccommodationCard: React.FC<Props> = ({ data, pricingMode, viewMode }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  
  const isOnsite = data.category === 'Onsite';
  const isVilla = data.id.includes('villa');
  
  // Identify the high-value villa for special highlighting (Ocean View 2213)
  const isHighValueVilla = data.id === 'andaz-villa-ocean';
  const isAcHotel = data.id.includes('ac-hotel');
  
  const divisor = pricingMode === 'max' ? data.maxGuests : (data.comfortCapacity || 1);
  const occupancyLabel = pricingMode === 'max' ? 'Max' : 'Comfort';

  // Nightly Rate Logic
  const nightlyRate = data.pricePerNight;
  const perPersonNightly = nightlyRate / divisor;

  const mainPriceDisplay = viewMode === 'total' ? nightlyRate : perPersonNightly;
  const mainLabel = viewMode === 'total' ? 'NIGHTLY RATE (INCL. TAX)' : 'PER PERSON / NIGHT';
    
  const hasMultipleImages = data.images && data.images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (data.images) {
      setCurrentImageIdx((prev) => (prev + 1) % data.images!.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (data.images) {
      setCurrentImageIdx((prev) => (prev - 1 + data.images!.length) % data.images!.length);
    }
  };

  const currentImageUrl = (data.images && data.images.length > 0) 
    ? data.images[currentImageIdx] 
    : data.imageUrl;

  return (
    <div className={`relative flex flex-col bg-white rounded-xl overflow-hidden shadow-md transition-transform hover:-translate-y-1 duration-300 border ${isOnsite ? 'border-wedding-gold ring-1 ring-wedding-gold ring-opacity-50' : 'border-gray-100'}`}>
      
      {isHighValueVilla && (
        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-lg z-10 uppercase tracking-wide flex items-center gap-1.5 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" />
          Only 2 available - Great Value!
        </div>
      )}

      <div className="h-56 w-full relative bg-gray-200 group">
         <img 
            src={currentImageUrl} 
            alt={data.name} 
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000';
            }}
          />
          
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] px-2 py-1 rounded z-20 flex items-center gap-1 border border-white/10">
             <Bot className="w-3 h-3" />
             <span>AI Visualization</span>
          </div>
          
          {hasMultipleImages && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-12 text-white">
             <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-wedding-gold" />
                    <span>{data.distanceToVenue}</span>
                </div>
                {data.sqft && (
                  <div className="flex items-center gap-1">
                     <Maximize className="w-3 h-3 text-gray-300" />
                     <span>{data.sqft} sqft</span>
                  </div>
                )}
             </div>
          </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border border-gray-200 px-2 py-0.5 rounded">
            {data.type === 'Airbnb' ? <Home className="w-3 h-3" /> : <Hotel className="w-3 h-3" />}
            {data.category.replace('_', ' ')}
          </div>
          {data.rating && (
            <div className="flex items-center text-yellow-500 text-xs font-bold">
                <Star className="w-3 h-3 fill-current" />
                <span className="ml-1 text-gray-700">{data.rating}</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-serif font-bold text-wedding-text mb-2 leading-tight">
          {data.name}
        </h3>
        
        <div className={`p-4 rounded-lg mb-4 border ${isOnsite ? 'bg-wedding-sand/30 border-wedding-gold/20 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
            <div className="flex justify-between items-end">
               <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{mainLabel}</p>
                  <p className={`font-bold text-3xl ${isOnsite ? 'text-wedding-gold' : 'text-wedding-ocean'}`}>
                    ${Math.round(mainPriceDisplay).toLocaleString()}
                  </p>
               </div>
            </div>

            <div className="pt-3 border-t border-gray-200/50 mt-3 flex items-center justify-between">
               <div className="flex items-center gap-1 text-[11px] text-gray-600 font-medium">
                  {isOnsite ? (
                    <>
                      <Bed className="w-3.5 h-3.5 text-wedding-gold" />
                      <span className="font-bold">Bed type available: {data.bedConfig}</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3 h-3" />
                      <span>{divisor} Guests ({occupancyLabel})</span>
                    </>
                  )}
               </div>
            </div>
        </div>

        <div className="mb-5 flex-1">
            <div className="flex justify-between items-center mb-2">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Details</p>
               {isVilla && (
                  <div className="relative group">
                     <div className="flex items-center gap-1 cursor-help bg-wedding-gold/10 px-2 py-0.5 rounded-full">
                       <Info className="w-3 h-3 text-wedding-gold" />
                       <span className="text-[9px] font-bold text-wedding-gold uppercase">Roommate Info</span>
                     </div>
                     <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
                       Don't worry about finding roommates yet! Simply RSVP with your interest in a Villa. We will help coordinate grouping guests together to fill the 3-bedroom units later.
                       <div className="absolute top-full right-6 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                     </div>
                  </div>
               )}
            </div>
            <ul className="space-y-1.5">
                {data.benefits.map((benefit, idx) => {
                    const isMin = benefit.includes('Stay') || benefit.includes('Minimal');
                    const isGift = benefit.includes('GIFT');
                    const isSpecial = benefit.includes('afterparty') || benefit.includes('Indoor pool');
                    
                    // Filter out complimentary minibar and bed type from display
                    if (benefit.toLowerCase().includes('bed type')) return null;
                    if (benefit.includes('Complimentary Minibar')) return null;
                    
                    return (
                      <li key={idx} className={`flex items-start gap-2 text-xs ${isMin || isGift || isSpecial ? 'font-bold text-wedding-gold' : 'text-gray-600'}`}>
                          <Check className={`w-3 h-3 mt-0.5 shrink-0 ${isMin || isGift || isSpecial ? 'text-wedding-gold' : 'text-gray-300'}`} />
                          <span>{benefit}</span>
                      </li>
                    );
                })}
            </ul>
        </div>

        {isAcHotel && data.bookingUrl && (
          <div className="mb-3 text-center">
             <a 
               href={data.bookingUrl}
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-[10px] font-bold text-wedding-ocean uppercase tracking-wider underline hover:text-wedding-gold transition-colors flex items-center justify-center gap-1"
             >
                <ExternalLink className="w-3 h-3" /> View Official Proposal & Details
             </a>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          {isOnsite ? (
             <div className="w-full"></div> 
          ) : (
            <button className={`w-full py-3 rounded-md font-bold text-xs transition-colors uppercase tracking-widest bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>
                Inquire
          </button>
          )}
          
          {data.virtualTourUrl && (
            <a href={data.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-md border border-wedding-gold/30 text-wedding-gold hover:bg-wedding-gold/5 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
