import { TodoCategory, TodoOwner, Identity } from './types';

// =============================================================================
// SECRET URL SLUG — change this to rotate access. Anyone with the URL can edit.
// Bookmark: https://<your-domain>/#/<PLANNING_SLUG>
// =============================================================================
export const PLANNING_SLUG = 'planning-k7m9q3nx';

export const WEDDING_DATE = new Date('2026-06-12T16:00:00-10:00'); // 4pm HST
export const WEDDING_DATE_LABEL = 'June 12, 2026';

export const IDENTITIES: Identity[] = ['Francis', 'Yuwen', 'Planner'];

export const TODO_CATEGORIES: TodoCategory[] = [
  'Ceremony',
  'Photo & Video',
  'Vendors & Setup',
  'Attire',
  'Gifts',
  'Wedding Party',
  'BEO / Catering',
  'Travel & Lodging',
  'Other',
];

export const TODO_OWNERS: TodoOwner[] = ['Francis', 'Yuwen', 'Both', 'Planner', 'Unassigned'];

// Tailwind color hints per category — used for left-border accents on cards.
export const CATEGORY_ACCENT: Record<TodoCategory, string> = {
  'Ceremony':         'border-rose-400 bg-rose-50',
  'Photo & Video':    'border-purple-400 bg-purple-50',
  'Vendors & Setup':  'border-amber-400 bg-amber-50',
  'Attire':           'border-pink-400 bg-pink-50',
  'Gifts':            'border-emerald-400 bg-emerald-50',
  'Wedding Party':    'border-sky-400 bg-sky-50',
  'BEO / Catering':   'border-orange-400 bg-orange-50',
  'Travel & Lodging': 'border-indigo-400 bg-indigo-50',
  'Other':            'border-gray-400 bg-gray-50',
};

export const IDENTITY_KEY = 'wedding_planning_identity';
