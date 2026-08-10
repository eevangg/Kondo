export const CURRENCY_SYMBOL = '₱';

export const INITIAL_ROOMMATES = [
  { id: 'r1', name: 'Andre', avatar_color: '#6366f1', initials: 'AN', pin: '123456', telegram_handle: '@eevangg' },
  { id: 'r2', name: 'Gerard', avatar_color: '#06b6d4', initials: 'GR', pin: '567890', telegram_handle: '@gerardmolinaa' }
];

export const INITIAL_EVENTS = [];

export const INITIAL_BILLS = [
  {
    id: 'b1',
    title: 'Monthly Rent',
    amount: 16000.00,
    due_date: '2026-09-01',
    category: 'Monthly Dues',
    paid_by: 'r1',
    is_paid: false,
    is_recurring: true,
    recurrence_interval: 'Monthly',
    status: 'Due',
    remarks: 'Monthly condo rent (Due 1st of month)'
  },
  {
    id: 'b2',
    title: 'Converge Fiber Internet',
    amount: 1500.00,
    due_date: '2026-09-01',
    category: 'Utilities',
    paid_by: 'r1',
    is_paid: false,
    is_recurring: true,
    recurrence_interval: 'Monthly',
    status: 'Due',
    remarks: 'Converge high-speed internet (Due 1st of month)'
  },
  {
    id: 'b3',
    title: 'Electricity (Meralco - June & July)',
    amount: 10522.63,
    due_date: '2026-07-27',
    category: 'Utilities',
    paid_by: 'r1',
    is_paid: false,
    is_recurring: true,
    recurrence_interval: 'Monthly',
    status: 'Overdue',
    remarks: 'Meralco electric bill (Due 27th of month - Overdue)'
  },
  {
    id: 'b4',
    title: 'Association Dues + Water',
    amount: 2562.80,
    due_date: '2026-08-30',
    category: 'Monthly Dues',
    paid_by: 'r1',
    is_paid: false,
    is_recurring: true,
    recurrence_interval: 'Monthly',
    status: 'Due',
    remarks: 'Building dues & water utility (Due 30th of month)'
  }
];

export const INITIAL_EXPENSES = [];

export const INITIAL_PANTRY = [];

export const INITIAL_SHOPPING = [];

export const INITIAL_DAILY_ROUTINE = [
  { id: 'dr1', title: 'Take Out Trash', is_done: false },
  { id: 'dr2', title: 'Clean Kitchen & Wipe Counters', is_done: false }
];

export const INITIAL_CLEANING = [
  {
    id: 'c1',
    task_name: 'Deep Clean Bathroom',
    area: 'Bathroom',
    interval_days: 7,
    last_cleaned_at: '2026-08-05',
    last_cleaned_by: 'r1',
    streak: 1
  }
];

export const INITIAL_MAINTENANCE = [
  {
    id: 'm1',
    title: 'Broken Kitchen Sink',
    description: 'Kitchen sink leak repair.',
    location: 'Kitchen',
    priority: 'High',
    status: 'Done',
    reported_by: 'r1',
    assigned_to: 'r1',
    resolved_at: '2026-08-03T14:00:00'
  }
];
