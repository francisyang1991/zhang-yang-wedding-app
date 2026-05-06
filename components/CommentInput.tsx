import React, { useRef, useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Lang, dict } from '../i18n';
import { MENTION_NAMES } from '../planningConstants';

interface Props {
  identity: string;
  lang: Lang;
  onSubmit: (body: string) => Promise<void>;
}

const CommentInput: React.FC<Props> = ({ identity, lang, onSubmit }) => {
  const t = dict[lang];
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [mentionState, setMentionState] = useState<{ open: boolean; query: string; start: number }>({
    open: false, query: '', start: 0,
  });
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Detect "@..." typing for mention picker
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setValue(next);

    const cursor = e.target.selectionStart ?? next.length;
    const upToCursor = next.slice(0, cursor);
    const match = upToCursor.match(/@([A-Za-z]*)$/);
    if (match) {
      setMentionState({ open: true, query: match[1].toLowerCase(), start: cursor - match[0].length });
    } else {
      setMentionState((s) => ({ ...s, open: false }));
    }
  };

  const insertMention = (name: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const cursor = ta.selectionStart ?? value.length;
    const before = value.slice(0, mentionState.start);
    const after  = value.slice(cursor);
    const inserted = `@${name} `;
    const next = before + inserted + after;
    setValue(next);
    setMentionState((s) => ({ ...s, open: false }));
    requestAnimationFrame(() => {
      ta.focus();
      const pos = (before + inserted).length;
      ta.setSelectionRange(pos, pos);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionState.open) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMentionState((s) => ({ ...s, open: false }));
        return;
      }
      // Enter selects first match
      if (e.key === 'Enter' && filteredNames.length > 0) {
        e.preventDefault();
        insertMention(filteredNames[0]);
        return;
      }
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  };

  const submit = async () => {
    const body = value.trim();
    if (!body || busy) return;
    setBusy(true);
    try {
      await onSubmit(body);
      setValue('');
    } finally {
      setBusy(false);
    }
  };

  const filteredNames = MENTION_NAMES.filter(
    (n) => n.toLowerCase().startsWith(mentionState.query) && n !== identity
  );

  // Reset picker when textarea loses focus
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    const onBlur = () => setTimeout(() => setMentionState((s) => ({ ...s, open: false })), 150);
    ta.addEventListener('blur', onBlur);
    return () => ta.removeEventListener('blur', onBlur);
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={taRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={t.addComment}
        rows={2}
        className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-wedding-gold"
      />

      {mentionState.open && filteredNames.length > 0 && (
        <div className="absolute z-10 left-3 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {filteredNames.map((name) => (
            <button
              key={name}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); insertMention(name); }}
              className="block w-full text-left px-3 py-1.5 text-sm hover:bg-wedding-sand"
            >
              <span className="text-wedding-gold font-bold">@{name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] text-gray-400">{t.mentionHint}</span>
        <button
          type="button"
          onClick={submit}
          disabled={!value.trim() || busy}
          className="flex items-center gap-1 px-3 py-1 bg-wedding-gold text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#b08d4a] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send className="w-3 h-3" /> {t.send}
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
