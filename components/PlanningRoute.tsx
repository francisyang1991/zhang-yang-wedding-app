import React, { useEffect, useState } from 'react';
import IdentityPicker from './IdentityPicker';
import PlanningBoard from './PlanningBoard';
import { Identity } from '../types';
import { IDENTITIES, IDENTITY_KEY } from '../planningConstants';
import { Lang, LANG_KEY, isLang } from '../i18n';

const PlanningRoute: React.FC = () => {
  const [identity, setIdentity] = useState<Identity | null>(() => {
    const stored = localStorage.getItem(IDENTITY_KEY);
    return IDENTITIES.includes(stored as Identity) ? (stored as Identity) : null;
  });

  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem(LANG_KEY);
    if (isLang(stored)) return stored;
    // Default to Chinese if browser is zh-*, else English
    return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  });

  useEffect(() => {
    document.title = lang === 'zh' ? '婚礼筹备清单' : 'Wedding Planning Board';
  }, [lang]);

  const handlePickIdentity = (id: Identity) => {
    localStorage.setItem(IDENTITY_KEY, id);
    setIdentity(id);
  };

  const handleSwitchIdentity = () => {
    localStorage.removeItem(IDENTITY_KEY);
    setIdentity(null);
  };

  const handleSetLang = (next: Lang) => {
    localStorage.setItem(LANG_KEY, next);
    setLang(next);
  };

  if (!identity) {
    return <IdentityPicker onPick={handlePickIdentity} lang={lang} onLangChange={handleSetLang} />;
  }
  return (
    <PlanningBoard
      identity={identity}
      onSwitchIdentity={handleSwitchIdentity}
      lang={lang}
      onLangChange={handleSetLang}
    />
  );
};

export default PlanningRoute;
