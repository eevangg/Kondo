export const CURRENCY_SYMBOL = '₱';

export const INITIAL_ROOMMATES = [
  { id: 'r1', name: 'Andre', avatar_color: '#6366f1', initials: 'AN', pin: '123456', telegram_handle: '@eevangg' },
  { id: 'r2', name: 'Gerard', avatar_color: '#06b6d4', initials: 'GR', pin: '567890', telegram_handle: '@gerardmolinaa' }
];

export const INITIAL_EVENTS = [
  {
    id: 'ev1',
    title: 'Condo Maintenance Visit',
    event_date: '2026-08-12T09:00',
    category: 'Maintenance',
    reminder_timing: '1 day before',
    added_by: 'r1',
    notes: 'Technician checking kitchen faucet drip'
  },
  {
    id: 'ev2',
    title: 'Professional Unit Cleaning',
    event_date: '2026-09-01T12:00',
    category: 'Cleaning',
    reminder_timing: 'Morning of event (8:00 AM)',
    added_by: 'r1',
    notes: 'Full deep clean session'
  }
];

export const INITIAL_BILLS = [
  {
    id: 'b1',
    title: 'July - August Rent',
    amount: 32000.00,
    due_date: '2026-08-15',
    category: 'Monthly Dues',
    paid_by: 'r1',
    is_paid: false,
    is_recurring: true,
    recurrence_interval: 'Monthly',
    status: 'Due',
    remarks: 'Monthly condo rent'
  },
  {
    id: 'b2',
    title: 'Association Dues + Water (June + July)',
    amount: 5176.86,
    due_date: '2026-08-20',
    category: 'Monthly Dues',
    paid_by: 'r1',
    is_paid: false,
    is_recurring: true,
    recurrence_interval: 'Monthly',
    status: 'Due',
    remarks: 'Building dues & water utility'
  },
  {
    id: 'b3',
    title: 'Electricity (June + July)',
    amount: 10522.63,
    due_date: '2026-08-25',
    category: 'Utilities',
    paid_by: 'r1',
    is_paid: false,
    is_recurring: true,
    recurrence_interval: 'Monthly',
    status: 'Due',
    remarks: 'Meralco electric bill'
  },
  {
    id: 'b4',
    title: 'High-Speed Fiber Internet',
    amount: 1899.00,
    due_date: '2026-08-28',
    category: 'Utilities',
    paid_by: 'r1',
    is_paid: false,
    is_recurring: true,
    recurrence_interval: 'Monthly',
    status: 'Due',
    remarks: 'PLDT/Globe fiber WiFi'
  }
];

export const INITIAL_EXPENSES = [
  {
    id: 'e1',
    description: 'Coffee for both of us',
    amount: 130.00,
    paid_by: 'r1',
    category: 'Groceries',
    split_type: 'full',
    expense_date: '2026-08-10'
  },
  {
    id: 'e2',
    description: 'Weekly Grocery Shopping',
    amount: 3450.00,
    paid_by: 'r1',
    category: 'Groceries',
    split_type: 'equal',
    expense_date: '2026-08-08'
  },
  {
    id: 'e3',
    description: 'Drinking Water Refill (5 Gallons)',
    amount: 350.00,
    paid_by: 'r2',
    category: 'Household',
    split_type: 'equal',
    expense_date: '2026-08-05'
  }
];

export const INITIAL_PANTRY = [
  {
    id: 'p1',
    name: 'Drinking Water Gallons',
    category: 'Household Essentials',
    stock_level: 'Low',
    expiration_date: null,
    reminder_days_before: 1,
    auto_add_shopping: true
  },
  {
    id: 'p2',
    name: 'Eggs & Milk',
    category: 'Fridge',
    stock_level: 'Medium',
    expiration_date: '2026-08-18',
    reminder_days_before: 1,
    auto_add_shopping: true
  },
  {
    id: 'p3',
    name: 'Frozen Chicken Breasts',
    category: 'Freezer',
    stock_level: 'Full',
    expiration_date: '2026-09-30',
    reminder_days_before: 3,
    auto_add_shopping: true
  },
  {
    id: 'p4',
    name: 'Rice & Instant Coffee',
    category: 'Dry Goods',
    stock_level: 'Full',
    expiration_date: null,
    reminder_days_before: 1,
    auto_add_shopping: true
  }
];

export const INITIAL_SHOPPING = [
  {
    id: 's1',
    name: 'Drinking Water Gallon Refill',
    category: 'Household Essentials',
    is_completed: false,
    pantry_item_id: 'p1',
    added_by: 'r1'
  }
];

export const INITIAL_DAILY_ROUTINE = [
  { id: 'dr1', title: 'Take Out Trash', is_done: false },
  { id: 'dr2', title: 'Clean Kitchen & Wipe Counters', is_done: false }
];

export const INITIAL_CLEANING = [
  {
    id: 'c1',
    task_name: 'Deep Clean Bathroom & Shower',
    area: 'Bathroom',
    interval_days: 7,
    last_cleaned_at: '2026-08-05T10:00:00.000Z',
    last_cleaned_by: 'r1',
    streak: 3
  }
];

export const INITIAL_MAINTENANCE = [
  {
    id: 'm1',
    title: 'Kitchen Sink Faucet Dripping',
    description: 'Slow drip from handle joint.',
    location: 'Kitchen',
    priority: 'Medium',
    status: 'To Fix',
    reported_by: 'r2',
    assigned_to: 'r1'
  }
];
