export const INITIAL_ROOMMATES = [
  { id: 'r1', name: 'Alex', avatar_color: '#6366f1', initials: 'AX' },
  { id: 'r2', name: 'Sam', avatar_color: '#ec4899', initials: 'SM' }
];

export const INITIAL_BILLS = [
  {
    id: 'b1',
    title: 'High-Speed Fiber Internet',
    amount: 80.00,
    due_date: '2026-08-15',
    category: 'Utilities',
    paid_by: 'r1',
    is_paid: false,
    is_recurring: true,
    recurrence_interval: 'Monthly'
  },
  {
    id: 'b2',
    title: 'Electric & Water Utility',
    amount: 145.50,
    due_date: '2026-08-20',
    category: 'Utilities',
    paid_by: 'r2',
    is_paid: false,
    is_recurring: true,
    recurrence_interval: 'Monthly'
  },
  {
    id: 'b3',
    title: 'Monthly Rent',
    amount: 2400.00,
    due_date: '2026-09-01',
    category: 'Rent',
    paid_by: 'r1',
    is_paid: true,
    is_recurring: true,
    recurrence_interval: 'Monthly'
  }
];

export const INITIAL_EXPENSES = [
  {
    id: 'e1',
    description: 'Weekly Grocery Haul (Trader Joe\'s)',
    amount: 124.80,
    paid_by: 'r1',
    category: 'Groceries',
    split_type: 'equal',
    expense_date: '2026-08-08'
  },
  {
    id: 'e2',
    description: 'Dishwashing Pods & Paper Towels',
    amount: 32.50,
    paid_by: 'r2',
    category: 'Household',
    split_type: 'equal',
    expense_date: '2026-08-05'
  },
  {
    id: 'e3',
    description: 'Air Filter 2-Pack',
    amount: 28.00,
    paid_by: 'r1',
    category: 'Maintenance',
    split_type: 'equal',
    expense_date: '2026-08-02'
  }
];

export const INITIAL_PANTRY = [
  {
    id: 'p1',
    name: 'Oat Milk (Barista Blend)',
    category: 'Dairy/Refrigerated',
    stock_level: 'Low',
    expiration_date: '2026-08-18',
    auto_add_shopping: true
  },
  {
    id: 'p2',
    name: 'Espresso Coffee Beans',
    category: 'Pantry',
    stock_level: 'Full',
    expiration_date: '2026-11-30',
    auto_add_shopping: true
  },
  {
    id: 'p3',
    name: 'Olive Oil (Extra Virgin)',
    category: 'Pantry',
    stock_level: 'Medium',
    expiration_date: '2027-01-15',
    auto_add_shopping: true
  },
  {
    id: 'p4',
    name: 'Trash Bags (13 Gallon)',
    category: 'Household Supplies',
    stock_level: 'Out',
    expiration_date: null,
    auto_add_shopping: true
  }
];

export const INITIAL_SHOPPING = [
  {
    id: 's1',
    name: 'Oat Milk (Barista Blend)',
    category: 'Dairy/Refrigerated',
    is_completed: false,
    pantry_item_id: 'p1',
    added_by: 'r1'
  },
  {
    id: 's2',
    name: 'Trash Bags (13 Gallon)',
    category: 'Household Supplies',
    is_completed: false,
    pantry_item_id: 'p4',
    added_by: 'r2'
  },
  {
    id: 's3',
    name: 'Avocados & Sourdough Bread',
    category: 'Groceries',
    is_completed: true,
    pantry_item_id: null,
    added_by: 'r1'
  }
];

export const INITIAL_CLEANING = [
  {
    id: 'c1',
    task_name: 'Deep Clean Bathroom & Shower',
    area: 'Bathroom',
    interval_days: 7,
    last_cleaned_at: '2026-08-04T10:00:00.000Z',
    last_cleaned_by: 'r1',
    streak: 3
  },
  {
    id: 'c2',
    task_name: 'Wipe Kitchen Counters & Sink',
    area: 'Kitchen',
    interval_days: 3,
    last_cleaned_at: '2026-08-09T18:30:00.000Z',
    last_cleaned_by: 'r2',
    streak: 5
  },
  {
    id: 'c3',
    task_name: 'Vacuum Living Room & Rug',
    area: 'Living Room',
    interval_days: 7,
    last_cleaned_at: '2026-08-01T14:00:00.000Z',
    last_cleaned_by: 'r1',
    streak: 2
  }
];

export const INITIAL_MAINTENANCE = [
  {
    id: 'm1',
    title: 'Kitchen Sink Faucet Dripping',
    description: 'Slow drip from main handle joint. Needs new washer or O-ring.',
    location: 'Kitchen',
    priority: 'Urgent',
    status: 'Reported',
    reported_by: 'r2',
    assigned_to: 'r1'
  },
  {
    id: 'm2',
    title: 'Hallway Lightbulb Replacement',
    description: 'Bulb flickers when turned on. Need LED warm white bulb.',
    location: 'Hallway',
    priority: 'Low',
    status: 'In Progress',
    reported_by: 'r1',
    assigned_to: 'r2'
  }
];
