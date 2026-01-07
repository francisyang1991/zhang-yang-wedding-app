
import React, { useState, useEffect } from 'react';
import { X, PartyPopper, Heart, Loader2, Users, UserPlus, Search, Utensils, Bed, Trash2, PlusCircle, AlertCircle, Phone, Mail } from 'lucide-react';
import { Guest, RsvpStatus } from '../types';
import { guestService } from '../services/guestService';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestList: Guest[];
  onSave: (updates: { id: string; data: Partial<Guest> }[]) => void;
}

interface ExtendedGuest extends Guest {
    isPlusOne?: boolean;
}

const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose, guestList, onSave }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Name Check, 2: Form, 3: Success
  const [mode, setMode] = useState<'search' | 'register'>('register'); 
  const [searchName, setSearchName] = useState('');
  
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Form State
  const [familyMembers, setFamilyMembers] = useState<ExtendedGuest[]>([]);
  const [mealMap, setMealMap] = useState<Record<string, string>>({});
  const [dietaryMap, setDietaryMap] = useState<Record<string, string>>({});
  const [phoneMap, setPhoneMap] = useState<Record<string, string>>({});
  const [emailMap, setEmailMap] = useState<Record<string, string>>({});
  
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
    setMode('register');
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
    setPhoneMap({});
    setEmailMap({});
    setErrorMessage('');
  };

  const handleNameSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setErrorMessage('');

    try {
      // Fetch all guests from Supabase
      const allGuests = await guestService.getAllGuests();

      const mainGuest = allGuests.find(g =>
        `${g.firstName} ${g.lastName}`.toLowerCase() === searchName.toLowerCase() ||
        g.firstName.toLowerCase() === searchName.toLowerCase() ||
        g.email?.toLowerCase() === searchName.toLowerCase()
      );

      if (mainGuest) {
        const family = allGuests.filter(g =>
          (g.familyId && g.familyId === mainGuest.familyId) || g.id === mainGuest.id
        );

        // Deduplicate
        const uniqueFamily = Array.from(new Set(family.map(g => g.id)))
          .map(id => family.find(g => g.id === id)!);

        setFamilyMembers(uniqueFamily);

        // Initialize Maps with enhanced fields
        const initialMeals: Record<string, string> = {};
        const initialDietary: Record<string, string> = {};
        const initialPhones: Record<string, string> = {};
        const initialEmails: Record<string, string> = {};

        const VALID_MEALS = ['Wagyu & Lobster', 'Special Dietary'];

        uniqueFamily.forEach(m => {
          let meal = m.mealChoice || 'Wagyu & Lobster';
          if (!VALID_MEALS.includes(meal) && meal !== 'Kids Meal' && meal !== 'Mushroom Duxelle') {
             // If unknown meal, default to Wagyu
             meal = 'Wagyu & Lobster';
          } 
          // Map legacy options to new ones if needed, or just keep them as is if we want to preserve history.
          // The requirement said "ensure invalid meal choices default to valid options".
          if (meal === 'Kids Meal' || meal === 'Mushroom Duxelle') {
             meal = 'Special Dietary';
          }
          
          initialMeals[m.id] = meal;
          initialDietary[m.id] = m.note || ''; // Using note for dietary initially, will enhance later
          initialPhones[m.id] = ''; // Will be populated from database in future
          initialEmails[m.id] = m.email || '';
          
          // Check for existing Plus One data
          if (m.plusOne && m.plusOneName) {
            // Note: Currently we don't visualize existing Plus Ones as separate editable rows in this simplified logic,
            // or we could split them here.
            // For now, let's keep it simple: If they have a plus one, maybe we should indicate it?
            // The user request is about ADDING a plus one not creating a new row.
          }
        });
        setMealMap(initialMeals);
        setDietaryMap(initialDietary);
        setPhoneMap(initialPhones);
        setEmailMap(initialEmails);

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
        setErrorMessage('Sorry, we couldn\'t find an invitation under that name. Please check your invitation for the correct spelling.');
      }
    } catch (error) {
      console.error('Error searching for guest:', error);
      setErrorMessage('Sorry, there was an error searching for your invitation. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setErrorMessage('');

    try {
      // Create new guest in Supabase
      const newGuestData = {
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        rsvpStatus: 'Pending' as RsvpStatus,
        familyId: crypto.randomUUID()
      };

      const createdGuest = await guestService.createGuest(newGuestData);

      setFamilyMembers([createdGuest]);
      setMealMap({ [createdGuest.id]: 'Wagyu & Lobster' });
      setDietaryMap({ [createdGuest.id]: '' });
      setPhoneMap({ [createdGuest.id]: '' });
      setEmailMap({ [createdGuest.id]: newEmail });
      setStep(2);
    } catch (error) {
      console.error('Error registering new guest:', error);
      setErrorMessage('Sorry, there was an error creating your invitation. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddGuest = () => {
    // Limit: Only 1 Plus One per group for now to simplify linkage
    const existingPlusOne = familyMembers.find(m => m.isPlusOne);
    if (existingPlusOne) {
        alert("We can only accommodate one Plus One per group due to venue capacity. Please contact us if you have questions!");
        return;
    }

    // Generate a temporary UUID for the new guest UI purposes
    const tempId = crypto.randomUUID();
    const newGuest: ExtendedGuest = {
        id: tempId,
        familyId: familyMembers[0]?.familyId || crypto.randomUUID(),
        firstName: '',
        lastName: '',
        rsvpStatus: 'Pending',
        isPlusOne: true // Mark as a Plus One to be merged
    };
    setFamilyMembers([...familyMembers, newGuest]);
    setMealMap(prev => ({ ...prev, [tempId]: 'Wagyu & Lobster' }));
    setDietaryMap(prev => ({ ...prev, [tempId]: '' }));
    setEmailMap(prev => ({ ...prev, [tempId]: '' })); 
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

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const incompleteGuests = familyMembers.some(g => !g.firstName || !g.lastName);
    if (incompleteGuests) {
        alert("Please fill in names for all guests.");
        return;
    }

    setIsSearching(true);
    setErrorMessage('');

    try {
      // Separate real guests from Plus Ones
      const realGuests = familyMembers.filter(m => !m.isPlusOne);
      const plusOnes = familyMembers.filter(m => m.isPlusOne);

      // Prepare updates for Supabase
      const updates = realGuests.map(member => {
        let roomDetailString = '';
        if (rsvpStayChoice === 'andaz') {
          roomDetailString = [rsvpRoomView, rsvpBedPreference].filter(Boolean).join(' | ');
        } else if (rsvpStayChoice) {
          roomDetailString = rsvpStayChoice; // Fallback for others
        }

        const data: Partial<Guest> = {
            firstName: member.firstName,
            lastName: member.lastName,
            email: emailMap[member.id] || member.email,
            familyId: member.familyId,
            rsvpStatus: 'Attending' as RsvpStatus, // Implicitly attending
            mealChoice: mealMap[member.id],
            note: dietaryMap[member.id], // Saving dietary restrictions in note field
            accommodation: rsvpStayChoice as any,
            roomDetail: roomDetailString,
            bookingMethod: rsvpBookingMethod,
        };

        // If there is a Plus One, attach it to the FIRST real guest (usually the inviter)
        if (plusOnes.length > 0 && member.id === realGuests[0].id) {
            const po = plusOnes[0];
            data.plusOne = true;
            data.plusOneName = `${po.firstName} ${po.lastName}`;
            // Append Plus One meal/dietary to note since schema doesn't support separate columns
            const poMeal = mealMap[po.id];
            const poDiet = dietaryMap[po.id];
            
            const existingNote = data.note || '';
            const poNote = `[+1 Meal: ${poMeal}]${poDiet ? ` [+1 Diet: ${poDiet}]` : ''}`;
            data.note = existingNote ? `${existingNote} | ${poNote}` : poNote;
        }

        return {
          id: member.id,
          data: data
        };
      });

      // Append general note if provided
      if (updates.length > 0 && rsvpNote) {
        const currentNote = updates[0].data.note || '';
        updates[0].data.note = currentNote ? `${currentNote} | General: ${rsvpNote}` : `General: ${rsvpNote}`;
      }

      // Notify parent component to handle all persistence and state updates
      // Parent will save to Supabase, update local state, and show notifications
      await onSave(updates);

      setStep(3);
      setTimeout(() => {
        onClose();
        setTimeout(resetModal, 500);
      }, 2500);

    } catch (error) {
      console.error('Error saving RSVP:', error);
      setErrorMessage('Sorry, there was an error saving your RSVP. Please try again.');
    } finally {
      setIsSearching(false);
    }
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
                                                <option value="Special Dietary">Special Dietary (Fill in below)</option>
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
                                <p className="text-xs text-gray-600">We will cover <strong>1 night's stay</strong> for the 06/12 wedding day only with Room Block Booking.</p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-2">
                                <p className="font-bold text-gray-800 flex items-center gap-1"><AlertCircle className="w-3 h-3 text-wedding-ocean" /> Booking Instructions:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li><strong>Standard Room:</strong> We are collecting preferences now. A booking link will be shared later. You can use any credit card to book and pay.</li>
                                    <li><strong>Villa:</strong> We are collecting preferences now. We will coordinate and book the villa for you.</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Where are you staying?</label>
                                    <select required value={rsvpStayChoice} onChange={(e) => setRsvpStayChoice(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none">
                                        <option value="">Select Option...</option>
                                        <option value="andaz">Andaz Maui (Official Room Block)</option>
                                        <option value="andaz_villa">Andaz Villa ((Official Room Block))</option>
                                        <option value="ac_hotel">AC Hotel Wailea</option>
                                        <option value="self">Self Book/ Other/ Airbnb/Points Redeem</option>
                                    </select>
                                </div>
                                
                                {rsvpStayChoice && rsvpStayChoice !== 'andaz_villa' && (
                                    <div className="animate-fade-in space-y-4 bg-wedding-sand/50 p-4 rounded-lg border border-wedding-gold/20">
                                        
                                        {rsvpStayChoice === 'andaz' && (
                                            <>
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
                                            </>
                                        )}

                                        {/* Booking Method / Duration */}
                                        <div>
                                            <label className="block text-xs font-bold text-wedding-gold uppercase mb-1">Stay Duration</label>
                                            <select 
                                                required 
                                                value={rsvpBookingMethod} 
                                                onChange={(e) => setRsvpBookingMethod(e.target.value)} 
                                                className="w-full bg-white border border-wedding-gold/30 rounded p-2 text-sm focus:outline-none"
                                            >
                                                <option value="">Select Duration...</option>
                                                <option value="2 Nights">2 Nights</option>
                                                <option value="3 Nights">3 Nights (Recommended)</option>
                                                <option value="More than 3 Nights">More than 3 Nights</option>
                                            </select>
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
