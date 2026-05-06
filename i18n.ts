import { TodoCategory, TodoOwner } from './types';

export type Lang = 'en' | 'zh';
export const LANG_KEY = 'wedding_planning_lang';

export interface PlanningStrings {
  // Identity picker
  planningBoard: string;
  whoAreYou: string;
  weRemember: string;
  couple: string;
  weddingPlanner: string;
  switchLater: string;

  // Countdown
  countingDown: string;
  weddingDate: string;
  weddingLocation: string;
  youDidIt: string;
  daysLabel: string;
  hoursLabel: string;
  minutesLabel: string;
  secondsLabel: string;

  // Stats
  statOpen: string;
  statOverdue: string;
  statDone: string;

  // Filters
  filter: string;
  reset: string;
  filterAll: string;
  filterOpen: string;
  filterDone: string;
  allCategories: string;
  allOwners: string;

  // Add form
  addTodo: string;
  whatNeedsDoing: string;
  cancel: string;
  addTodoBtn: string;
  category: string;

  // Todo row
  noDueDate: string;
  dueOverdue: (n: number) => string;
  dueToday: string;
  dueTomorrow: string;
  dueInDays: (n: number) => string;
  dueOn: (label: string) => string;
  inProgress: string;
  markInProgress: string;
  delete: string;
  deleteConfirm: string;
  doneByLabel: (name: string) => string;
  notesPlaceholder: string;
  titlePlaceholder: string;
  progress: string;
  progressStages: { 0: string; 25: string; 50: string; 75: string; 100: string };

  // Comments
  comments: string;
  noComments: string;
  addComment: string;
  send: string;
  reply: string;
  mentionHint: string;
  unreadMentions: (n: number) => string;
  justNow: string;
  minutesAgo: (n: number) => string;
  hoursAgo: (n: number) => string;
  daysAgo: (n: number) => string;
  commentsFor: (title: string) => string;
  closeSidebar: string;
  openSidebar: string;
  noCommentsYet: string;
  selectTodoToView: string;

  // States
  loading: string;
  nothingToShow: string;
  retry: string;

  // Categories (display names — DB still uses English ENUM values)
  categories: Record<TodoCategory, string>;
  owners: Record<TodoOwner, string>;
}

const en: PlanningStrings = {
  planningBoard: 'Wedding Planning Board',
  whoAreYou: "Who's checking in?",
  weRemember: "We'll remember on this device so you don't have to pick again.",
  couple: 'Couple',
  weddingPlanner: 'Wedding planner',
  switchLater: 'You can switch identities later — bottom right corner.',

  countingDown: 'Counting down to',
  weddingDate: 'June 12, 2026',
  weddingLocation: 'Wailea, Maui',
  youDidIt: '🎉 You did it! 🎉',
  daysLabel: 'Days',
  hoursLabel: 'Hours',
  minutesLabel: 'Minutes',
  secondsLabel: 'Seconds',

  statOpen: 'Open',
  statOverdue: 'Overdue',
  statDone: 'Done',

  filter: 'Filter',
  reset: 'Reset',
  filterAll: 'All',
  filterOpen: 'Open',
  filterDone: 'Done',
  allCategories: 'All categories',
  allOwners: 'All owners',

  addTodo: 'Add a todo',
  whatNeedsDoing: 'What needs doing?',
  cancel: 'Cancel',
  addTodoBtn: 'Add Todo',
  category: 'Category',

  noDueDate: 'No due date',
  dueOverdue: (n) => `${n}d overdue`,
  dueToday: 'Due today',
  dueTomorrow: 'Due tomorrow',
  dueInDays: (n) => `Due in ${n}d`,
  dueOn: (label) => `Due ${label}`,
  inProgress: 'In progress',
  markInProgress: 'Mark in progress',
  delete: 'Delete',
  deleteConfirm: 'Delete this todo?',
  doneByLabel: (name) => `✓ by ${name}`,
  notesPlaceholder: 'Notes (links, vendor contacts, decisions…)',
  titlePlaceholder: 'Title',

  loading: 'Loading…',
  nothingToShow: 'Nothing to show with these filters.',
  retry: 'Retry',

  progress: 'Progress',
  progressStages: {
    0:   'Not Started',
    25:  'Started',
    50:  'In Progress',
    75:  'Almost Done',
    100: 'Done',
  },

  comments: 'Comments',
  noComments: 'No comments yet',
  addComment: 'Add a comment…',
  send: 'Send',
  reply: 'Reply',
  mentionHint: 'Tip: type @ to mention someone',
  unreadMentions: (n) => `${n} unread`,
  justNow: 'just now',
  minutesAgo: (n) => `${n}m ago`,
  hoursAgo: (n) => `${n}h ago`,
  daysAgo: (n) => `${n}d ago`,
  commentsFor: (title) => `Comments · ${title}`,
  closeSidebar: 'Close',
  openSidebar: 'Comments',
  noCommentsYet: 'No comments yet — start the conversation.',
  selectTodoToView: 'Pick a todo on the left to see its comments.',

  categories: {
    'Ceremony':         'Ceremony',
    'Photo & Video':    'Photo & Video',
    'Vendors & Setup':  'Vendors & Setup',
    'Attire':           'Attire',
    'Gifts':            'Gifts',
    'Wedding Party':    'Wedding Party',
    'BEO / Catering':   'BEO / Catering',
    'Travel & Lodging': 'Travel & Lodging',
    'Other':            'Other',
  },

  owners: {
    Francis:    'Francis',
    Yuwen:      'Yuwen',
    Both:       'Both',
    Planner:    'Manna',
    Unassigned: 'Unassigned',
  },
};

const zh: PlanningStrings = {
  planningBoard: '婚礼筹备清单',
  whoAreYou: '请选择你的身份',
  weRemember: '我们会在此设备上记住，下次无需再选。',
  couple: '新人',
  weddingPlanner: '婚礼策划',
  switchLater: '可随时在右下角切换身份。',

  countingDown: '距离婚礼还有',
  weddingDate: '2026 年 6 月 12 日',
  weddingLocation: '夏威夷 · 茂宜岛 · Wailea',
  youDidIt: '🎉 完成啦！🎉',
  daysLabel: '天',
  hoursLabel: '时',
  minutesLabel: '分',
  secondsLabel: '秒',

  statOpen: '未完成',
  statOverdue: '已逾期',
  statDone: '已完成',

  filter: '筛选',
  reset: '重置',
  filterAll: '全部',
  filterOpen: '未完成',
  filterDone: '已完成',
  allCategories: '所有分类',
  allOwners: '所有负责人',

  addTodo: '添加事项',
  whatNeedsDoing: '需要做什么？',
  cancel: '取消',
  addTodoBtn: '添加',
  category: '分类',

  noDueDate: '无截止日期',
  dueOverdue: (n) => `已逾期 ${n} 天`,
  dueToday: '今天截止',
  dueTomorrow: '明天截止',
  dueInDays: (n) => `还有 ${n} 天`,
  dueOn: (label) => `${label} 截止`,
  inProgress: '进行中',
  markInProgress: '标记进行中',
  delete: '删除',
  deleteConfirm: '确定删除这条事项？',
  doneByLabel: (name) => `${name} 已完成 ✓`,
  notesPlaceholder: '备注（链接、供应商联系方式、决定…）',
  titlePlaceholder: '标题',

  loading: '加载中…',
  nothingToShow: '当前筛选条件下没有内容。',
  retry: '重试',

  progress: '进度',
  progressStages: {
    0:   '未开始',
    25:  '已开始',
    50:  '进行中',
    75:  '接近完成',
    100: '已完成',
  },

  comments: '评论',
  noComments: '还没有评论',
  addComment: '写一条评论…',
  send: '发送',
  reply: '回复',
  mentionHint: '提示：输入 @ 提及某人',
  unreadMentions: (n) => `${n} 条未读`,
  justNow: '刚刚',
  minutesAgo: (n) => `${n} 分钟前`,
  hoursAgo: (n) => `${n} 小时前`,
  daysAgo: (n) => `${n} 天前`,
  commentsFor: (title) => `评论 · ${title}`,
  closeSidebar: '收起',
  openSidebar: '评论',
  noCommentsYet: '还没有评论 — 来开个头吧。',
  selectTodoToView: '点击左侧某条事项查看其评论。',

  categories: {
    'Ceremony':         '仪式',
    'Photo & Video':    '摄影摄像',
    'Vendors & Setup':  '供应商 & 布置',
    'Attire':           '服装',
    'Gifts':            '礼物',
    'Wedding Party':    '伴郎伴娘团',
    'BEO / Catering':   '宴会 & 餐饮',
    'Travel & Lodging': '出行 & 住宿',
    'Other':            '其他',
  },

  owners: {
    Francis:    'Francis',
    Yuwen:      'Yuwen',
    Both:       '两人',
    Planner:    'Manna',
    Unassigned: '未分配',
  },
};

export const dict: Record<Lang, PlanningStrings> = { en, zh };

export const isLang = (v: unknown): v is Lang => v === 'en' || v === 'zh';
