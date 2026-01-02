
import React from 'react';
import { X, Clock } from 'lucide-react';
import Timeline from './Timeline';
import { ScheduleEvent } from '../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: ScheduleEvent[];
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, events }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-wedding-gold" />
                <h2 className="font-serif text-2xl text-gray-900">Weekend Schedule</h2>
            </div>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 p-2 rounded-full"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
        
        <div className="overflow-y-auto p-8 bg-gray-50">
            <Timeline events={events} />
            <div className="mt-12 text-center text-gray-400 text-xs">
                * Schedule is subject to minor changes. Final times will be emailed.
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
