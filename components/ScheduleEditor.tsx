import React, { useState, useEffect } from 'react';
import { scheduleService } from '../services/scheduleService';
import { ScheduleEvent } from '../types';
import { Edit2, Save, X, Loader2, Calendar } from 'lucide-react';

const ScheduleEditor = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ScheduleEvent>>({});
  const [isSaving, setIsSaving] = useState(false);

  const loadSchedule = async () => {
    try {
      setIsLoading(true);
      const data = await scheduleService.getSchedule();
      setEvents(data);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const handleEdit = (event: ScheduleEvent) => {
    setEditingId(event.id);
    setEditForm({ ...event });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    try {
      setIsSaving(true);
      await scheduleService.updateEvent(id, editForm);
      await loadSchedule();
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-wedding-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <div key={event.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          {editingId === event.id ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:border-wedding-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                  <input
                    value={editForm.time || ''}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:border-wedding-gold focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Day</label>
                  <input
                    value={editForm.day || ''}
                    onChange={(e) => setEditForm({ ...editForm, day: e.target.value })}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:border-wedding-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                  <input
                    value={editForm.date || ''}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:border-wedding-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                <input
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-wedding-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-wedding-gold focus:outline-none h-20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Attire</label>
                <input
                  value={editForm.attire || ''}
                  onChange={(e) => setEditForm({ ...editForm, attire: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-wedding-gold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={() => handleSave(event.id)}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm bg-wedding-gold text-white rounded-lg hover:bg-[#b08d4a] flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-wedding-gold uppercase tracking-wider">{event.day}, {event.date} • {event.time}</span>
                </div>
                <h3 className="font-serif text-lg text-gray-800 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.location}</span>
                  <span>•</span>
                  <span>Attire: {event.attire}</span>
                </div>
              </div>
              <button
                onClick={() => handleEdit(event)}
                className="p-2 text-gray-400 hover:text-wedding-gold hover:bg-gray-50 rounded-lg transition-colors"
                title="Edit Event"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScheduleEditor;