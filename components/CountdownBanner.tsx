import React, { useEffect, useState } from 'react';
import { Heart, MapPin } from 'lucide-react';
import { WEDDING_DATE } from '../planningConstants';
import { Lang, dict } from '../i18n';

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

const computeParts = (target: Date): Parts => {
  const diffMs = target.getTime() - Date.now();
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const totalSec = Math.floor(diffMs / 1000);
  const days    = Math.floor(totalSec / 86400);
  const hours   = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds, isPast: false };
};

const Cell: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[68px] md:min-w-[96px] shadow-lg">
      <div className="font-serif text-3xl md:text-5xl font-bold text-white tabular-nums leading-none">
        {String(value).padStart(2, '0')}
      </div>
    </div>
    <div className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 mt-2 font-bold">
      {label}
    </div>
  </div>
);

interface Props {
  lang: Lang;
}

const CountdownBanner: React.FC<Props> = ({ lang }) => {
  const t = dict[lang];
  const [parts, setParts] = useState<Parts>(() => computeParts(WEDDING_DATE));

  useEffect(() => {
    const interval = setInterval(() => setParts(computeParts(WEDDING_DATE)), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#9A6B3D] via-wedding-gold to-[#D9B872] shadow-2xl shadow-wedding-gold/30">
      {/* Decorative blurred orbs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl" />

      <div className="relative px-6 py-8 md:px-10 md:py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-white" />
          <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-white/90">
            {t.countingDown}
          </p>
          <Heart className="w-4 h-4 text-white" />
        </div>

        <h2 className="font-script text-5xl md:text-7xl text-white mb-1 leading-none drop-shadow-md">
          Xiaodong &amp; Yuwen
        </h2>

        <div className="flex items-center justify-center gap-2 text-white/90 text-xs md:text-sm font-light tracking-wide mb-8">
          <span>{t.weddingDate}</span>
          <span className="opacity-50">·</span>
          <MapPin className="w-3 h-3" />
          <span>{t.weddingLocation}</span>
        </div>

        {parts.isPast ? (
          <p className="font-serif text-2xl md:text-4xl text-white">
            {t.youDidIt}
          </p>
        ) : (
          <div className="flex justify-center gap-2 md:gap-4">
            <Cell value={parts.days}    label={t.daysLabel} />
            <Cell value={parts.hours}   label={t.hoursLabel} />
            <Cell value={parts.minutes} label={t.minutesLabel} />
            <Cell value={parts.seconds} label={t.secondsLabel} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownBanner;
