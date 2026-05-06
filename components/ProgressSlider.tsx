import React from 'react';
import { Check } from 'lucide-react';
import { Lang, dict } from '../i18n';

type Stage = 0 | 25 | 50 | 75 | 100;

interface Props {
  progress: number;
  onChange: (next: Stage) => void;
  lang: Lang;
  /** When true, render a smaller compact bar suitable for the row card. */
  compact?: boolean;
}

const STAGES: Stage[] = [0, 25, 50, 75, 100];

const stageColor = (progress: number) => {
  if (progress === 100) return 'text-emerald-600';
  if (progress >= 50)   return 'text-wedding-gold';
  if (progress > 0)     return 'text-amber-500';
  return 'text-gray-400';
};

const ProgressSlider: React.FC<Props> = ({ progress, onChange, lang, compact = false }) => {
  const t = dict[lang];
  const snappedKey = (Math.round(progress / 25) * 25) as Stage;
  const stageLabel = t.progressStages[snappedKey];
  const isDone = progress === 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    onChange((Math.round(v / 25) * 25) as Stage);
  };

  return (
    <div className={compact ? 'w-full' : 'w-full'}>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <input
            type="range"
            min={0}
            max={100}
            step={25}
            value={progress}
            onChange={handleChange}
            aria-label={t.progress}
            className={`progress-range w-full ${isDone ? 'done' : ''}`}
            style={{ ['--p' as any]: `${progress}%` }}
          />
          {!compact && (
            <div className="progress-ticks" aria-hidden>
              {STAGES.map((s) => <span key={s} />)}
            </div>
          )}
        </div>

        <div className={`shrink-0 flex items-center gap-1 text-xs font-bold ${stageColor(progress)}`}>
          {isDone && <Check className="w-3.5 h-3.5" />}
          <span className="tabular-nums">{progress}%</span>
        </div>
      </div>

      {!compact && (
        <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-400">
          {STAGES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className={`px-1 transition-colors hover:text-wedding-gold ${
                snappedKey === s ? 'text-wedding-text font-bold' : ''
              }`}
            >
              {t.progressStages[s]}
            </button>
          ))}
        </div>
      )}

      {compact && (
        <p className={`mt-1 text-[10px] uppercase tracking-wider font-bold ${stageColor(progress)}`}>
          {stageLabel}
        </p>
      )}
    </div>
  );
};

export default ProgressSlider;
