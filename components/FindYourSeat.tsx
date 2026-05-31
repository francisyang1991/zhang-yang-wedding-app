import React, { useState } from 'react';
import { Search, MapPin, Users, CalendarClock } from 'lucide-react';
import { SEATING, findSeat, isSeatingLive, SEATING_REVEAL_ISO, SeatMatch } from '../seatingData';

const FindYourSeat: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [matches, setMatches] = useState<SeatMatch[]>([]);
  const live = isSeatingLive();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setMatches(findSeat(query));
    setSearched(true);
  };

  // ── Locked state: before the reveal date ──────────────────────────────
  if (!live) {
    const revealDate = new Date(SEATING_REVEAL_ISO).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', timeZone: 'Pacific/Honolulu',
    });
    return (
      <section id="seating" className="py-20 bg-wedding-sand/30 scroll-mt-24 border-b border-gray-100">
        <div className="max-w-xl mx-auto px-6 text-center">
          <CalendarClock className="w-7 h-7 text-wedding-gold mx-auto mb-4" />
          <h2 className="font-serif text-3xl md:text-4xl text-wedding-text mb-3">Find Your Seat</h2>
          <p className="text-gray-500 leading-relaxed">
            Seating opens on <strong className="text-wedding-gold">{revealDate}</strong>. Check back soon to find your table!
            <br />
            <span className="text-sm">座位安排将于 <strong className="text-wedding-gold">6 月 10 日</strong> 公开，到时回来查询你的桌号 🌺</span>
          </p>
        </div>
      </section>
    );
  }

  // ── Live state: searchable ────────────────────────────────────────────
  return (
    <section id="seating" className="py-20 bg-wedding-sand/30 scroll-mt-24 border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <MapPin className="w-6 h-6 text-wedding-gold mx-auto mb-4" />
          <h2 className="font-serif text-3xl md:text-4xl text-wedding-text mb-3">Find Your Seat</h2>
          <p className="text-gray-500">Type your name to find your table · 输入你的名字查询桌号</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Yuwen / Francis / your name…"
            className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:border-wedding-gold focus:outline-none text-gray-700"
          />
          <button
            type="submit"
            className="bg-wedding-gold text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Search className="w-4 h-4" /> Find
          </button>
        </form>

        {searched && matches.length === 0 && (
          <div className="text-center text-gray-500 bg-white rounded-2xl p-8 border border-gray-100">
            <p>No match found. Try your first name, or check spelling.</p>
            <p className="text-sm mt-1">没找到 —— 试试只输名字，或换个拼写 🙏</p>
          </div>
        )}

        {matches.map(({ table, guest }, i) => {
          const tablemates = table.seats.filter((s) => s.name !== guest.name);
          return (
            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm mb-5">
              <p className="text-gray-400 text-sm mb-1">Hi {guest.name.split(' ')[0]}, you're seated at</p>
              <h3 className="font-serif text-3xl text-wedding-text mb-1">{table.label}</h3>
              <p className="text-wedding-gold font-bold text-sm mb-5">{table.theme}</p>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                <Users className="w-4 h-4" /> Your Table
              </div>
              <div className="flex flex-wrap gap-2">
                {table.seats.map((s, j) => (
                  <span
                    key={j}
                    className={`text-sm px-3 py-1.5 rounded-full border ${
                      s.name === guest.name
                        ? 'bg-wedding-gold/15 border-wedding-gold/40 text-wedding-text font-bold'
                        : 'bg-gray-50 border-gray-100 text-gray-600'
                    }`}
                  >
                    {s.name}{s.note ? ` · ${s.note}` : ''}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        {!searched && (
          <p className="text-center text-gray-300 text-xs mt-4">
            {SEATING.length} tables · {SEATING.reduce((n, t) => n + t.seats.length, 0)} guests
          </p>
        )}
      </div>
    </section>
  );
};

export default FindYourSeat;
