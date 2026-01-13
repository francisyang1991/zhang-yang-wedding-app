import React, { useState, useEffect } from 'react';
import { storyService } from '../services/storyService';
import { photoService } from '../services/photoService';
import type { Database } from '../types/database';
import { ChevronLeft, ChevronRight, Maximize2, X, Grid } from 'lucide-react';

type StoryContent = Database['public']['Tables']['story_content']['Row'];
type Photo = Database['public']['Tables']['photos']['Row'];

const OurStory = () => {
  const [stories, setStories] = useState<StoryContent[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [publishedStories, storyPhotos] = await Promise.all([
          storyService.getPublishedStoryContent(),
          photoService.getPhotosByCategory('story')
        ]);
        
        setStories(publishedStories);
        setPhotos(storyPhotos);
      } catch (error) {
        console.error('Error loading story data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate days together
  const startDate = new Date('2020-11-27');
  const today = new Date();
  const daysTogether = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-gold"></div>
      </div>
    );
  }

  // --- Hybrid "Puzzle" View Components ---

  const renderPhotoGallery = () => {
    if (photos.length === 0) {
      return (
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg group cursor-pointer">
          <img 
            src="/images/couple-portrait.jpeg" 
            alt="Couple Portrait" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      );
    }

    // --- Mobile View: Horizontal Scrollable Carousel (Swipe) ---
    const mobileView = (
      <div className="md:hidden w-full">
        <div className="flex overflow-x-auto snap-x gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
          {photos.map((photo) => (
             <div 
               key={photo.id} 
               className="snap-center shrink-0 w-[85vw] aspect-[3/4] rounded-xl overflow-hidden shadow-md relative"
               onClick={() => { setSelectedPhoto(photo); setIsGalleryOpen(true); }}
             >
               <img 
                 src={photo.url} 
                 alt={photo.alt_text || "Story Photo"} 
                 className="w-full h-full object-cover"
               />
             </div>
          ))}
          {photos.length === 0 && (
             <div className="snap-center shrink-0 w-[85vw] aspect-[3/4] rounded-xl overflow-hidden shadow-md relative">
                <img src="/images/couple-portrait.jpeg" className="w-full h-full object-cover" />
             </div>
          )}
        </div>
        <div className="text-center mt-2 text-xs text-gray-400 font-medium animate-pulse">
           Swipe for more &rarr;
        </div>
      </div>
    );

    // --- Desktop View: Single Image Carousel (Restored "Normal" View) ---
    const desktopView = (
      <div className="hidden md:block relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-white p-1 group">
         <div 
           className="relative w-full h-full overflow-hidden rounded-lg cursor-pointer"
           onClick={() => { setSelectedPhoto(photos[currentPhotoIndex]); setIsGalleryOpen(true); }}
         >
           <img 
             src={photos[currentPhotoIndex].url} 
             alt={photos[currentPhotoIndex].alt_text || "Our Story"} 
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
           />
           
           {/* Navigation Controls */}
           {photos.length > 1 && (
             <>
               <button 
                 onClick={prevPhoto}
                 className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
               >
                 <ChevronLeft className="w-6 h-6" />
               </button>
               <button 
                 onClick={nextPhoto}
                 className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
               >
                 <ChevronRight className="w-6 h-6" />
               </button>
               
               {/* Indicators */}
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                 {photos.map((_, idx) => (
                   <button
                     key={idx}
                     onClick={(e) => { e.stopPropagation(); setCurrentPhotoIndex(idx); }}
                     className={`w-2 h-2 rounded-full transition-all duration-300 ${
                       idx === currentPhotoIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                     }`}
                   />
                 ))}
               </div>
               
               {/* View All Button Overlay */}
               <div className="absolute top-4 right-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsGalleryOpen(true); }}
                    className="p-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="View All Photos"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
               </div>
             </>
           )}
         </div>
      </div>
    );

    return (
      <>
        {mobileView}
        {desktopView}
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
        {/* Photo Section (Expanded to 50%) */}
        <div className="w-full md:w-1/2 relative">
           {/* Decorative Border (Desktop only) */}
           <div className="hidden md:block absolute top-4 -left-4 w-full h-full border-2 border-wedding-gold/30 rounded-xl z-0 pointer-events-none"></div>
           
           <div className="relative z-10">
             {renderPhotoGallery()}
           </div>
        </div>

        {/* Story Text Section (Reduced to 50% and left-aligned) */}
        <div className="w-full md:w-1/2 text-left">
           <span className="text-wedding-gold font-bold text-xs uppercase tracking-widest mb-4 block">The Journey</span>
           
           {stories.length > 0 ? (
             <div className="space-y-8">
               {stories.map((story) => (
                 <div key={story.id}>
                   <h2 className="font-serif text-4xl text-wedding-text mb-4">{story.title}</h2>
                   <div className="text-gray-600 leading-relaxed font-light">
                      {story.content}
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <>
               <h2 className="font-serif text-4xl text-wedding-text mb-6">How We Met</h2>
           <p className="text-gray-600 leading-relaxed mb-4 font-light">
                 It began with a steaming pot of spicy hotpot at Chengdu Memory in Seattle. Six years, countless miles, two cats, and a life built through adventure later—we're making it official.
               </p>
               <p className="text-gray-600 leading-relaxed mb-6 font-light">
                 Maui was our first trip together, a place marked by sunsets we never forgot. Being here, surrounded by our most beloved friends, is what gives this moment its meaning.
               </p>
             </>
           )}

           <div className="flex items-center justify-center md:justify-start gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="text-center md:text-left">
                 <span className="block font-serif text-4xl text-wedding-gold mb-1">{daysTogether.toLocaleString()}</span>
                 <span className="text-[10px] text-gray-400 uppercase tracking-wider">Days Together</span>
              </div>
           </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal (Masonry) */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-fade-in overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
             <h2 className="font-serif text-2xl text-wedding-text">Our Journey Gallery</h2>
             <button 
               onClick={() => setIsGalleryOpen(false)}
               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
             >
               <X className="w-6 h-6 text-gray-600" />
             </button>
          </div>

          {/* Masonry Grid */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {photos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img 
                    src={photo.url} 
                    alt={photo.alt_text || "Gallery Photo"} 
                    className="w-full h-auto hover:opacity-90 transition-opacity"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                </div>
              ))}
            </div>
                </div>
              </div>
            )}

      {/* Lightbox for Selected Photo (within Gallery) */}
      {selectedPhoto && isGalleryOpen && (
        <div 
          className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
           <button 
             className="absolute top-4 right-4 text-white/50 hover:text-white p-2"
             onClick={() => setSelectedPhoto(null)}
           >
             <X className="w-8 h-8" />
           </button>
           
           <img 
             src={selectedPhoto.url} 
             alt={selectedPhoto.alt_text || "Full View"} 
             className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
             onClick={(e) => e.stopPropagation()} // Don't close when clicking image
           />
           
           {selectedPhoto.caption && (
             <div className="absolute bottom-8 left-0 right-0 text-center text-white/80 px-4">
               <p className="bg-black/50 inline-block px-4 py-2 rounded-full backdrop-blur-sm text-sm">
                 {selectedPhoto.caption}
               </p>
          </div>
           )}
        </div>
      )}
    </>
  );
};

export default OurStory;