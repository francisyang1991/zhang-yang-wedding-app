import React from 'react';
import { Comment } from '../types';
import { Lang, dict, PlanningStrings } from '../i18n';
import { renderCommentBody } from '../utils/markdown';

interface Props {
  comment: Comment;
  lang: Lang;
}

const AUTHOR_COLOR: Record<string, string> = {
  Francis: 'bg-blue-500',
  Yuwen:   'bg-pink-500',
  Manna:   'bg-emerald-500',
};

const fmtRelative = (isoTime: string, t: PlanningStrings): string => {
  const diffMs = Date.now() - new Date(isoTime).getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60)         return t.justNow;
  const min = Math.floor(sec / 60);
  if (min < 60)         return t.minutesAgo(min);
  const hr  = Math.floor(min / 60);
  if (hr < 24)          return t.hoursAgo(hr);
  const d   = Math.floor(hr / 24);
  return t.daysAgo(d);
};

const CommentItem: React.FC<Props> = ({ comment, lang }) => {
  const t = dict[lang];
  const initial = comment.author.charAt(0).toUpperCase();
  const colorClass = AUTHOR_COLOR[comment.author] ?? 'bg-gray-400';

  return (
    <div className="flex gap-2.5 py-2">
      <div className={`w-7 h-7 rounded-full ${colorClass} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-xs font-bold text-wedding-text">{comment.author}</span>
          <span className="text-[10px] text-gray-400">{fmtRelative(comment.createdAt, t)}</span>
        </div>
        <div
          className="text-sm text-gray-700 leading-relaxed break-words"
          dangerouslySetInnerHTML={{ __html: renderCommentBody(comment.body) }}
        />
      </div>
    </div>
  );
};

export default CommentItem;
