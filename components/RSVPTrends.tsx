import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { guestService } from '../services/guestService';
import { TrendingUp, Users, Clock, Calendar } from 'lucide-react';

interface RSVPTrendsProps {
  className?: string;
}

const RSVPTrends: React.FC<RSVPTrendsProps> = ({ className = '' }) => {
  const [trendsData, setTrendsData] = useState<any[]>([]);
  const [accommodationData, setAccommodationData] = useState<any[]>([]);
  const [responseAnalytics, setResponseAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [trends, accommodation, response] = await Promise.all([
          guestService.getRsvpTrends(30),
          guestService.getAccommodationAnalytics(),
          guestService.getResponseRateAnalytics()
        ]);

        // Format trends data for chart
        const formattedTrends = trends.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          attending: item.attending,
          declined: item.declined,
          pending: item.pending,
          total: item.attending + item.declined + item.pending
        }));

        // Format accommodation data for pie chart
        const formattedAccommodation = [
          { name: 'Andaz Resort', value: accommodation.andaz, color: '#C5A059' },
          { name: 'AC Hotel', value: accommodation.ac_hotel, color: '#2C5282' },
          { name: 'Self Booked', value: accommodation.self, color: '#ED8936' },
          { name: 'Not Specified', value: accommodation.unknown, color: '#A0AEC0' },
        ].filter(item => item.value > 0);

        setTrendsData(formattedTrends);
        setAccommodationData(formattedAccommodation);
        setResponseAnalytics(response);

      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics Cards */}
      {responseAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase">Response Rate</p>
                <p className="text-2xl font-serif text-gray-800">{responseAnalytics.responseRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">{responseAnalytics.responses}/{responseAnalytics.totalInvitations} responded</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-wedding-gold/10 rounded-lg">
                <Calendar className="w-5 h-5 text-wedding-gold" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase">Attending</p>
                <p className="text-2xl font-serif text-gray-800">{responseAnalytics.attending}</p>
                <p className="text-xs text-gray-500">{responseAnalytics.attendanceRate.toFixed(1)}% of invites</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase">Avg Response</p>
                <p className="text-2xl font-serif text-gray-800">{responseAnalytics.avgResponseTimeDays}</p>
                <p className="text-xs text-gray-500">days after invite</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase">Total RSVPs</p>
                <p className="text-2xl font-serif text-gray-800">{responseAnalytics.totalInvitations}</p>
                <p className="text-xs text-gray-500">invitations sent</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Trends Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-serif text-lg text-gray-900 mb-4">RSVP Trends (Last 30 Days)</h3>
        <div className="h-80">
          {trendsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="attending"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Attending"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#6b7280"
                  strokeWidth={2}
                  name="Pending"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>No RSVP data available for the last 30 days</p>
            </div>
          )}
        </div>
      </div>

      {/* Accommodation Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-serif text-lg text-gray-900 mb-4">Accommodation Preferences</h3>
          <div className="h-64">
            {accommodationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accommodationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {accommodationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>No accommodation data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Response Timeline */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-serif text-lg text-gray-900 mb-4">Response Timeline</h3>
          <div className="space-y-4">
            {trendsData.slice(-7).map((day, index) => (
              <div key={day.date} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-wedding-gold/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-wedding-gold">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-700">{day.date}</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-green-600 font-medium">+{day.attending}</span>
                  <span className="text-gray-400">+{day.pending}</span>
                </div>
              </div>
            ))}
            {trendsData.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No recent RSVP activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSVPTrends;