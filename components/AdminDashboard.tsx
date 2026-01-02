
import React, { useState, useEffect, useCallback } from 'react';
import { Guest, RsvpStatus } from '../types';
import PhotoUpload from './PhotoUpload';
import RSVPTrends from './RSVPTrends';
import StoryEditor from './StoryEditor';
import { guestService } from '../services/guestService';
import { supabase } from '../services/supabaseClient';
import { PieChart, Users, Building, AlertCircle, Search, X, Image, Settings, Loader2, TrendingUp, FileText } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer, Legend } from 'recharts';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'guests' | 'photos' | 'analytics' | 'content' | 'settings'>('guests');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [updateNotification, setUpdateNotification] = useState<string | null>(null);

  // Authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'maui2026') {
      setIsAuthenticated(true);
      // Load guests after authentication
      await loadGuests();
    } else {
      alert('Incorrect password');
    }
  };

  const loadGuests = useCallback(async () => {
    setIsLoadingGuests(true);
    try {
      const guestData = await guestService.getAllGuests();
      setGuests(guestData);
    } catch (error) {
      console.error('Error loading guests:', error);
      alert('Error loading guest data. Please try again.');
    } finally {
      setIsLoadingGuests(false);
    }
  }, []);

  // Set up real-time subscription for guest changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const subscription = supabase
      .channel('guests_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'guests'
      }, (payload) => {
        console.log('Real-time guest update:', payload);
        setLastUpdateTime(new Date());

        // Show notification based on event type
        if (payload.eventType === 'INSERT') {
          setUpdateNotification('New RSVP received! 🎉');
        } else if (payload.eventType === 'UPDATE') {
          setUpdateNotification('RSVP updated');
        }

        // Auto-hide notification after 3 seconds
        setTimeout(() => setUpdateNotification(null), 3000);

        // Reload guests when any change occurs
        loadGuests();
      })
      .subscribe((status) => {
        setIsRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, loadGuests]);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full">
           <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-gray-800">Admin Login</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
           </div>
           <form onSubmit={handleLogin} className="space-y-4">
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                 <input 
                   type="password" 
                   className="w-full border border-gray-300 rounded p-2 focus:border-wedding-gold focus:outline-none"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   autoFocus
                 />
              </div>
              <button type="submit" className="w-full bg-wedding-gold text-white font-bold py-2 rounded hover:bg-[#b08d4a]">
                 Access Dashboard
              </button>
           </form>
        </div>
      </div>
    );
  }

  // Statistics
  const totalGuests = guests.length;
  const attending = guests.filter(g => g.rsvpStatus === 'Attending').length;
  const declined = guests.filter(g => g.rsvpStatus === 'Declined').length;
  const pending = guests.filter(g => g.rsvpStatus === 'Pending').length;

  const andazCount = guests.filter(g => g.accommodation === 'andaz').length;
  const acHotelCount = guests.filter(g => g.accommodation === 'ac_hotel').length;
  const selfCount = guests.filter(g => g.accommodation === 'self').length;

  // Chart Data
  const rsvpData = [
    { name: 'Attending', value: attending, color: '#48BB78' }, // Green
    { name: 'Declined', value: declined, color: '#F56565' },   // Red
    { name: 'Pending', value: pending, color: '#A0AEC0' },     // Gray
  ];

  const accommodationData = [
    { name: 'Andaz', value: andazCount, color: '#C5A059' },    // Gold
    { name: 'AC Hotel', value: acHotelCount, color: '#2C5282' }, // Ocean
    { name: 'Self/Other', value: selfCount, color: '#ED8936' }, // Orange
  ];

  // Filtered List
  const filteredGuests = guests.filter(g => 
    g.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 overflow-auto">
       {/* Header */}
       <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <div>
                <h1 className="font-serif text-2xl text-gray-900 flex items-center gap-2">
                   Admin Dashboard
                   {isRealtimeConnected && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                         Live
                      </div>
                   )}
                </h1>
                <p className="text-xs text-gray-500">
                   Manage wedding guests, photos, and settings
                   {lastUpdateTime && (
                      <span className="ml-2 text-green-600">
                         • Last updated: {lastUpdateTime.toLocaleTimeString()}
                      </span>
                   )}
                </p>
             </div>
             <div className="flex items-center gap-2">
                {isAuthenticated && (
                   <button
                      onClick={loadGuests}
                      disabled={isLoadingGuests}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                   >
                      {isLoadingGuests ? (
                         <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                         <Users className="w-4 h-4" />
                      )}
                      Refresh
                   </button>
                )}
                <button
                   onClick={onClose}
                   className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                >
                   <X className="w-4 h-4" /> Close
                </button>
             </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1">
             <button
                onClick={() => setActiveTab('guests')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                   activeTab === 'guests'
                      ? 'bg-wedding-gold text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
             >
                <Users className="w-4 h-4" />
                Guests ({guests.length})
             </button>
             <button
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                   activeTab === 'photos'
                      ? 'bg-wedding-gold text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
             >
                <Image className="w-4 h-4" />
                Photos
             </button>
             <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                   activeTab === 'analytics'
                      ? 'bg-wedding-gold text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
             >
                <TrendingUp className="w-4 h-4" />
                Analytics
             </button>
             <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                   activeTab === 'content'
                      ? 'bg-wedding-gold text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
             >
                <FileText className="w-4 h-4" />
                Content
             </button>
             <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                   activeTab === 'settings'
                      ? 'bg-wedding-gold text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
             >
                <Settings className="w-4 h-4" />
                Settings
             </button>
          </div>
       </div>

       <div className="max-w-7xl mx-auto p-6">
          {/* Update Notification */}
          {updateNotification && (
             <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                   <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                   {updateNotification}
                </p>
             </div>
          )}

          {activeTab === 'guests' && (
             <div className="space-y-8">
                {isLoadingGuests && (
                   <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                         <Loader2 className="w-8 h-8 animate-spin text-wedding-gold mx-auto mb-4" />
                         <p className="text-gray-600">Loading guest data...</p>
                      </div>
                   </div>
                )}

                {!isLoadingGuests && (
                <>
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-gray-400 uppercase">Total Invitees</p>
                   <p className="text-3xl font-serif text-gray-800">{totalGuests}</p>
                </div>
                <Users className="w-8 h-8 text-gray-200" />
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-green-600 uppercase">Confirmed Yes</p>
                   <p className="text-3xl font-serif text-gray-800">{attending}</p>
                </div>
                <div className="h-2 w-20 bg-gray-100 rounded-full overflow-hidden mt-2">
                   <div className="h-full bg-green-500" style={{ width: `${(attending/totalGuests)*100}%` }}></div>
                </div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-gray-400 uppercase">Pending</p>
                   <p className="text-3xl font-serif text-gray-800">{pending}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-gray-200" />
             </div>
             <div className="bg-white p-4 rounded-xl border border-wedding-gold/30 bg-wedding-gold/5 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-wedding-gold uppercase">Andaz Rooms</p>
                   <p className="text-3xl font-serif text-gray-800">{andazCount}</p>
                </div>
                <Building className="w-8 h-8 text-wedding-gold/50" />
             </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                   <PieChart className="w-4 h-4" /> RSVP Status
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                   <RePieChart>
                      <Pie
                        data={rsvpData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {rsvpData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ReTooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                   </RePieChart>
                </ResponsiveContainer>
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                   <Building className="w-4 h-4" /> Accommodation Breakdown
                </h3>
                 {attending > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                       <RePieChart>
                          <Pie
                            data={accommodationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {accommodationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ReTooltip />
                          <Legend verticalAlign="bottom" height={36}/>
                       </RePieChart>
                    </ResponsiveContainer>
                 ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">No data yet</div>
                 )}
             </div>
          </div>

          {/* Guest List Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-lg text-gray-800">Guest List</h3>
                <div className="relative w-full md:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="Search guests..." 
                     className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wedding-gold"
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                   />
                </div>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                      <tr>
                         <th className="px-6 py-4">Name</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4">Accommodation</th>
                         <th className="px-6 py-4">Booking Method</th>
                         <th className="px-6 py-4">Notes</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {filteredGuests.map((guest) => (
                         <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">
                               {guest.firstName} {guest.lastName}
                               <div className="text-[10px] text-gray-400 font-normal">{guest.email}</div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  guest.rsvpStatus === 'Attending' ? 'bg-green-100 text-green-700' :
                                  guest.rsvpStatus === 'Declined' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-600'
                               }`}>
                                  {guest.rsvpStatus}
                               </span>
                            </td>
                            <td className="px-6 py-4">
                               {guest.accommodation === 'andaz' && <span className="text-wedding-gold font-bold">Andaz</span>}
                               {guest.accommodation === 'ac_hotel' && <span className="text-wedding-ocean font-bold">AC Hotel</span>}
                               {guest.accommodation === 'self' && <span className="text-gray-500">Self Booked</span>}
                               {!guest.accommodation && <span className="text-gray-300">-</span>}
                               {guest.roomDetail && <div className="text-[10px] text-gray-500">{guest.roomDetail.replace('_', ' ')}</div>}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                               {guest.bookingMethod ? guest.bookingMethod.replace('_', ' ') : '-'}
                            </td>
                            <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                               {guest.note || '-'}
                            </td>
                         </tr>
                      ))}
                      {filteredGuests.length === 0 && (
                         <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No guests found matching your search.</td>
                         </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
                  </>
                )}
             </div>
          )}

          {activeTab === 'photos' && (
             <div className="space-y-8">
                {/* Photo Management */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                   <div className="mb-6">
                      <h2 className="font-serif text-xl text-gray-900 mb-2">Photo Management</h2>
                      <p className="text-sm text-gray-600">Upload and manage photos for your wedding website</p>
                   </div>

                   {/* Couple Photos Section */}
                   <div className="mb-8">
                      <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                         <Image className="w-4 h-4" />
                         Couple Profile Photos
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                         Upload photos of you and your partner. Mark one as "featured" to display in the hero section.
                      </p>
                      <PhotoUpload
                         category="couple"
                         maxFiles={5}
                         onPhotoUploaded={(photo) => {
                            console.log('Photo uploaded:', photo);
                            // Could add toast notification here
                         }}
                         onPhotoDeleted={(photoId) => {
                            console.log('Photo deleted:', photoId);
                            // Could refresh couple photo in main app here
                         }}
                      />
                   </div>

                   {/* Hero Photos Section */}
                   <div className="mb-8">
                      <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                         <Image className="w-4 h-4" />
                         Hero Background Photos
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                         Upload high-quality photos for the hero section slideshow background.
                      </p>
                      <PhotoUpload
                         category="hero"
                         maxFiles={10}
                         onPhotoUploaded={(photo) => {
                            console.log('Hero photo uploaded:', photo);
                         }}
                         onPhotoDeleted={(photoId) => {
                            console.log('Hero photo deleted:', photoId);
                         }}
                      />
                   </div>

                   {/* Story Photos Section */}
                   <div>
                      <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                         <Image className="w-4 h-4" />
                         Our Story Photos
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                         Photos for your love story timeline and gallery.
                      </p>
                      <PhotoUpload
                         category="story"
                         maxFiles={20}
                         onPhotoUploaded={(photo) => {
                            console.log('Story photo uploaded:', photo);
                         }}
                         onPhotoDeleted={(photoId) => {
                            console.log('Story photo deleted:', photoId);
                         }}
                      />
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'analytics' && (
             <div className="space-y-8">
                {/* RSVP Trends & Analytics */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                   <div className="mb-6">
                      <h2 className="font-serif text-xl text-gray-900 mb-2">RSVP Trends & Analytics</h2>
                      <p className="text-sm text-gray-600">Track response rates, accommodation preferences, and RSVP patterns over time</p>
                   </div>
                   <RSVPTrends />
                </div>
             </div>
          )}

          {activeTab === 'content' && (
             <div className="space-y-8">
                {/* Story Content Management */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                   <div className="mb-6">
                      <h2 className="font-serif text-xl text-gray-900 mb-2">Content Management</h2>
                      <p className="text-sm text-gray-600">Create and manage your wedding story content with draft/publish workflow</p>
                   </div>
                   <StoryEditor
                      onContentChange={() => {
                         console.log('Story content updated');
                         // Could trigger a refresh of published content elsewhere
                      }}
                   />
                </div>
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="space-y-8">
                {/* Settings */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                   <h2 className="font-serif text-xl text-gray-900 mb-6">Settings</h2>
                   <div className="space-y-6">
                      <div>
                         <h3 className="font-bold text-gray-700 mb-2">Coming Soon</h3>
                         <p className="text-sm text-gray-600">
                            Settings panel for wedding details, admin passwords, and app configuration will be available here.
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

export default AdminDashboard;
