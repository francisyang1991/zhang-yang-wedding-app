
import React from 'react';
import { Utensils, Wine, Coffee, Flame, Leaf, Fish } from 'lucide-react';

const MenuPreview = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 text-center">
      <div className="mb-16">
         <Utensils className="w-8 h-8 text-wedding-gold mx-auto mb-4" />
         <h2 className="font-serif text-4xl md:text-5xl text-wedding-text mb-4 italic">The Wedding Menu</h2>
         <p className="text-gray-500 max-w-lg mx-auto uppercase text-[10px] tracking-[0.3em] font-bold">
           June 12, 2026 • Wailea, Maui
         </p>
         <div className="menu-divider"></div>
      </div>

      {/* Signature Cocktails Section */}
      <div className="mb-20">
        <div className="flex items-center justify-center gap-3 mb-10">
           <div className="h-px w-8 bg-wedding-gold/40"></div>
           <h3 className="font-serif text-2xl text-gray-800">His & Her Signature Cocktails</h3>
           <div className="h-px w-8 bg-wedding-gold/40"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-2xl border border-wedding-gold/10 shadow-sm relative group hover:shadow-md transition-all">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-wedding-sand px-4 py-1 text-wedding-gold text-[10px] font-bold uppercase tracking-widest border border-wedding-gold/20 rounded-full">Hers</div>
             <h4 className="font-serif text-2xl text-gray-800 mb-2">Almond Blossom</h4>
             <p className="text-xs text-gray-500 italic mb-4">"Playful, creamy with bright citrus notes and a soft, milky finish."</p>
             <div className="text-sm text-gray-700 space-y-1 font-light border-t border-gray-50 pt-4">
               <span className="block opacity-60 text-[10px] font-bold uppercase mb-1">Ingredients</span>
               <p>Blue Curaçao, Lemon Juice, Yakult, Milkis</p>
             </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-wedding-gold/10 shadow-sm relative group hover:shadow-md transition-all">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-wedding-sand px-4 py-1 text-wedding-gold text-[10px] font-bold uppercase tracking-widest border border-wedding-gold/20 rounded-full">His</div>
             <h4 className="font-serif text-2xl text-gray-800 mb-2">Negroni</h4>
             <p className="text-xs text-gray-500 italic mb-4">"Bold, aromatic, and spirit-forward. Classic and timeless."</p>
             <div className="text-sm text-gray-700 space-y-1 font-light border-t border-gray-50 pt-4">
               <span className="block opacity-60 text-[10px] font-bold uppercase mb-1">Ingredients</span>
               <p>Gin, Sweet Vermouth, Campari</p>
             </div>
          </div>
        </div>
      </div>

      {/* Food Courses */}
      <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 text-left">
        
        {/* Cocktail Hour */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <Wine className="w-5 h-5 text-wedding-gold" />
             <h4 className="font-serif text-2xl border-b border-wedding-gold/20 pb-1 flex-1">Cocktail Hour</h4>
          </div>
          <div className="space-y-4 pl-9">
             <div>
                <p className="font-bold text-sm text-gray-800">Scallop Skewer</p>
                <p className="text-xs text-gray-500">Cilantro Chermoula, Preserved Lemon</p>
             </div>
             <div>
                <p className="font-bold text-sm text-gray-800">Maine Lobster & White Truffle Melt</p>
                <p className="text-xs text-gray-500">Brioche, Marinated Tomato</p>
             </div>
             <div>
                <p className="font-bold text-sm text-gray-800">Foie Gras Torchon</p>
                <p className="text-xs text-gray-500">Brioche, Red Onion Jam, Black Salt</p>
             </div>
          </div>
        </div>

        {/* Courses */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <Leaf className="w-5 h-5 text-wedding-gold" />
             <h4 className="font-serif text-2xl border-b border-wedding-gold/20 pb-1 flex-1">Starters & Salad</h4>
          </div>
          <div className="space-y-6 pl-9">
             <div className="flex items-start gap-4">
                <Fish className="w-4 h-4 text-wedding-gold mt-1 shrink-0" />
                <div>
                   <p className="font-bold text-sm text-gray-800 uppercase tracking-wide">Starter: Ahi Poke</p>
                   <p className="text-xs text-gray-500">Cucumber Ribbons, Crisp Sweet Potato</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <Leaf className="w-4 h-4 text-wedding-gold mt-1 shrink-0" />
                <div>
                   <p className="font-bold text-sm text-gray-800 uppercase tracking-wide">Salad: Local Butter Lettuce</p>
                   <p className="text-xs text-gray-500 leading-relaxed">Avocado, Roasted Tomatoes, Honey-Lavender Vinaigrette, Macadamia Nuts</p>
                </div>
             </div>
          </div>
        </div>

        {/* Main Course */}
        <div className="space-y-6 md:col-span-1">
          <div className="flex items-center gap-4">
             <Flame className="w-5 h-5 text-wedding-gold" />
             <h4 className="font-serif text-2xl border-b border-wedding-gold/20 pb-1 flex-1">Main Course</h4>
          </div>
          <div className="pl-9">
             <p className="font-bold text-lg text-gray-800 mb-1">Wagyu Striploin & Spiny Lobster</p>
             <p className="text-xs text-gray-500 italic leading-relaxed">
               Roasted Garlic Butter, Asparagus, Scalloped Potatoes
             </p>
          </div>
        </div>

        {/* Dessert & Cake */}
        <div className="space-y-6 md:col-span-1">
          <div className="flex items-center gap-4">
             <Coffee className="w-5 h-5 text-wedding-gold" />
             <h4 className="font-serif text-2xl border-b border-wedding-gold/20 pb-1 flex-1">Sweet Finale</h4>
          </div>
          <div className="pl-9 grid grid-cols-2 gap-4">
             <div className="space-y-3">
                <p className="text-[10px] font-bold text-wedding-gold uppercase tracking-widest">Dessert Trio</p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-3">
                   <li>Dulce Caramel Cream Puffs</li>
                   <li>Coconut Panna Cotta</li>
                   <li>Chocolate Pot de Crème</li>
                </ul>
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-bold text-wedding-gold uppercase tracking-widest">Wedding Cake</p>
                <p className="font-bold text-sm text-gray-800">Red Velvet Cake</p>
                <p className="text-[10px] text-gray-500">Cream Cheese Filling & Frosting</p>
             </div>
          </div>
        </div>

      </div>
      
      <div className="mt-24 p-6 bg-wedding-sand border border-wedding-gold/20 rounded-2xl inline-block max-w-xl">
          <p className="text-xs text-gray-600 font-medium leading-relaxed italic">
            "A locally-sourced Hawaiian fusion menu curated with the Andaz executive chef to celebrate the island's flavors and our favorite memories."
          </p>
      </div>
    </div>
  );
};

export default MenuPreview;