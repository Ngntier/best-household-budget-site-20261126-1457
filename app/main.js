// Router + event wiring for the Hartley household budget site.
//
//   #/                Dashboard
//   #/transactions    Transactions (add / edit / delete / filter)
//   #/budgets         Budgets by category (editable limits)
//   #/bills           Bills & recurring (mark paid, add bill)
//   #/goals           Savings goals (contributions, add goal)
//   #/reports         Reports (trend chart + category breakdown)
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { CATEGORIES } from './data.js';
import { categoryById, loadState, money, nextId, resetState, saveState } from './state.js';
import { afterRender, dashboard, transactionsView, budgetsView, billsView, goalsView, reportsView } from './views.js';

const app = document.getElementById('app');
let state = loadState();
let txFilter = { query: '', category: 'all' };

const ROUTES = {
  '#/': dashboard,
  '#/transactions': (s) => transactionsView(s, txFilter),
  '#/budgets': budgetsView,
  '#/bills': billsView,
  '#/goals': goalsView,
  '#/reports': reportsView,
};

const TITLES = {
  '#/': 'Dashboard',
  '#/transactions': 'Transactions',
  '#/budgets': 'Budgets',
  '#/bills': 'Bills & recurring',
  '#/goals': 'Savings goals',
  '#/reports': 'Reports',
};

function currentRoute() {
  const hash = location.hash || '#/';
  if (hash.startsWith('#/transactions')) return '#/transactions';
  if (hash.startsWith('#/budgets')) return '#/budgets';
  if (hash.startsWith('#/bills')) return '#/bills';
  if (hash.startsWith('#/goals')) return '#/goals';
  if (hash.startsWith('#/reports')) return '#/reports';
  return '#/';
}

function render() {
  window.__shotReady = false;
  const route = currentRoute();
  document.title = `${TITLES[route]} | Hartley Household Budget`;
  app.innerHTML = ROUTES[route](state);
  bindForms(route);
  afterRender(route);
  window.scrollTo(0, 0);
}

function rerender() {
  saveState(state);
  render();
}

function formData(form) {
  const data = {};
  for (const [key, value] of new FormData(form).entries()) data[key] = String(value);
  return data;
}

function statusText(element, message) {
  if (element) element.textContent = message;
}

// --- One delegated click handler, attached once at boot --------------------
// (render() replaces #app's innerHTML but not #app itself, so a handler
// bound here never stacks up.)

app.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'clear-filter') {
    txFilter = { query: '', category: 'all' };
    render();
    return;
  }

  if (action === 'delete-tx') {
    const found = state.transactions.find((t) => t.id === id);
    if (!found) return;
    if (!window.confirm(`Delete “${found.description}” (${money(found.amount)})?`)) return;
    state.transactions = state.transactions.filter((t) => t.id !== id);
    rerender();
    return;
  }

  if (action === 'edit-tx') {
    const found = state.transactions.find((t) => t.id === id);
    const editSlot = document.getElementById('edit-slot');
    if (!found || !editSlot) return;
    editSlot.innerHTML = `<section class="card">
      <h2>Edit transaction</h2>
      <form id="edit-tx-form" class="form-grid">
        <label>Date <input type="date" name="date" value="${found.date}" required></label>
        <label>Description <input type="text" name="description" value="${found.description.replace(/"/g, '&quot;')}" required maxlength="80"></label>
        <label>Category <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}" ${c.id === found.category ? 'selected' : ''}>${c.label}</option>`).join('')}</select></label>
        <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" value="${found.amount}" required></label>
        <label>Note <input type="text" name="note" value="${(found.note || '').replace(/"/g, '&quot;')}" maxlength="80"></label>
        <span></span><button type="submit" class="button primary">Save changes</button>
        <button type="button" class="button ghost" data-action="cancel-edit">Cancel</button>
      </form>
    </section>`;
    editSlot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('edit-tx-form').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = formData(ev.target);
      const amount = Number(data.amount);
      if (!data.description.trim() || !Number.isFinite(amount) || amount <= 0) return;
      Object.assign(found, {
        date: data.date,
        description: data.description.trim(),
        category: data.category,
        amount: Math.round(amount * 100) / 100,
        note: (data.note || '').trim(),
      });
      rerender();
    });
    return;
  }

  if (action === 'cancel-edit') {
    const editSlot = document.getElementById('edit-slot');
    if (editSlot) editSlot.innerHTML = '';
    return;
  }

  if (action === 'toggle-bill') {
    const bill = state.bills.find((b) => b.id === id);
    if (!bill) return;
    bill.paid = !bill.paid;
    rerender();
  }
});

// --- Forms, bound fresh after each render (forms are replaced each time) ---

function bindForms(route) {
  if (route === '#/transactions') {
    const addForm = document.getElementById('add-tx');
    if (addForm) {
      addForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = formData(addForm);
        const amount = Number(data.amount);
        if (!data.description.trim() || !Number.isFinite(amount) || amount <= 0) {
          statusText(document.getElementById('add-tx-status'), 'Give the transaction a description and an amount over $0.');
          return;
        }
        state.transactions.push({
          id: nextId(state, 't'),
          date: data.date || '2026-11-26',
          description: data.description.trim(),
          category: CATEGORIES.some((c) => c.id === data.category) ? data.category : 'other',
          amount: Math.round(amount * 100) / 100,
          note: (data.note || '').trim(),
        });
        rerender();
        statusText(document.getElementById('add-tx-status'), 'Transaction added.');
      });
    }
    const filterForm = document.getElementById('tx-filter');
    if (filterForm) {
      filterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = formData(filterForm);
        txFilter = { query: (data.query || '').trim(), category: data.category || 'all' };
        render();
      });
    }
  }

  if (route === '#/budgets') {
    document.querySelectorAll('.limit-form').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const limit = Number(formData(form).limit);
        if (!Number.isFinite(limit) || limit < 0) return;
        const budget = state.budgets.find((b) => b.category === form.dataset.category);
        if (!budget) return;
        budget.limit = Math.round(limit);
        saveState(state);
        render();
        const note = document.querySelector(`.limit-form[data-category="${budget.category}"] .form-status`);
        statusText(note, `Limit saved — ${categoryById(budget.category).label} is now $${budget.limit}.`);
      });
    });
  }

  if (route === '#/bills') {
    const addForm = document.getElementById('add-bill');
    if (addForm) {
      addForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = formData(addForm);
        const amount = Number(data.amount);
        if (!data.name.trim() || !Number.isFinite(amount) || amount <= 0) {
          statusText(document.getElementById('add-bill-status'), 'Give the bill a name and an amount over $0.');
          return;
        }
        state.bills.push({
          id: `bill-${Date.now().toString(36)}`,
          name: data.name.trim(),
          amount: Math.round(amount * 100) / 100,
          due: data.due || '2026-11-30',
          frequency: data.frequency || 'Monthly',
          category: data.category || 'other',
          paid: false,
          autopay: false,
        });
        rerender();
        statusText(document.getElementById('add-bill-status'), 'Bill added.');
      });
    }
  }

  if (route === '#/goals') {
    document.querySelectorAll('.contribute-form').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const amount = Number(formData(form).amount);
        const goal = state.goals.find((g) => g.id === form.dataset.goal);
        if (!goal || !Number.isFinite(amount) || amount <= 0) {
          statusText(form.querySelector('.form-status'), 'Enter an amount over $0.');
          return;
        }
        goal.saved = Math.round((goal.saved + amount) * 100) / 100;
        state.transactions.push({
          id: nextId(state, 't'),
          date: '2026-11-26',
          description: `Savings transfer — ${goal.name}`,
          category: 'savings',
          amount: Math.round(amount * 100) / 100,
          note: 'Added from the goals page',
        });
        rerender();
        const note = document.querySelector(`.contribute-form[data-goal="${goal.id}"] .form-status`);
        statusText(note, `Added ${money(amount)} to ${goal.name}.`);
      });
    });
    const addForm = document.getElementById('add-goal');
    if (addForm) {
      addForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = formData(addForm);
        const target = Number(data.target);
        const saved = Number(data.saved) || 0;
        if (!data.name.trim() || !Number.isFinite(target) || target <= 0) {
          statusText(document.getElementById('add-goal-status'), 'Give the goal a name and a target over $0.');
          return;
        }
        state.goals.push({
          id: `goal-${Date.now().toString(36)}`,
          name: data.name.trim(),
          target: Math.round(target),
          saved: Math.round(saved),
          note: 'Added by the household.',
        });
        rerender();
        statusText(document.getElementById('add-goal-status'), 'Goal added.');
      });
    }
  }
}

// --- Boot ------------------------------------------------------------------

document.getElementById('reset-data').addEventListener('click', () => {
  if (!window.confirm('Reset all budget data to the original November figures? Your changes will be lost.')) return;
  state = resetState();
  txFilter = { query: '', category: 'all' };
  render();
});

window.addEventListener('hashchange', render);
render();
