
import React, { useState } from 'react';
import { X, PartyPopper, Heart, Loader2, Users, UserPlus, Search, Utensils, Bed, Trash2, PlusCircle, AlertCircle } from 'lucide-react';
import { Guest, RsvpStatus } from '../types';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestList: Guest[];
  onSave: (updates: { id: string; data: Partial<Guest> }[]) => void;
}

const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose, guestList, onSave }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Name Check, 2: Form, 3: Success
  const [mode, setMode] = useState<'search' | 'register'>('search'); 
  const [searchName, setSearchName] = useState('');
  
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Form State
  const [familyMembers, setFamilyMembers] = useState<Guest[]>([]);
  const [mealMap, setMealMap] = useState<Record<string, string>>({}); 
  const [dietaryMap, setDietaryMap] = useState<Record<string, string>>({});
  
  const [rsvpStayChoice, setRsvpStayChoice] = useState<string>('');
  const [rsvpRoomView, setRsvpRoomView] = useState<string>('');
  const [rsvpBedPreference, setRsvpBedPreference] = useState<string>('');
  
  const [rsvpBookingMethod, setRsvpBookingMethod] = useState<string>('');
  const [rsvpNote, setRsvpNote] = useState<string>(''); // General/Room notes
  
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const resetModal = () => {
    setStep(1);
    setMode('search');
    setSearchName('');
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setFamilyMembers([]);
    setRsvpStayChoice('');
    setRsvpRoomView('');
    setRsvpBedPreference('');
    setMealMap({});
    setDietaryMap({});
    setErrorMessage('');
  };

  const handleNameSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setErrorMessage('');
    
    setTimeout(() => {
        const mainGuest = guestList.find(g => 
            `${g.firstName} ${g.lastName}`.toLowerCase() === searchName.toLowerCase() ||
            g.firstName.toLowerCase() === searchName.toLowerCase()
        );

        if (mainGuest) {
            const family = guestList.filter(g => 
                (g.familyId && g.familyId === mainGuest.familyId) || g.id === mainGuest.id
            );
            
            // Deduplicate
            const uniqueFamily = Array.from(new Set(family.map(g => g.id)))
                .map(id => family.find(g => g.id === id)!);

            setFamilyMembers(uniqueFamily);
            
            // Initialize Maps
            const initialMeals: Record<string, string> = {};
            const initialDietary: Record<string, string> = {};
            
            uniqueFamily.forEach(m => {
                initialMeals[m.id] = m.mealChoice || 'Wagyu & Lobster';
                initialDietary[m.id] = m.note || ''; // Assuming 'note' stored dietary info previously
            });
            setMealMap(initialMeals);
            setDietaryMap(initialDietary);

            // Load Accommodation (from first guest with data)
            const existingAcc = uniqueFamily.find(m => m.accommodation);
            if (existingAcc) {
                setRsvpStayChoice(existingAcc.accommodation || '');
                setRsvpBookingMethod(existingAcc.bookingMethod || '');
                
                // Parse Room Detail for View and Bed
                if (existingAcc.roomDetail) {
                   const details = existingAcc.roomDetail.split('|').map(s => s.trim());
                   // Heuristic: Check if detail matches known views
                   const view = details.find(d => d.includes('View') || d.includes('Standard'));
                   const bed = details.find(d => d.includes('King') || d.includes('Queen'));
                   if (view) setRsvpRoomView(view);
                   if (bed) setRsvpBedPreference(bed);
                }
            } else {
                setRsvpStayChoice('');
                setRsvpRoomView('');
                setRsvpBedPreference('');
                setRsvpBookingMethod('');
            }
            setStep(2);
        } else {
            setErrorMessage('Sorry, we couldn\'t find an invitation under that name.');
        }
        setIsSearching(false);
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
        const tempId = `new-${Date.now()}`;
        const newGuest: Guest = {
            id: tempId,
            familyId: `fam-${Date.now()}`,
            firstName: newFirstName,
            lastName: newLastName,
            email: newEmail,
            rsvpStatus: 'Pending'
        };
        setFamilyMembers([newGuest]);
        setMealMap({ [tempId]: 'Wagyu & Lobster' });
        setDietaryMap({ [tempId]: '' });
        setIsSearching(false);
        setStep(2);
    }, 600);
  };

  const handleAddGuest = () => {
    const tempId = `plusone-${Date.now()}`;
    const newGuest: Guest = {
        id: tempId,
        familyId: familyMembers[0]?.familyId || `fam-${Date.now()}`,
        firstName: '',
        lastName: '',
        rsvpStatus: 'Pending'
    };
    setFamilyMembers([...familyMembers, newGuest]);
    setMealMap(prev => ({ ...prev, [tempId]: 'Wagyu & Lobster' }));
    setDietaryMap(prev => ({ ...prev, [tempId]: '' }));
  };

  const handleRemoveGuest = (id: string) => {
    if (familyMembers.length <= 1) {
        alert("At least one guest is required.");
        return;
    }
    setFamilyMembers(prev => prev.filter(g => g.id !== id));
  };

  const handleUpdateGuest = (id: string, field: 'firstName' | 'lastName', value: string) => {
    setFamilyMembers(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const incompleteGuests = familyMembers.some(g => !g.firstName || !g.lastName);
    if (incompleteGuests) {
        alert("Please fill in names for all guests.");
        return;
    }

    const updates = familyMembers.map(member => {
        let roomDetailString = '';
        if (rsvpStayChoice === 'andaz') {
            roomDetailString = [rsvpRoomView, rsvpBedPreference].filter(Boolean).join(' | ');
        } else if (rsvpStayChoice) {
             roomDetailString = rsvpStayChoice; // Fallback for others
        }

        return {
            id: member.id,
            data: {
                firstName: member.firstName,
                lastName: member.lastName,
                email: member.email,
                familyId: member.familyId,
                rsvpStatus: 'Attending' as RsvpStatus, // Implicitly attending
                mealChoice: mealMap[member.id],
                note: dietaryMap[member.id], // Saving dietary restrictions in note field
                accommodation: rsvpStayChoice as any,
                roomDetail: roomDetailString,
                bookingMethod: rsvpBookingMethod,
            }
        };
    });
    
    // Note: rsvpNote (General/Room note) is not currently saved to a specific field in this simple schema 
    // unless we append it to the first guest's note or similar. 
    // For now, we'll append it to the first guest's note if it exists.
    if (updates.length > 0 && rsvpNote) {
        updates[0].data.note = `${updates[0].data.note ? updates[0].data.note + ' | ' : ''}General: ${rsvpNote}`;
    }

    onSave(updates);
    setStep(3);
    setTimeout(() => {
        onClose();
        setTimeout(resetModal, 500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        <button onClick={() => { onClose(); setTimeout(resetModal, 500); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <X className="w-6 h-6" />
        </button>
        <div className="overflow-y-auto p-8">
            {step === 1 && (
                <div className="animate-fade-in">
                    <h2 className="font-serif text-3xl text-center mb-2">Welcome</h2>
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-8 max-w-xs mx-auto">
                        <button onClick={() => setMode('search')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase rounded-md transition-all ${mode === 'search' ? 'bg-white shadow text-wedding-ocean' : 'text-gray-400'}`}>
                            <Search className="w-3 h-3" /> Modify Selection
                        </button>
                        <button onClick={() => setMode('register')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase rounded-md transition-all ${mode === 'register' ? 'bg-white shadow text-wedding-gold' : 'text-gray-400'}`}>
                            <UserPlus className="w-3 h-3" /> New Guest
                        </button>
                    </div>
                    {mode === 'search' ? (
                        <form onSubmit={handleNameSearch} className="space-y-6">
                            <input required type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-lg focus:outline-none focus:border-wedding-gold transition-colors text-center" placeholder="e.g. Tony Stark" />
                            {errorMessage && <p className="text-red-500 text-xs text-center mt-2">{errorMessage}</p>}
                            <button type="submit" disabled={!searchName || isSearching} className="w-full bg-wedding-text text-white font-bold py-4 rounded-lg hover:bg-black transition-colors shadow-lg flex justify-center items-center gap-2">
                                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Modify Selection"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="First Name" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded p-3 focus:outline-none" />
                                <input required placeholder="Last Name" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded p-3 focus:outline-none" />
                            </div>
                            <input required type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded p-3 focus:outline-none" />
                            <button type="submit" className="w-full bg-wedding-gold text-white font-bold py-4 rounded-lg mt-4">Continue to Details</button>
                        </form>
                    )}
                </div>
            )}
            {step === 2 && familyMembers.length > 0 && (
                <div className="animate-fade-in">
                    <div className="text-center mb-6">
                        <h2 className="font-serif text-2xl mb-1">Confirm Attendance</h2>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest">June 12, 2026 • Maui</p>
                    </div>
                    <form onSubmit={handleFinalSubmit} className="space-y-8">
                        
                        {/* 1. Who is Attending */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-wedding-gold" /> Who is attending?</h4>
                            <div className="space-y-3">
                                {familyMembers.map((member, index) => (
                                    <div key={member.id} className="flex items-center gap-2">
                                        <div className="grid grid-cols-2 gap-2 flex-1">
                                            <input 
                                                required
                                                placeholder="First Name"
                                                value={member.firstName}
                                                onChange={(e) => handleUpdateGuest(member.id, 'firstName', e.target.value)}
                                                className="bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                                            />
                                            <input 
                                                required
                                                placeholder="Last Name"
                                                value={member.lastName}
                                                onChange={(e) => handleUpdateGuest(member.id, 'lastName', e.target.value)}
                                                className="bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-wedding-gold"
                                            />
                                        </div>
                                        {familyMembers.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveGuest(member.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Remove Guest"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button 
                                type="button" 
                                onClick={handleAddGuest}
                                className="mt-4 text-xs font-bold text-wedding-ocean uppercase tracking-wider flex items-center gap-1 hover:text-wedding-gold transition-colors"
                            >
                                <PlusCircle className="w-4 h-4" /> Add Guest / Plus One
                            </button>
                        </div>

                        {/* 2. Dinner Selection */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2"><Utensils className="w-4 h-4 text-wedding-gold" /> Dinner Selection</h4>
                            <div className="space-y-6">
                                {familyMembers.map((member) => (
                                    <div key={`meal-${member.id}`} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                        <p className="font-bold text-xs text-gray-700 mb-2">{member.firstName || 'Guest'} {member.lastName}</p>
                                        <div className="space-y-2">
                                            <select 
                                                value={mealMap[member.id]} 
                                                onChange={(e) => setMealMap(prev => ({ ...prev, [member.id]: e.target.value }))} 
                                                className="w-full text-sm border-gray-200 bg-gray-50 rounded border p-2 focus:outline-none"
                                            >
                                                <option value="Wagyu & Lobster">Wagyu & Spiny Lobster</option>
                                                <option value="Mushroom Duxelle">Hamakua Mushroom (Vegan)</option>
                                                <option value="Kids Meal">Kids Meal</option>
                                            </select>
                                            <div className="relative">
                                                <AlertCircle className="absolute left-2.5 top-2.5 w-3 h-3 text-gray-400" />
                                                <input 
                                                    placeholder="Dietary Restrictions / Allergies (Optional)"
                                                    value={dietaryMap[member.id]}
                                                    onChange={(e) => setDietaryMap(prev => ({ ...prev, [member.id]: e.target.value }))}
                                                    className="w-full text-xs pl-8 pr-3 py-2 border-gray-200 bg-gray-50 rounded border focus:outline-none focus:border-wedding-gold placeholder-gray-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Accommodation */}
                        <div className="space-y-5 border-t border-gray-100 pt-6">
                            <div className="bg-white border border-wedding-gold/30 rounded-lg p-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-wedding-gold text-white text-[10px] px-2 py-0.5 font-bold uppercase">Gift</div>
                                <h4 className="font-serif font-bold text-wedding-text text-lg mb-2 flex items-center gap-2"><Heart className="w-4 h-4 text-wedding-gold fill-current" /> Stay Onsite</h4>
                                <p className="text-xs text-gray-600">We will cover <strong>1 night's stay</strong> for the 06/12 wedding day.</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Where are you staying?</label>
                                    <select required value={rsvpStayChoice} onChange={(e) => setRsvpStayChoice(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none">
                                        <option value="">Select Option...</option>
                                        <option value="andaz">Andaz Maui (Official Room Block)</option>
                                        <option value="andaz_villa">Andaz Villa (3-Bedroom)</option>
                                        <option value="ac_hotel">AC Hotel Wailea</option>
                                        <option value="self">Self Book / Other</option>
                                    </select>
                                </div>
                                
                                {rsvpStayChoice === 'andaz' && (
                                    <div className="animate-fade-in space-y-4 bg-wedding-sand/50 p-4 rounded-lg border border-wedding-gold/20">
                                        
                                        {/* Room Type Sub-Selection */}
                                        <div>
                                            <label className="block text-xs font-bold text-wedding-gold uppercase mb-1">Room View Preference</label>
                                            <select 
                                                required 
                                                value={rsvpRoomView} 
                                                onChange={(e) => setRsvpRoomView(e.target.value)} 
                                                className="w-full bg-white border border-wedding-gold/30 rounded p-2 text-sm focus:outline-none"
                                            >
                                                <option value="">Select View...</option>
                                                <option value="Standard Resort View">Standard Resort View</option>
                                                <option value="Partial Ocean View">Partial Ocean View</option>
                                                <option value="Full Ocean View">Full Ocean View</option>
                                            </select>
                                        </div>

                                        {/* Bed Preference */}
                                        <div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-wedding-gold uppercase mb-2">
                                                <Bed className="w-4 h-4" /> Bed Preference
                                            </div>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input 
                                                        type="radio" 
                                                        name="bedPref" 
                                                        value="1 King" 
                                                        checked={rsvpBedPreference === '1 King'} 
                                                        onChange={(e) => setRsvpBedPreference(e.target.value)}
                                                        className="accent-wedding-gold"
                                                    />
                                                    <span className="text-sm text-gray-700">1 King Bed</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input 
                                                        type="radio" 
                                                        name="bedPref" 
                                                        value="2 Queen" 
                                                        checked={rsvpBedPreference === '2 Queen'} 
                                                        onChange={(e) => setRsvpBedPreference(e.target.value)}
                                                        className="accent-wedding-gold"
                                                    />
                                                    <span className="text-sm text-gray-700">2 Queen Beds</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <textarea 
                                value={rsvpNote} 
                                onChange={(e) => setRsvpNote(e.target.value)} 
                                placeholder="Any general questions or room requests?" 
                                className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none h-20"
                            ></textarea>
                        </div>

                        <button type="submit" className="w-full bg-wedding-gold text-white font-bold py-3.5 rounded-lg shadow-lg hover:bg-[#b08d4a] transition-colors">Submit Group RSVP</button>
                    </form>
                </div>
            )}
            {step === 3 && (
                <div className="text-center py-10 animate-fade-in">
                    <div className="w-20 h-20 bg-wedding-gold/10 text-wedding-gold rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"><PartyPopper className="w-10 h-10" /></div>
                    <h3 className="text-xl font-bold text-gray-800">Responses Saved!</h3>
                    <p className="text-gray-500 mt-2">See you on June 12th!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RSVPModal;
