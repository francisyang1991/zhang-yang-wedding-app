
import React from 'react';

const OurStory = () => {
  return (
    <div className="flex flex-col md:flex-row gap-12 items-center">
      <div className="w-full md:w-1/2 relative">
         <div className="absolute top-4 -left-4 w-full h-full border-2 border-wedding-gold/30 rounded-xl z-0"></div>
         <img 
           src="https://images.unsplash.com/photo-1522673607200-1645062cd958?q=80&w=1000" 
           alt="Couple Portrait" 
           className="w-full h-auto rounded-xl shadow-lg relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
         />
      </div>
      
      <div className="w-full md:w-1/2">
         <span className="text-wedding-gold font-bold text-xs uppercase tracking-widest mb-4 block">The Journey</span>
         <h2 className="font-serif text-4xl text-wedding-text mb-6">How We Met</h2>
         <p className="text-gray-600 leading-relaxed mb-4 font-light">
           It began with a steaming pot of spicy hotpot at Chengdu Memory in Seattle. Six years, countless miles, two cats, and a life built through adventure later—we're making it official.
         </p>
         <p className="text-gray-600 leading-relaxed mb-6 font-light">
           Maui was our first trip together, a place marked by sunsets we never forgot. Being here, surrounded by our most beloved friends, is what gives this moment its meaning.
         </p>
         <div className="flex items-center gap-4">
            <div className="text-center">
               <span className="block font-serif text-3xl text-wedding-gold">2,190</span>
               <span className="text-[10px] text-gray-400 uppercase tracking-wider">Days Together</span>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
               <span className="block font-serif text-3xl text-wedding-gold">3</span>
               <span className="text-[10px] text-gray-400 uppercase tracking-wider">Cities Lived</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OurStory;
