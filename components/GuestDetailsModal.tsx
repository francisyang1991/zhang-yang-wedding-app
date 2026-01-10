import React, { useEffect, useMemo, useState } from 'react';
import { X, Mail, Trash2, Pencil, Save, Ban } from 'lucide-react';
import type { Guest } from '../types';

interface GuestDetailsModalProps {
  guest: Guest;
  onClose: () => void;
  onDelete: (guest: Guest) => void;
  onSendEmail: (guest: Guest) => void;
  onSave: (guestId: string, updates: Partial<Guest>) => Promise<void>;
  isSaving?: boolean;
}

const labelClass = 'text-[10px] font-bold text-gray-500 uppercase tracking-wider';
const valueClass = 'text-sm text-gray-900';

const formatAccommodation = (accommodation?: Guest['accommodation']) => {
  if (!accommodation) return '-';
  if (accommodation === 'andaz') return 'Andaz';
  if (accommodation === 'ac_hotel') return 'AC Hotel';
  if (accommodation === 'self') return 'Self booked / Other';
  return accommodation;
};

const formatText = (value?: string) => {
  if (!value) return '-';
  return value.replace(/_/g, ' ');
};

const GuestDetailsModal: React.FC<GuestDetailsModalProps> = ({ guest, onClose, onDelete, onSendEmail, onSave, isSaving }) => {
  const fullName = `${guest.firstName} ${guest.lastName}`.trim();
  const [isEditing, setIsEditing] = useState(false);

  const initialForm = useMemo(() => {
    return {
      firstName: guest.firstName || '',
      lastName: guest.lastName || '',
      email: guest.email || '',
      phone: guest.phone || '',
      rsvpStatus: guest.rsvpStatus,
      accommodation: guest.accommodation || '',
      roomDetail: guest.roomDetail || '',
      bookingMethod: guest.bookingMethod || '',
      mealChoice: guest.mealChoice || '',
      dietaryRestrictions: guest.dietaryRestrictions || '',
      plusOne: !!guest.plusOne,
      plusOneName: guest.plusOneName || '',
      note: guest.note || '',
    };
  }, [guest]);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialForm);
    setIsEditing(false);
  }, [initialForm]);

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const updates: Partial<Guest> = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      rsvpStatus: form.rsvpStatus,
      accommodation: (form.accommodation || undefined) as any,
      roomDetail: form.roomDetail.trim() || undefined,
      bookingMethod: form.bookingMethod.trim() || undefined,
      mealChoice: form.mealChoice.trim() || undefined,
      dietaryRestrictions: form.dietaryRestrictions.trim() || undefined,
      plusOne: !!form.plusOne,
      plusOneName: form.plusOne ? (form.plusOneName.trim() || undefined) : undefined,
      note: form.note.trim() || undefined,
    };

    await onSave(guest.id, updates);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-serif text-xl text-gray-900">{fullName || 'Guest details'}</h3>
            <p className="text-xs text-gray-500">{guest.email || 'No email on file'}</p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold flex items-center gap-2"
                title="Edit guest"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className={labelClass}>RSVP Status</div>
                <div className={valueClass}>{guest.rsvpStatus}</div>
              </div>
              <div>
                <div className={labelClass}>Phone</div>
                <div className={valueClass}>{guest.phone || '-'}</div>
              </div>
              <div>
                <div className={labelClass}>Accommodation</div>
                <div className={valueClass}>{formatAccommodation(guest.accommodation)}</div>
              </div>
              <div>
                <div className={labelClass}>Room Details</div>
                <div className={valueClass}>{formatText(guest.roomDetail)}</div>
              </div>
              <div>
                <div className={labelClass}>Booking Method</div>
                <div className={valueClass}>{formatText(guest.bookingMethod)}</div>
              </div>
              <div>
                <div className={labelClass}>Dinner Selection</div>
                <div className={valueClass}>{guest.mealChoice || '-'}</div>
              </div>
              <div className="md:col-span-2">
                <div className={labelClass}>Dietary Restrictions</div>
                <div className={valueClass}>{guest.dietaryRestrictions || '-'}</div>
              </div>
              <div className="md:col-span-2">
                <div className={labelClass}>Plus One</div>
                <div className={valueClass}>{guest.plusOne ? (guest.plusOneName || 'Yes') : 'No'}</div>
              </div>
              <div className="md:col-span-2">
                <div className={labelClass}>Notes</div>
                <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                  {guest.note || '-'}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className={labelClass}>First name</div>
                  <input
                    value={form.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                  />
                </div>
                <div>
                  <div className={labelClass}>Last name</div>
                  <input
                    value={form.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                  />
                </div>
                <div>
                  <div className={labelClass}>Email</div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                  />
                </div>
                <div>
                  <div className={labelClass}>Phone</div>
                  <input
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                  />
                </div>
                <div>
                  <div className={labelClass}>RSVP status</div>
                  <select
                    value={form.rsvpStatus}
                    onChange={(e) => updateField('rsvpStatus', e.target.value as any)}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Attending">Attending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
                <div>
                  <div className={labelClass}>Accommodation</div>
                  <select
                    value={form.accommodation}
                    onChange={(e) => updateField('accommodation', e.target.value as any)}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                  >
                    <option value="">-</option>
                    <option value="andaz">Andaz</option>
                    <option value="ac_hotel">AC Hotel</option>
                    <option value="self">Self booked / Other</option>
                  </select>
                </div>
                <div>
                  <div className={labelClass}>Room details</div>
                  <input
                    value={form.roomDetail}
                    onChange={(e) => updateField('roomDetail', e.target.value)}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                    placeholder="e.g. Full Ocean View | 1 King"
                  />
                </div>
                <div>
                  <div className={labelClass}>Booking method / stay duration</div>
                  <input
                    value={form.bookingMethod}
                    onChange={(e) => updateField('bookingMethod', e.target.value)}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                    placeholder="e.g. 3 Nights / Villa"
                  />
                </div>
                <div>
                  <div className={labelClass}>Meal choice</div>
                  <input
                    value={form.mealChoice}
                    onChange={(e) => updateField('mealChoice', e.target.value)}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                    placeholder="e.g. Wagyu & Lobster"
                  />
                </div>
                <div>
                  <div className={labelClass}>Dietary restrictions</div>
                  <input
                    value={form.dietaryRestrictions}
                    onChange={(e) => updateField('dietaryRestrictions', e.target.value)}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                    placeholder="e.g. No cheese"
                  />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.plusOne}
                    onChange={(e) => updateField('plusOne', e.target.checked)}
                    className="accent-wedding-gold"
                  />
                  Plus one
                </label>
                {form.plusOne && (
                  <input
                    value={form.plusOneName}
                    onChange={(e) => updateField('plusOneName', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                    placeholder="Plus one name"
                  />
                )}
              </div>

              <div>
                <div className={labelClass}>Notes</div>
                <textarea
                  value={form.note}
                  onChange={(e) => updateField('note', e.target.value)}
                  className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold h-24"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => onSendEmail(guest)}
                disabled={!guest.email || guest.rsvpStatus !== 'Attending'}
                className="bg-wedding-gold text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  !guest.email ? 'No email on file' : guest.rsvpStatus !== 'Attending' ? 'Only available for Attending guests' : 'Send confirmation email'
                }
              >
                <Mail className="w-4 h-4" />
                Send confirmation email
              </button>

              <button
                onClick={() => onDelete(guest)}
                className="bg-red-50 text-red-700 hover:bg-red-100 font-bold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete guest
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={!!isSaving}
                className="bg-wedding-gold text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
              <button
                onClick={() => { setForm(initialForm); setIsEditing(false); }}
                disabled={!!isSaving}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Ban className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestDetailsModal;

