import React from 'react';
import { Heart, User, Sparkles } from 'lucide-react';
import { Identity } from '../types';
import { IDENTITIES } from '../planningConstants';
import { Lang, dict } from '../i18n';
import LangToggle from './LangToggle';

interface IdentityPickerProps {
  onPick: (identity: Identity) => void;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

const ICONS: Record<Identity, React.ReactNode> = {
  Francis: <Heart className="w-8 h-8" />,
  Yuwen:   <Sparkles className="w-8 h-8" />,
  Planner: <User className="w-8 h-8" />,
};

const IdentityPicker: React.FC<IdentityPickerProps> = ({ onPick, lang, onLangChange }) => {
  const t = dict[lang];
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-wedding-sand via-white to-rose-50 relative">
      <div className="absolute top-4 right-4 z-10">
        <LangToggle lang={lang} onChange={onLangChange} />
      </div>

      <div className="max-w-md w-full text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-wedding-gold mb-4">
          {t.planningBoard}
        </p>
        <h1 className="font-serif text-4xl text-wedding-text mb-3">{t.whoAreYou}</h1>
        <p className="text-gray-500 mb-10 text-sm">
          {t.weRemember}
        </p>

        <div className="space-y-3">
          {IDENTITIES.map((id) => (
            <button
              key={id}
              onClick={() => onPick(id)}
              className="w-full flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:border-wedding-gold hover:shadow-lg hover:shadow-wedding-gold/10 transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-wedding-sand flex items-center justify-center text-wedding-gold group-hover:bg-wedding-gold group-hover:text-white transition-colors">
                {ICONS[id]}
              </div>
              <div className="text-left flex-1">
                <p className="font-serif text-xl text-wedding-text">{t.owners[id]}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  {id === 'Planner' ? t.weddingPlanner : t.couple}
                </p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-10 text-xs text-gray-400">
          {t.switchLater}
        </p>
      </div>
    </div>
  );
};

export default IdentityPicker;
