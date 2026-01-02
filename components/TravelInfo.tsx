
import React from 'react';
import { Plane, Car, Bus, MapPin, ExternalLink, Info, Ticket } from 'lucide-react';

const TravelInfo = () => {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Pro Tips Section */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
           Insider Strategy
        </div>
        <div className="flex items-start gap-4">
           <div className="bg-white p-3 rounded-full shadow-sm shrink-0">
              <Ticket className="w-6 h-6 text-blue-600" />
           </div>
           <div>
              <h3 className="font-serif text-xl font-bold text-wedding-text mb-2">Flying from Seattle?</h3>
              <div className="space-y-3">
                 <div className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5">TIP</span>
                    <p className="text-sm text-gray-700">
                      <strong>Alaska Companion Fare:</strong> This is the biggest money saver! Buy one ticket, get the second for ~$121. 
                      <span className="block text-gray-500 text-xs mt-1">Ask <strong>Xiaodong & Wendy</strong> for a referral code/link if you don't have the card.</span>
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Airport Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Plane className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-wedding-text mb-2">Flights</h3>
          <p className="text-sm font-bold text-gray-800 mb-1">Kahului Airport (OGG)</p>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Fly directly into OGG. It is the main airport on Maui and approximately a 30-minute drive to Wailea.
          </p>
          <div className="mt-auto pt-4 border-t border-gray-100 w-full">
            <p className="text-xs text-wedding-gold font-bold uppercase tracking-wider">Tip</p>
            <p className="text-xs text-gray-500">Book 3-6 months in advance.</p>
          </div>
        </div>

        {/* Car Rental Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="w-14 h-14 bg-wedding-gold/10 text-wedding-gold rounded-full flex items-center justify-center mb-4">
            <Car className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-wedding-text mb-2">Rental Car</h3>
          <p className="text-sm font-bold text-gray-800 mb-1">Not Needed for June 11-13</p>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            We do not recommend renting a car for the main wedding days. It is great for extending your stay afterwards to explore.
          </p>
          <div className="mt-auto pt-4 border-t border-gray-100 w-full">
            <p className="text-xs text-wedding-gold font-bold uppercase tracking-wider">Valet Parking</p>
            <p className="text-xs text-gray-500">$59 / night at Andaz</p>
          </div>
        </div>

        {/* Shuttle/Rideshare Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-4">
            <Bus className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-wedding-text mb-2">Shuttle & Rideshare</h3>
          <p className="text-sm font-bold text-gray-800 mb-1">Uber / Lyft / Taxi</p>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Rideshares are available from OGG to Wailea (~$50-$70).
          </p>
          <div className="mt-auto pt-4 border-t border-gray-100 w-full">
            <p className="text-xs text-wedding-gold font-bold uppercase tracking-wider">Alternative</p>
            <p className="text-xs text-gray-500">
               <a href="https://www.speedishuttle.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-wedding-ocean">SpeediShuttle</a> shared rides.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info Box */}
      <div className="bg-wedding-sand/50 rounded-xl p-6 border border-wedding-gold/20 flex flex-col md:flex-row gap-6 items-start">
         <div className="shrink-0 bg-white p-3 rounded-full shadow-sm">
            <MapPin className="w-6 h-6 text-wedding-gold" />
         </div>
         <div>
            <h4 className="font-serif text-lg font-bold text-wedding-text mb-2">Getting to the Venue</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              From OGG Airport, take Airport Access Rd to HI-311 S (Mokulele Hwy). Continue onto Piilani Hwy (HI-31 S) towards Wailea. 
              Turn right onto Wailea Ike Dr, then left onto Wailea Alanui Dr. The Andaz will be on your right.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-wedding-ocean uppercase tracking-wide">
               <span className="flex items-center gap-1">
                 <Info className="w-4 h-4" /> 35 Minutes Drive
               </span>
               <span className="flex items-center gap-1">
                 <Info className="w-4 h-4" /> 16 Miles
               </span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TravelInfo;
