// State: loads the seed dataset, persists every change in localStorage, and
// exposes the totals the views need. All money is in USD, stored as numbers.

import { BUDGETS, BILLS, CATEGORIES, GOALS, INCOME, TRANSACTIONS } from './data.js';

const STORAGE_KEY = 'hartley-budget-v1';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function defaultState() {
  return {
    transactions: clone(TRANSACTIONS),
    income: clone(INCOME),
    budgets: clone(BUDGETS),
    bills: clone(BILLS),
    goals: clone(GOALS),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();
    return {
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : base.transactions,
      income: Array.isArray(parsed.income) ? parsed.income : base.income,
      budgets: Array.isArray(parsed.budgets) ? parsed.budgets : base.budgets,
      bills: Array.isArray(parsed.bills) ? parsed.bills : base.bills,
      goals: Array.isArray(parsed.goals) ? parsed.goals : base.goals,
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return defaultState();
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#6b7280', icon: '•' };
}

export function money(amount) {
  const sign = amount < 0 ? '-' : '';
  const value = Math.abs(amount);
  return `${sign}$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function moneyWhole(amount) {
  const sign = amount < 0 ? '-' : '';
  return `${sign}$${Math.abs(Math.round(amount)).toLocaleString('en-US')}`;
}

export function totalIncome(state) {
  return state.income.reduce((sum, row) => sum + row.amount, 0);
}

export function totalSpending(state) {
  return state.transactions.reduce((sum, row) => sum + row.amount, 0);
}

export function spentByCategory(state) {
  const totals = {};
  for (const row of state.transactions) {
    totals[row.category] = (totals[row.category] || 0) + row.amount;
  }
  return totals;
}

export function budgetStatus(state) {
  const spent = spentByCategory(state);
  return state.budgets.map((budget) => {
    const used = spent[budget.category] || 0;
    const remaining = budget.limit - used;
    const pct = budget.limit > 0 ? (used / budget.limit) * 100 : 0;
    return { ...budget, used, remaining, pct, over: remaining < 0 };
  });
}

export function savingsRate(state) {
  const income = totalIncome(state);
  if (income <= 0) return 0;
  return ((income - totalSpending(state)) / income) * 100;
}

export function upcomingBills(state) {
  return state.bills.filter((bill) => !bill.paid);
}

export function nextId(state, prefix) {
  let n = state.transactions.length + 1;
  let id = `${prefix}-${String(n).padStart(2, '0')}`;
  while (state.transactions.some((t) => t.id === id)) {
    n += 1;
    id = `${prefix}-${String(n).padStart(2, '0')}`;
  }
  return id;
}
