
import React from 'react';
import { ScheduleEvent } from '../types';
import { GlassWater, Heart, Music, Sun } from 'lucide-react';

interface TimelineProps {
  events: ScheduleEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cheers': return <GlassWater className="w-5 h-5 text-white" />;
      case 'Ring': return <Heart className="w-5 h-5 text-white" />;
      case 'Party': return <Music className="w-5 h-5 text-white" />;
      case 'Sun': return <Sun className="w-5 h-5 text-white" />;
      default: return <Heart className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-wedding-gold/30"></div>

      <div className="space-y-12">
        {events.map((event, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={event.id} className={`relative flex items-center md:justify-between ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
              
              {/* Content Card */}
              <div className={`ml-12 md:ml-0 w-full md:w-[45%] bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}>
                <div className="flex justify-between items-start mb-2">
                   <span className="text-wedding-gold font-bold text-xs uppercase tracking-widest">{event.day}, {event.date}</span>
                   <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">{event.time}</span>
                </div>
                <h3 className="font-serif text-xl text-wedding-text mb-2">{event.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{event.description}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    <span className="font-bold">Location:</span> {event.location}
                    <span className="mx-1">•</span>
                    <span className="font-bold">Attire:</span> {event.attire}
                </div>
              </div>

              {/* Center Dot/Icon */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-wedding-gold border-4 border-white shadow-md flex items-center justify-center z-10">
                 {getIcon(event.icon)}
              </div>

              {/* Empty Space for Layout Balance */}
              <div className="hidden md:block w-[45%]"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
