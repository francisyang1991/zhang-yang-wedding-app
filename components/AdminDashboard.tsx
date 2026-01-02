
import React, { useState } from 'react';
import { Guest, RsvpStatus } from '../types';
import { PieChart, Users, Building, AlertCircle, Search, X } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer, Legend } from 'recharts';

interface AdminDashboardProps {
  guests: Guest[];
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ guests, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'maui2026') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

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
       <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
          <div>
             <h1 className="font-serif text-2xl text-gray-900">Guest Management</h1>
             <p className="text-xs text-gray-500">Overview of RSVPs and Room Block Usage</p>
          </div>
          <button 
             onClick={onClose}
             className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
          >
             <X className="w-4 h-4" /> Close
          </button>
       </div>

       <div className="max-w-7xl mx-auto p-6 space-y-8">
          
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

       </div>
    </div>
  );
};

export default AdminDashboard;
