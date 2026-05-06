import React, { useEffect, useMemo, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Todo, Comment } from '../types';
import { Lang, dict } from '../i18n';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

interface Props {
  todos: Todo[];
  comments: Comment[];
  identity: string;       // display name (e.g. "Francis")
  lang: Lang;
  open: boolean;          // mobile sheet open / closed
  onClose: () => void;
  focusedTodoId: string | null;
  onSelectTodo: (todoId: string) => void;
  onSubmit: (todoId: string, body: string) => Promise<void>;
}

interface Thread {
  todo: Todo;
  comments: Comment[];
  latestAt: string;
}

const CommentSidebar: React.FC<Props> = ({
  todos, comments, identity, lang, open, onClose,
  focusedTodoId, onSelectTodo, onSubmit,
}) => {
  const t = dict[lang];

  // Build threads: every todo that has at least one comment OR is the focused todo gets a card.
  const threads: Thread[] = useMemo(() => {
    const byTodo = new Map<string, Comment[]>();
    for (const c of comments) {
      const arr = byTodo.get(c.todoId) ?? [];
      arr.push(c);
      byTodo.set(c.todoId, arr);
    }
    const list: Thread[] = [];
    for (const todo of todos) {
      const cs = byTodo.get(todo.id);
      const isFocused = focusedTodoId === todo.id;
      if (!cs && !isFocused) continue;
      const sortedCs = (cs ?? []).slice().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      list.push({
        todo,
        comments: sortedCs,
        latestAt: sortedCs.length ? sortedCs[sortedCs.length - 1].createdAt : new Date().toISOString(),
      });
    }
    return list.sort((a, b) => {
      // Focused thread first; then by recency
      if (a.todo.id === focusedTodoId) return -1;
      if (b.todo.id === focusedTodoId) return 1;
      return b.latestAt.localeCompare(a.latestAt);
    });
  }, [todos, comments, focusedTodoId]);

  // Auto-scroll the focused thread into view when it changes
  const focusedRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (focusedTodoId && focusedRef.current) {
      focusedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [focusedTodoId]);

  const containerCls = `
    bg-wedding-sand border-l border-gray-200 flex flex-col
    md:static md:w-[360px] md:h-screen md:sticky md:top-0
    fixed inset-y-0 right-0 w-[90vw] max-w-[400px] z-50 transform transition-transform
    ${open ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div onClick={onClose} className="md:hidden fixed inset-0 bg-black/30 z-40" />
      )}

      <aside className={containerCls}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-wedding-gold" />
            <h3 className="font-serif text-lg text-wedding-text">{t.comments}</h3>
            <span className="text-xs text-gray-400">({threads.length})</span>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {threads.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-12 px-4">
              <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="mb-1">{t.noCommentsYet}</p>
              <p className="text-xs opacity-70">{t.selectTodoToView}</p>
            </div>
          )}

          {threads.map((thread) => {
            const isFocused = thread.todo.id === focusedTodoId;
            return (
              <div
                key={thread.todo.id}
                ref={isFocused ? focusedRef : null}
                className={`bg-white rounded-xl border shadow-sm transition-all ${
                  isFocused ? 'border-wedding-gold ring-2 ring-wedding-gold/20' : 'border-gray-200'
                }`}
              >
                {/* Thread anchor: clicking scrolls left side to the todo */}
                <button
                  onClick={() => onSelectTodo(thread.todo.id)}
                  className="w-full text-left px-3 pt-3 pb-2 border-b border-gray-100"
                >
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">
                    {dict[lang].categories[thread.todo.category]}
                  </p>
                  <p className="text-sm font-medium text-wedding-text line-clamp-2">
                    {thread.todo.title}
                  </p>
                </button>

                {/* Comments */}
                <div className="px-3 divide-y divide-gray-100">
                  {thread.comments.length === 0 ? (
                    <p className="text-xs text-gray-400 py-3">{t.noComments}</p>
                  ) : (
                    thread.comments.map((c) => (
                      <CommentItem key={c.id} comment={c} lang={lang} />
                    ))
                  )}
                </div>

                {/* Reply input */}
                <div className="px-3 pb-3 pt-2 border-t border-gray-100">
                  <CommentInput
                    identity={identity}
                    lang={lang}
                    onSubmit={(body) => onSubmit(thread.todo.id, body)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default CommentSidebar;
