
import React from 'react';
import { CreditCard, Gift, AlertCircle, CheckCircle2, XCircle, Hotel, ShieldCheck, Sparkles, Layers, Users } from 'lucide-react';

const BookingStrategy = () => {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Andaz Comparison Group */}
      <div>
         <div className="text-center mb-8">
            <span className="bg-wedding-gold/10 text-wedding-gold px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Official Venue</span>
            <h3 className="font-serif text-2xl text-gray-800 mt-2">How to Book Andaz Maui</h3>
            <p className="text-sm text-gray-500">Choose the strategy that works best for your travel plans</p>
         </div>

         <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Option A: Official Block */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-wedding-gold/30 relative overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-wedding-gold/10 p-4 border-b border-wedding-gold/20 text-center">
                <div className="inline-block bg-wedding-gold text-white p-2 rounded-full mb-2 shadow-sm">
                  <Gift className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-wedding-text">Option A: Group Room Block</h3>
                <p className="text-[10px] font-bold text-wedding-gold uppercase tracking-wider">The Standard Choice</p>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                   <li className="flex items-start gap-3">
                     <AlertCircle className="w-4 h-4 text-wedding-gold mt-0.5 shrink-0" />
                     <span className="text-xs text-gray-700 font-bold">Requires 2-3 Nights Minimum</span>
                   </li>
                   <li className="flex items-start gap-3">
                     <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                     <span className="text-xs text-gray-600"><strong>Lowest Base Rate</strong> via Discount Link</span>
                   </li>
                   <li className="flex items-start gap-3">
                     <Gift className="w-4 h-4 text-wedding-gold mt-0.5 shrink-0" />
                     <span className="text-xs text-gray-600"><strong>We cover 1 Night</strong> (Wedding Day)</span>
                   </li>
                   <li className="flex items-start gap-3">
                     <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                     <span className="text-xs text-gray-600"><strong>Free Cancellation</strong> before April 2026</span>
                   </li>
                   <li className="flex items-start gap-3">
                     <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                     <span className="text-xs text-gray-600"><strong>Waived Resort Fee</strong> ($50 value/day)</span>
                   </li>
                </ul>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-auto">
                   <p className="text-[10px] text-gray-500 leading-relaxed italic text-center">
                     Best for guests staying strictly for the wedding core.
                   </p>
                </div>
              </div>
            </div>

            {/* Option B: Amex Travel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="bg-gray-50 p-4 border-b border-gray-100 text-center">
                <div className="inline-block bg-gray-200 text-gray-600 p-2 rounded-full mb-2">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-700">Option B: Amex Travel</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">FHR / Platinum Card</p>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                   <li className="flex items-start gap-3">
                     <Sparkles className="w-4 h-4 text-wedding-ocean mt-0.5 shrink-0" />
                     <span className="text-xs text-gray-700 font-bold"><strong>$300 Credit</strong> per Platinum Card / Night</span>
                   </li>
                   <li className="flex items-start gap-3">
                     <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                     <span className="text-xs text-gray-600">Daily Breakfast for Two</span>
                   </li>
                   <li className="flex items-start gap-3">
                     <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                     <span className="text-xs text-gray-600">Room Upgrade & Late Checkout</span>
                   </li>
                   <li className="flex items-start gap-3">
                     <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                     <span className="text-xs text-gray-500"><strong>~$200/night Higher</strong> base rate vs Group Rate</span>
                   </li>
                   <li className="flex items-start gap-3">
                     <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                     <span className="text-xs text-gray-600">Cheapest rate is <strong>Non-Refundable</strong></span>
                   </li>
                   <li className="flex items-start gap-3">
                     <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                     <span className="text-xs text-gray-500"><strong>+$150/night</strong> for refundable rate</span>
                   </li>
                </ul>
                <p className="text-[10px] text-center text-gray-400 mt-auto">Best if you have unused Amex credits and want luxury perks.</p>
              </div>
            </div>

            {/* Option C: The Hybrid Strategy */}
            <div className="bg-wedding-ocean/5 rounded-xl shadow-sm border border-wedding-ocean/20 relative overflow-hidden flex flex-col hover:border-wedding-ocean transition-colors">
              <div className="bg-wedding-ocean/10 p-4 border-b border-wedding-ocean/20 text-center">
                <div className="inline-block bg-wedding-ocean text-white p-2 rounded-full mb-2">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-wedding-ocean">Option C: Pro Hybrid</h3>
                <p className="text-[10px] font-bold text-wedding-ocean uppercase tracking-wider">The "Best of Both" Move</p>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                   <div className="flex items-start gap-3">
                     <div className="bg-wedding-gold text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0 uppercase">June 11-13</div>
                     <p className="text-xs text-gray-700">
                       Book with <strong>Option A (Wedding Block)</strong> to get the discount, allowance, and proximity for the ceremony.
                     </p>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="bg-wedding-ocean text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0 uppercase">June 13-14</div>
                     <p className="text-xs text-gray-700">
                       Switch to <strong>Option B (Amex Travel)</strong> for your final night to use your $300 credit and enjoy breakfast.
                     </p>
                   </div>
                </div>
                <div className="mt-6 border-t border-wedding-ocean/10 pt-4">
                   <p className="text-[10px] text-center text-wedding-ocean font-bold uppercase tracking-widest">Maximizes all benefits</p>
                </div>
              </div>
            </div>
         </div>

         {/* Villa Sharing Note */}
         <div className="max-w-6xl mx-auto mt-6">
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 relative overflow-hidden">
                <div className="flex items-start gap-4">
                   <div className="bg-white p-3 rounded-full shadow-sm shrink-0">
                      <Users className="w-6 h-6 text-purple-600" />
                   </div>
                   <div>
                      <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">Interested in an Andaz Villa?</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>Don't worry about finding roommates yet!</strong> Simply RSVP with your interest in a Villa. 
                        We will help coordinate grouping guests together to fill the 3-bedroom units later.
                      </p>
                   </div>
                </div>
            </div>
         </div>
      </div>

      {/* Divider */}
      <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-[10px] uppercase tracking-widest">Other Accommodation</span>
          <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* AC Hotel Group */}
      <div>
         <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col opacity-90 hover:opacity-100 transition-opacity">
              <div className="bg-gray-50 p-4 border-b border-gray-100 text-center">
                <div className="inline-block bg-gray-200 text-gray-600 p-2 rounded-full mb-2">
                  <Hotel className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-700">AC Hotel Alternative</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Budget-Friendly / Modern</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                   <li className="flex items-start gap-3">
                     <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                     <span className="text-sm text-gray-600"><strong>Newest Stylish Hotel in Wailea!</strong></span>
                   </li>
                   <li className="flex items-start gap-3">
                     <ShieldCheck className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                     <span className="text-sm text-gray-600"><strong>Marriott Bonvoy:</strong> Earn points on your stay.</span>
                   </li>
                </ul>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default BookingStrategy;
