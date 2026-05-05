import React from 'react';
import { Globe } from 'lucide-react';
import { Lang } from '../i18n';

interface Props {
  lang: Lang;
  onChange: (lang: Lang) => void;
  className?: string;
}

const LangToggle: React.FC<Props> = ({ lang, onChange, className = '' }) => {
  const next: Lang = lang === 'en' ? 'zh' : 'en';
  return (
    <button
      onClick={() => onChange(next)}
      aria-label="Toggle language"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-gray-200 shadow-sm hover:border-wedding-gold transition-colors text-xs font-bold ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-wedding-gold" />
      <span className={lang === 'en' ? 'text-wedding-text' : 'text-gray-300'}>EN</span>
      <span className="text-gray-200">/</span>
      <span className={lang === 'zh' ? 'text-wedding-text' : 'text-gray-300'}>中</span>
    </button>
  );
};

export default LangToggle;
