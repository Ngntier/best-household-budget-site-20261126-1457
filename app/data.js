// Seed data for the Hartley household budget: a family of four (two adults,
// two children) tracking November 2026. Every figure is invented for this
// demo household; nothing here is copied from a real person or business.

export const HOUSEHOLD = {
  name: 'The Hartley Household',
  month: 'November 2026',
  monthKey: '2026-11',
  members: ['Maya Hartley', 'Jordan Hartley', 'Leo Hartley (9)', 'Nina Hartley (6)'],
  currency: 'USD',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#2f6f4f', icon: '⌂' },
  { id: 'groceries', label: 'Groceries', color: '#4a7c59', icon: '◍' },
  { id: 'utilities', label: 'Utilities', color: '#7a6a2f', icon: '⚡' },
  { id: 'transport', label: 'Transport', color: '#3d6e8e', icon: '➤' },
  { id: 'dining', label: 'Dining out', color: '#b4552d', icon: '✦' },
  { id: 'entertainment', label: 'Entertainment', color: '#7c4a8e', icon: '♪' },
  { id: 'health', label: 'Health', color: '#a03a4b', icon: '+' },
  { id: 'kids', label: 'Kids & school', color: '#2e7d6b', icon: '✎' },
  { id: 'clothing', label: 'Clothing', color: '#8a6d3b', icon: '◐' },
  { id: 'subscriptions', label: 'Subscriptions', color: '#5b6b7a', icon: '↻' },
  { id: 'savings', label: 'Savings', color: '#2f6f4f', icon: '⬢' },
  { id: 'other', label: 'Other', color: '#6b7280', icon: '•' },
];

export const INCOME = [
  { id: 'inc-1', date: '2026-11-01', source: 'Maya — salary (school office)', amount: 4850, note: 'Monthly pay, after tax' },
  { id: 'inc-2', date: '2026-11-01', source: 'Jordan — salary (warehouse lead)', amount: 3900, note: 'Monthly pay, after tax' },
  { id: 'inc-3', date: '2026-11-08', source: 'Jordan — weekend delivery shifts', amount: 340, note: 'Two Saturday shifts' },
  { id: 'inc-4', date: '2026-11-15', source: 'Maya — tutoring, two evenings', amount: 280, note: 'Maths tutoring, paid in cash' },
  { id: 'inc-5', date: '2026-11-22', source: 'Jordan — weekend delivery shifts', amount: 280, note: 'Two Saturday shifts' },
];

// Budgets are the limits the household set for November.
export const BUDGETS = [
  { category: 'housing', limit: 1850 },
  { category: 'groceries', limit: 720 },
  { category: 'utilities', limit: 310 },
  { category: 'transport', limit: 260 },
  { category: 'dining', limit: 180 },
  { category: 'entertainment', limit: 120 },
  { category: 'health', limit: 150 },
  { category: 'kids', limit: 200 },
  { category: 'clothing', limit: 120 },
  { category: 'subscriptions', limit: 68 },
  { category: 'other', limit: 100 },
];

export const BILLS = [
  { id: 'bill-1', name: 'Rent — Maple Court flat', amount: 1850, due: '2026-11-01', frequency: 'Monthly', category: 'housing', paid: true, autopay: true },
  { id: 'bill-2', name: 'Electricity — City Power', amount: 132, due: '2026-11-05', frequency: 'Monthly', category: 'utilities', paid: true, autopay: true },
  { id: 'bill-3', name: 'Water & sewer', amount: 64, due: '2026-11-07', frequency: 'Monthly', category: 'utilities', paid: true, autopay: false },
  { id: 'bill-4', name: 'Internet — 300 Mbps', amount: 59, due: '2026-11-10', frequency: 'Monthly', category: 'utilities', paid: true, autopay: true },
  { id: 'bill-5', name: 'Mobile — two lines', amount: 78, due: '2026-11-12', frequency: 'Monthly', category: 'utilities', paid: true, autopay: true },
  { id: 'bill-6', name: 'Car insurance', amount: 96, due: '2026-11-15', frequency: 'Monthly', category: 'transport', paid: true, autopay: true },
  { id: 'bill-7', name: 'After-school club (Leo)', amount: 140, due: '2026-11-18', frequency: 'Monthly', category: 'kids', paid: true, autopay: false },
  { id: 'bill-8', name: 'Dental plan', amount: 42, due: '2026-11-20', frequency: 'Monthly', category: 'health', paid: true, autopay: true },
  { id: 'bill-9', name: 'Streaming bundle', amount: 24, due: '2026-11-22', frequency: 'Monthly', category: 'subscriptions', paid: true, autopay: true },
  { id: 'bill-10', name: 'Gas — heating', amount: 58, due: '2026-11-25', frequency: 'Monthly', category: 'utilities', paid: false, autopay: false },
  { id: 'bill-11', name: 'Gym — family plan', amount: 36, due: '2026-11-28', frequency: 'Monthly', category: 'health', paid: false, autopay: true },
];

export const GOALS = [
  { id: 'goal-1', name: 'Emergency fund', target: 10000, saved: 6400, note: 'Six months of essentials, kept in a separate savings account.' },
  { id: 'goal-2', name: 'Summer holiday — seaside cottage', target: 2400, saved: 1130, note: 'A week by the coast in July, cottage + train fares.' },
  { id: 'goal-3', name: 'Replace the family car', target: 8000, saved: 2350, note: 'The old hatchback is on 148,000 miles; saving for a used estate.' },
  { id: 'goal-4', name: 'Leo’s bike + Nina’s scooter', target: 420, saved: 420, note: 'Reached on 14 November — bikes ordered for Christmas.' },
];

// November spending so far (1–25 Nov). Amounts are what left the account.
export const TRANSACTIONS = [
  { id: 't-01', date: '2026-11-01', description: 'Rent — Maple Court flat', category: 'housing', amount: 1850, note: 'Autopay' },
  { id: 't-02', date: '2026-11-01', description: 'Corner Market — weekly shop', category: 'groceries', amount: 96.4, note: 'Fruit, veg, bread, milk' },
  { id: 't-03', date: '2026-11-02', description: 'Bus passes — Maya & Jordan', category: 'transport', amount: 74, note: 'Monthly passes' },
  { id: 't-04', date: '2026-11-02', description: 'Pharmacy — Nina’s inhaler refill', category: 'health', amount: 18.5, note: '' },
  { id: 't-05', date: '2026-11-03', description: 'Corner Market — top-up shop', category: 'groceries', amount: 41.2, note: 'School lunchboxes' },
  { id: 't-06', date: '2026-11-04', description: 'Pizza night — takeaway', category: 'dining', amount: 32.8, note: 'Friday treat' },
  { id: 't-07', date: '2026-11-05', description: 'Electricity — City Power', category: 'utilities', amount: 132, note: 'Autopay' },
  { id: 't-08', date: '2026-11-06', description: 'Petrol — family car', category: 'transport', amount: 48.6, note: 'Full tank' },
  { id: 't-09', date: '2026-11-07', description: 'Water & sewer', category: 'utilities', amount: 64, note: '' },
  { id: 't-10', date: '2026-11-07', description: 'Corner Market — weekly shop', category: 'groceries', amount: 108.75, note: 'Includes baking for school fair' },
  { id: 't-11', date: '2026-11-08', description: 'Cinema — family matinee', category: 'entertainment', amount: 34, note: 'Two adults, two children' },
  { id: 't-12', date: '2026-11-08', description: 'Leo — new school shoes', category: 'clothing', amount: 42, note: 'Outgrew the old pair' },
  { id: 't-13', date: '2026-11-09', description: 'Internet — 300 Mbps', category: 'utilities', amount: 59, note: 'Autopay' },
  { id: 't-14', date: '2026-11-10', description: 'Corner Market — weekly shop', category: 'groceries', amount: 89.3, note: '' },
  { id: 't-15', date: '2026-11-11', description: 'Lunch out — Maya & Jordan', category: 'dining', amount: 26.5, note: 'Anniversary lunch, small café' },
  { id: 't-16', date: '2026-11-12', description: 'Mobile — two lines', category: 'utilities', amount: 78, note: 'Autopay' },
  { id: 't-17', date: '2026-11-12', description: 'Nina — swimming lessons', category: 'kids', amount: 48, note: 'Four-week block' },
  { id: 't-18', date: '2026-11-13', description: 'Petrol — family car', category: 'transport', amount: 44.2, note: '' },
  { id: 't-19', date: '2026-11-14', description: 'Corner Market — weekly shop', category: 'groceries', amount: 102.15, note: '' },
  { id: 't-20', date: '2026-11-14', description: 'Books — Leo’s reading list', category: 'kids', amount: 21.9, note: 'Second-hand bookshop' },
  { id: 't-21', date: '2026-11-15', description: 'Car insurance', category: 'transport', amount: 96, note: 'Autopay' },
  { id: 't-22', date: '2026-11-15', description: 'Takeaway — noodles', category: 'dining', amount: 28.4, note: 'Too tired to cook' },
  { id: 't-23', date: '2026-11-16', description: 'Dentist — check-up (Maya)', category: 'health', amount: 55, note: 'Six-month check' },
  { id: 't-24', date: '2026-11-17', description: 'Corner Market — top-up shop', category: 'groceries', amount: 36.8, note: '' },
  { id: 't-25', date: '2026-11-18', description: 'After-school club (Leo)', category: 'kids', amount: 140, note: 'November block' },
  { id: 't-26', date: '2026-11-18', description: 'Streaming bundle', category: 'subscriptions', amount: 24, note: 'Autopay' },
  { id: 't-27', date: '2026-11-19', description: 'Board games — family night', category: 'entertainment', amount: 27.5, note: 'Bought at the toy shop' },
  { id: 't-28', date: '2026-11-20', description: 'Dental plan', category: 'health', amount: 42, note: 'Autopay' },
  { id: 't-29', date: '2026-11-20', description: 'Corner Market — weekly shop', category: 'groceries', amount: 94.6, note: '' },
  { id: 't-30', date: '2026-11-21', description: 'Petrol — family car', category: 'transport', amount: 51.3, note: 'Trip to grandparents' },
  { id: 't-31', date: '2026-11-21', description: 'Café — grandparents’ visit', category: 'dining', amount: 19.75, note: 'Cake and coffee for six' },
  { id: 't-32', date: '2026-11-22', description: 'Streaming bundle — music add-on', category: 'subscriptions', amount: 11.99, note: 'Family music plan' },
  { id: 't-33', date: '2026-11-22', description: 'Winter coats — Nina', category: 'clothing', amount: 58, note: 'Sale price' },
  { id: 't-34', date: '2026-11-23', description: 'Corner Market — top-up shop', category: 'groceries', amount: 44.9, note: '' },
  { id: 't-35', date: '2026-11-23', description: 'School trip — Leo’s museum day', category: 'kids', amount: 18, note: 'Coach + entry' },
  { id: 't-36', date: '2026-11-24', description: 'Pharmacy — vitamins', category: 'health', amount: 12.4, note: '' },
  { id: 't-37', date: '2026-11-24', description: 'Bus fare — Jordan', category: 'transport', amount: 6.5, note: 'Extra shift travel' },
  { id: 't-38', date: '2026-11-25', description: 'Corner Market — weekly shop', category: 'groceries', amount: 97.85, note: 'Thanksgiving ingredients' },
  { id: 't-39', date: '2026-11-25', description: 'Takeaway — burgers', category: 'dining', amount: 31.6, note: 'Half-term treat' },
  { id: 't-40', date: '2026-11-25', description: 'Savings transfer — emergency fund', category: 'savings', amount: 400, note: 'Auto-transfer on payday' },
];

// Six months of totals for the trend chart (income vs spending).
export const MONTHLY_HISTORY = [
  { month: 'Jun', income: 9210, spending: 3985 },
  { month: 'Jul', income: 9340, spending: 4210 },
  { month: 'Aug', income: 9180, spending: 4590 },
  { month: 'Sep', income: 9470, spending: 4050 },
  { month: 'Oct', income: 9520, spending: 4180 },
  { month: 'Nov', income: 9650, spending: 4308 },
];
