
import React, { useState, useEffect } from 'react';
import { storyService } from '../services/storyService';
import type { Database } from '../types/database';

type StoryContent = Database['public']['Tables']['story_content']['Row'];

const OurStory = () => {
  const [stories, setStories] = useState<StoryContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const publishedStories = await storyService.getPublishedStoryContent();
        setStories(publishedStories);
      } catch (error) {
        console.error('Error loading published stories:', error);
        // Keep empty array if loading fails
      } finally {
        setIsLoading(false);
      }
    };

    loadStories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-gold"></div>
      </div>
    );
  }

  if (stories.length === 0) {
    // Fallback to original content if no published stories
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
           <h2 className="font-serif text-4xl text-wedding-text mb-6">Our Story</h2>
           <p className="text-gray-600 leading-relaxed mb-4 font-light">
             Our love story is just beginning. Check back soon as we share our journey!
           </p>
           <div className="flex items-center gap-4">
              <div className="text-center">
                 <span className="block font-serif text-3xl text-wedding-gold">∞</span>
                 <span className="text-[10px] text-gray-400 uppercase tracking-wider">Love Forever</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Display published stories
  return (
    <div className="space-y-16">
      {stories.map((story, index) => (
        <div key={story.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
          {/* Image Section */}
          <div className="w-full md:w-1/2 relative">
            <div className={`absolute top-4 ${index % 2 === 0 ? '-left-4' : '-right-4'} w-full h-full border-2 border-wedding-gold/30 rounded-xl z-0`}></div>
            <img
              src="https://images.unsplash.com/photo-1522673607200-1645062cd958?q=80&w=1000"
              alt="Couple Portrait"
              className="w-full h-auto rounded-xl shadow-lg relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2">
            <span className="text-wedding-gold font-bold text-xs uppercase tracking-widest mb-4 block">The Journey</span>
            <h2 className="font-serif text-4xl text-wedding-text mb-6">{story.title}</h2>
            <div className="text-gray-600 leading-relaxed font-light">
              {story.content.split('\n\n').map((paragraph, pIndex) => (
                <p key={pIndex} className="mb-4 last:mb-0">
                  {paragraph.split('\n').map((line, lIndex) => (
                    <React.Fragment key={lIndex}>
                      {line}
                      {lIndex < paragraph.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              ))}
            </div>

            {/* Stats for first story only */}
            {index === 0 && (
              <div className="flex items-center gap-4 mt-6">
                <div className="text-center">
                  <span className="block font-serif text-3xl text-wedding-gold">∞</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Love Forever</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OurStory;
