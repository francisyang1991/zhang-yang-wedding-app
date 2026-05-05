import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Plus, Check, Trash2, Calendar as CalendarIcon, AlertCircle, Clock, ChevronDown, ChevronRight,
  Users, RefreshCw, Filter, X
} from 'lucide-react';
import { Todo, TodoCategory, TodoOwner, Identity } from '../types';
import { todoService } from '../services/todoService';
import { TODO_CATEGORIES, TODO_OWNERS, CATEGORY_ACCENT } from '../planningConstants';
import { Lang, dict, PlanningStrings } from '../i18n';
import CountdownBanner from './CountdownBanner';
import LangToggle from './LangToggle';

interface Props {
  identity: Identity;
  onSwitchIdentity: () => void;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

type StatusFilter = 'all' | 'open' | 'done';

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const fmtRelative = (
  dueDate: string | undefined,
  t: PlanningStrings,
  lang: Lang
): { label: string; tone: 'overdue' | 'soon' | 'normal' | 'none' } => {
  if (!dueDate) return { label: t.noDueDate, tone: 'none' };
  const due = new Date(dueDate + 'T00:00:00');
  const diffDays = Math.round((due.getTime() - today().getTime()) / 86400000);
  if (diffDays < 0)   return { label: t.dueOverdue(Math.abs(diffDays)), tone: 'overdue' };
  if (diffDays === 0) return { label: t.dueToday, tone: 'overdue' };
  if (diffDays === 1) return { label: t.dueTomorrow, tone: 'soon' };
  if (diffDays <= 7)  return { label: t.dueInDays(diffDays), tone: 'soon' };
  const dateLabel = due.toLocaleDateString(lang === 'zh' ? 'zh-CN' : undefined, { month: 'short', day: 'numeric' });
  return { label: t.dueOn(dateLabel), tone: 'normal' };
};

const TONE_CLASSES: Record<string, string> = {
  overdue: 'bg-red-100 text-red-700',
  soon:    'bg-amber-100 text-amber-700',
  normal:  'bg-gray-100 text-gray-600',
  none:    'bg-gray-50 text-gray-400',
};

const OWNER_BADGE: Record<TodoOwner, string> = {
  Francis:    'bg-blue-100 text-blue-700',
  Yuwen:      'bg-pink-100 text-pink-700',
  Both:       'bg-violet-100 text-violet-700',
  Planner:    'bg-emerald-100 text-emerald-700',
  Unassigned: 'bg-gray-100 text-gray-500',
};

const PlanningBoard: React.FC<Props> = ({ identity, onSwitchIdentity, lang, onLangChange }) => {
  const t = dict[lang];

  const [todos, setTodos]       = useState<Todo[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [expandedId, setExpanded] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<TodoCategory>>(new Set());

  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('open');
  const [categoryFilter, setCategoryFilter] = useState<TodoCategory | 'all'>('all');
  const [ownerFilter, setOwnerFilter]       = useState<TodoOwner | 'all'>('all');

  // New todo form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle]       = useState('');
  const [newCategory, setNewCategory] = useState<TodoCategory>('Other');
  const [newOwner, setNewOwner]       = useState<TodoOwner>('Both');
  const [newDueDate, setNewDueDate]   = useState('');

  const reload = useCallback(async () => {
    try {
      setError(null);
      const data = await todoService.getAll();
      setTodos(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    const unsubscribe = todoService.subscribe(() => reload());
    return unsubscribe;
  }, [reload]);

  // ---- Mutations (with optimistic UI) -------------------------------------

  const handleToggleDone = async (todo: Todo) => {
    const next = !todo.done;
    setTodos((prev) => prev.map((tt) => tt.id === todo.id ? {
      ...tt, done: next, doneBy: next ? identity : undefined, doneAt: next ? new Date().toISOString() : undefined,
      inProgress: next ? false : tt.inProgress,
    } : tt));
    try {
      await todoService.toggleDone(todo.id, next, identity);
    } catch (e) { reload(); }
  };

  const handleToggleInProgress = async (todo: Todo) => {
    const next = !todo.inProgress;
    setTodos((prev) => prev.map((tt) => tt.id === todo.id ? { ...tt, inProgress: next } : tt));
    try {
      await todoService.update(todo.id, { inProgress: next });
    } catch (e) { reload(); }
  };

  const handleEdit = async (id: string, patch: Partial<Todo>) => {
    setTodos((prev) => prev.map((tt) => tt.id === id ? { ...tt, ...patch } : tt));
    try {
      await todoService.update(id, patch);
    } catch (e) { reload(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.deleteConfirm)) return;
    const prev = todos;
    setTodos((curr) => curr.filter((tt) => tt.id !== id));
    try {
      await todoService.remove(id);
    } catch (e) {
      setTodos(prev);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await todoService.create({
        title: newTitle.trim(),
        category: newCategory,
        owner: newOwner,
        dueDate: newDueDate || undefined,
        createdBy: identity,
      });
      setNewTitle(''); setNewDueDate(''); setShowAddForm(false);
    } catch (e: any) {
      alert(e?.message ?? 'Failed to add todo');
    }
  };

  // ---- Derived ------------------------------------------------------------

  const filtered = useMemo(() => {
    return todos.filter((tt) => {
      if (statusFilter === 'open' && tt.done) return false;
      if (statusFilter === 'done' && !tt.done) return false;
      if (categoryFilter !== 'all' && tt.category !== categoryFilter) return false;
      if (ownerFilter !== 'all' && tt.owner !== ownerFilter) return false;
      return true;
    });
  }, [todos, statusFilter, categoryFilter, ownerFilter]);

  const grouped = useMemo(() => {
    const map = new Map<TodoCategory, Todo[]>();
    for (const cat of TODO_CATEGORIES) map.set(cat, []);
    for (const tt of filtered) map.get(tt.category)?.push(tt);
    return [...map.entries()].filter(([, list]) => list.length > 0);
  }, [filtered]);

  const stats = useMemo(() => {
    const open = todos.filter((tt) => !tt.done);
    const overdue = open.filter((tt) => tt.dueDate && new Date(tt.dueDate + 'T00:00:00') < today()).length;
    return { total: todos.length, done: todos.filter((tt) => tt.done).length, open: open.length, overdue };
  }, [todos]);

  const toggleCategory = (cat: TodoCategory) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const statusLabel: Record<StatusFilter, string> = {
    all:  t.filterAll,
    open: t.filterOpen,
    done: t.filterDone,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wedding-sand to-white pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* ------------------- TOP BAR (lang toggle) ------------------- */}
        <div className="flex justify-end mb-4">
          <LangToggle lang={lang} onChange={onLangChange} />
        </div>

        {/* ------------------- COUNTDOWN BANNER ------------------- */}
        <div className="mb-8">
          <CountdownBanner lang={lang} />
        </div>

        {/* ------------------- STATS ------------------- */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label={t.statOpen}    value={stats.open}    tone="text-wedding-gold" />
          <StatCard label={t.statOverdue} value={stats.overdue} tone={stats.overdue > 0 ? 'text-red-500' : 'text-gray-400'} />
          <StatCard label={t.statDone}    value={`${stats.done}/${stats.total}`} tone="text-emerald-600" />
        </div>

        {/* ------------------- FILTER BAR ------------------- */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              <Filter className="w-3.5 h-3.5" /> {t.filter}
            </div>
            <button
              onClick={() => { setStatusFilter('open'); setCategoryFilter('all'); setOwnerFilter('all'); }}
              className="text-xs text-gray-400 hover:text-wedding-gold flex items-center gap-1"
            >
              <X className="w-3 h-3" /> {t.reset}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['open', 'done', 'all'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  statusFilter === s ? 'bg-wedding-gold text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >{statusLabel[s]}</button>
            ))}
            <span className="w-px self-stretch bg-gray-200 mx-1" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-100 border-0 font-medium text-gray-700"
            >
              <option value="all">{t.allCategories}</option>
              {TODO_CATEGORIES.map((c) => <option key={c} value={c}>{t.categories[c]}</option>)}
            </select>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value as any)}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-100 border-0 font-medium text-gray-700"
            >
              <option value="all">{t.allOwners}</option>
              {TODO_OWNERS.map((o) => <option key={o} value={o}>{t.owners[o]}</option>)}
            </select>
          </div>
        </div>

        {/* ------------------- ADD TODO ------------------- */}
        {showAddForm ? (
          <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-wedding-gold/40 p-4 mb-6 shadow-md">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={t.whatNeedsDoing}
              className="w-full text-base font-medium border-b border-gray-200 pb-2 mb-3 focus:outline-none focus:border-wedding-gold"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as TodoCategory)} className="text-sm px-3 py-2 rounded-lg border border-gray-200">
                {TODO_CATEGORIES.map((c) => <option key={c} value={c}>{t.categories[c]}</option>)}
              </select>
              <select value={newOwner} onChange={(e) => setNewOwner(e.target.value as TodoOwner)} className="text-sm px-3 py-2 rounded-lg border border-gray-200">
                {TODO_OWNERS.map((o) => <option key={o} value={o}>{t.owners[o]}</option>)}
              </select>
              <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="text-sm px-3 py-2 rounded-lg border border-gray-200" />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">{t.cancel}</button>
              <button type="submit" className="px-4 py-2 bg-wedding-gold text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#b08d4a]">{t.addTodoBtn}</button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-6 flex items-center justify-center gap-2 py-3 bg-white border border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-wedding-gold hover:text-wedding-gold transition-colors"
          >
            <Plus className="w-4 h-4" /> {t.addTodo}
          </button>
        )}

        {/* ------------------- ERRORS / LOADING ------------------- */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
            <button onClick={reload} className="ml-auto flex items-center gap-1 text-xs font-bold uppercase">
              <RefreshCw className="w-3 h-3" /> {t.retry}
            </button>
          </div>
        )}

        {loading && <div className="text-center text-gray-400 py-12">{t.loading}</div>}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <Check className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>{t.nothingToShow}</p>
          </div>
        )}

        {/* ------------------- GROUPED LIST ------------------- */}
        <div className="space-y-6">
          {grouped.map(([category, list]) => {
            const collapsed = collapsedCategories.has(category);
            return (
              <section key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex items-center gap-2 mb-3 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-wedding-gold transition-colors"
                >
                  {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {t.categories[category]}
                  <span className="text-gray-400 font-normal">({list.length})</span>
                </button>

                {!collapsed && (
                  <div className="space-y-2">
                    {list.map((todo) => (
                      <TodoRow
                        key={todo.id}
                        todo={todo}
                        t={t}
                        lang={lang}
                        expanded={expandedId === todo.id}
                        onExpand={() => setExpanded(expandedId === todo.id ? null : todo.id)}
                        onToggleDone={() => handleToggleDone(todo)}
                        onToggleInProgress={() => handleToggleInProgress(todo)}
                        onEdit={(patch) => handleEdit(todo.id, patch)}
                        onDelete={() => handleDelete(todo.id)}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {/* ------------------- IDENTITY SWITCHER (FAB) ------------------- */}
      <button
        onClick={onSwitchIdentity}
        className="fixed bottom-6 right-6 bg-white border border-gray-200 shadow-lg rounded-full pl-4 pr-5 py-3 flex items-center gap-2 hover:border-wedding-gold transition-colors z-40"
      >
        <Users className="w-4 h-4 text-wedding-gold" />
        <span className="text-xs font-bold uppercase tracking-wider text-gray-700">{t.owners[identity]}</span>
      </button>
    </div>
  );
};

// ---------------- StatCard ----------------

const StatCard: React.FC<{ label: string; value: number | string; tone: string }> = ({ label, value, tone }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
    <div className={`font-serif text-3xl font-bold ${tone}`}>{value}</div>
    <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{label}</div>
  </div>
);

// ---------------- TodoRow ----------------

interface TodoRowProps {
  todo: Todo;
  t: PlanningStrings;
  lang: Lang;
  expanded: boolean;
  onExpand: () => void;
  onToggleDone: () => void;
  onToggleInProgress: () => void;
  onEdit: (patch: Partial<Todo>) => void;
  onDelete: () => void;
}

const TodoRow: React.FC<TodoRowProps> = ({ todo, t, lang, expanded, onExpand, onToggleDone, onToggleInProgress, onEdit, onDelete }) => {
  const due = fmtRelative(todo.dueDate, t, lang);
  const accent = CATEGORY_ACCENT[todo.category];

  return (
    <div className={`rounded-2xl border-l-4 ${accent.split(' ')[0]} bg-white border border-gray-200 shadow-sm transition-all ${todo.done ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={onToggleDone}
          aria-label={todo.done ? 'Toggle' : 'Toggle'}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
            todo.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-wedding-gold'
          }`}
        >
          {todo.done && <Check className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <button onClick={onExpand} className="text-left w-full">
            <p className={`font-medium text-wedding-text ${todo.done ? 'line-through' : ''}`}>{todo.title}</p>
          </button>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${TONE_CLASSES[due.tone]}`}>
              <CalendarIcon className="w-2.5 h-2.5 inline mr-1 -mt-0.5" />
              {due.label}
            </span>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${OWNER_BADGE[todo.owner]}`}>
              {t.owners[todo.owner]}
            </span>
            {todo.inProgress && !todo.done && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-yellow-100 text-yellow-700">
                <Clock className="w-2.5 h-2.5 inline mr-1 -mt-0.5" /> {t.inProgress}
              </span>
            )}
            {todo.done && todo.doneBy && (
              <span className="text-[10px] uppercase tracking-wider text-emerald-600">
                {t.doneByLabel(t.owners[todo.doneBy as TodoOwner] ?? todo.doneBy)}
              </span>
            )}
          </div>
        </div>

        <button onClick={onExpand} className="text-gray-300 hover:text-gray-500 shrink-0">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50/50 rounded-b-2xl">
          <input
            value={todo.title}
            onChange={(e) => onEdit({ title: e.target.value })}
            className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2"
            placeholder={t.titlePlaceholder}
          />
          <div className="grid grid-cols-2 gap-2">
            <select value={todo.category} onChange={(e) => onEdit({ category: e.target.value as TodoCategory })} className="text-xs px-2 py-2 rounded-lg border border-gray-200 bg-white">
              {TODO_CATEGORIES.map((c) => <option key={c} value={c}>{t.categories[c]}</option>)}
            </select>
            <select value={todo.owner} onChange={(e) => onEdit({ owner: e.target.value as TodoOwner })} className="text-xs px-2 py-2 rounded-lg border border-gray-200 bg-white">
              {TODO_OWNERS.map((o) => <option key={o} value={o}>{t.owners[o]}</option>)}
            </select>
            <input
              type="date"
              value={todo.dueDate ?? ''}
              onChange={(e) => onEdit({ dueDate: e.target.value })}
              className="text-xs px-2 py-2 rounded-lg border border-gray-200 bg-white col-span-2"
            />
          </div>
          <textarea
            value={todo.notes ?? ''}
            onChange={(e) => onEdit({ notes: e.target.value })}
            placeholder={t.notesPlaceholder}
            rows={3}
            className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2"
          />
          <div className="flex justify-between items-center">
            <button
              onClick={onToggleInProgress}
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                todo.inProgress ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Clock className="w-3 h-3 inline mr-1" />
              {todo.inProgress ? t.inProgress : t.markInProgress}
            </button>
            <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> {t.delete}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningBoard;
