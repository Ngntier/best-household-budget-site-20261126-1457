// Page renderers: each takes the current state and returns HTML. Event
// wiring lives in main.js, which listens on the #app container.

import { CATEGORIES, HOUSEHOLD, MONTHLY_HISTORY } from './data.js';
import { donutSvg, drawTrendChart } from './charts.js';
import {
  budgetStatus,
  categoryById,
  money,
  moneyWhole,
  savingsRate,
  spentByCategory,
  totalIncome,
  totalSpending,
} from './state.js';

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function nav(active) {
  const links = [
    ['#/', 'Dashboard'],
    ['#/transactions', 'Transactions'],
    ['#/budgets', 'Budgets'],
    ['#/bills', 'Bills & recurring'],
    ['#/goals', 'Savings goals'],
    ['#/reports', 'Reports'],
  ];
  return `<nav class="main-nav" aria-label="Sections">${links
    .map(([href, label]) => `<a href="${href}" class="${href === active ? 'active' : ''}">${label}</a>`)
    .join('')}</nav>`;
}

function categoryOptions(selected) {
  return CATEGORIES.map(
    (c) => `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${escapeHtml(c.label)}</option>`,
  ).join('');
}

function progressBar(pct, over) {
  const clamped = Math.min(100, Math.max(0, pct));
  return `<div class="bar" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><span class="${over ? 'over' : ''}" style="width:${clamped}%"></span></div>`;
}

export function dashboard(state) {
  const income = totalIncome(state);
  const spending = totalSpending(state);
  const left = income - spending;
  const rate = savingsRate(state);
  const spent = spentByCategory(state);
  const budgets = budgetStatus(state);
  const overCount = budgets.filter((b) => b.over).length;
  const unpaid = state.bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((sum, b) => sum + b.amount, 0);
  const recent = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const topCats = Object.entries(spent)
    .map(([id, value]) => ({ ...categoryById(id), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const donutParts = Object.entries(spent)
    .map(([id, value]) => ({ value, color: categoryById(id).color }));

  return `${nav('#/')}
  <h1>${escapeHtml(HOUSEHOLD.month)} budget</h1>
  <p class="lede">One household, four people, one shared pot. Income, spending and savings for the Hartley family — updated as you add transactions.</p>

  <section class="cards" aria-label="Monthly summary">
    <article class="card stat"><span class="stat-label">Income so far</span><strong class="stat-value income">${moneyWhole(income)}</strong><span class="stat-note">5 paydays &amp; side work</span></article>
    <article class="card stat"><span class="stat-label">Spent so far</span><strong class="stat-value spent">${moneyWhole(spending)}</strong><span class="stat-note">${state.transactions.length} transactions</span></article>
    <article class="card stat"><span class="stat-label">Left to spend</span><strong class="stat-value left">${moneyWhole(left)}</strong><span class="stat-note">of ${moneyWhole(income)} coming in</span></article>
    <article class="card stat"><span class="stat-label">Savings rate</span><strong class="stat-value rate">${rate.toFixed(1)}%</strong><span class="stat-note">${moneyWhole(left)} kept this month</span></article>
  </section>

  <div class="two-col">
    <section class="card" aria-label="Where the money went">
      <h2>Where the money went</h2>
      <div class="donut-wrap">${donutSvg(donutParts, 220)}
      <ul class="legend">${topCats.map((c) => `<li><span class="swatch" style="background:${c.color}"></span>${escapeHtml(c.label)} <strong>${moneyWhole(c.value)}</strong></li>`).join('')}</ul></div>
      <p><a class="button" href="#/reports">See the full report →</a></p>
    </section>

    <section class="card" aria-label="Budget watch">
      <h2>Budget watch</h2>
      ${overCount > 0
        ? `<p class="alert">${overCount} categor${overCount === 1 ? 'y is' : 'ies are'} over budget — utilities, transport and kids &amp; school all ran past their limits.</p>`
        : '<p class="ok">Every category is inside its budget.</p>'}
      <ul class="budget-mini">${budgets.slice(0, 5).map((b) => {
        const cat = categoryById(b.category);
        return `<li><span>${escapeHtml(cat.label)}</span> ${progressBar(b.pct, b.over)} <strong>${moneyWhole(b.used)} / ${moneyWhole(b.limit)}</strong></li>`;
      }).join('')}</ul>
      <p><a class="button" href="#/budgets">Manage all budgets →</a></p>
    </section>
  </div>

  <div class="two-col">
    <section class="card" aria-label="Bills coming up">
      <h2>Bills coming up</h2>
      ${unpaid.length === 0
        ? '<p class="ok">All November bills are paid. Well done.</p>'
        : `<p>${unpaid.length} bill${unpaid.length === 1 ? '' : 's'} still to pay, totalling <strong>${moneyWhole(unpaidTotal)}</strong>.</p>
        <ul class="bill-mini">${unpaid.map((b) => `<li><span>${escapeHtml(b.name)}</span><span>due ${escapeHtml(b.due.slice(5))}</span><strong>${moneyWhole(b.amount)}</strong></li>`).join('')}</ul>`}
      <p><a class="button" href="#/bills">See all bills →</a></p>
    </section>

    <section class="card" aria-label="Latest spending">
      <h2>Latest spending</h2>
      <ul class="tx-mini">${recent.map((t) => {
        const cat = categoryById(t.category);
        return `<li><span class="cat-dot" style="background:${cat.color}" title="${escapeHtml(cat.label)}"></span><span>${escapeHtml(t.description)}</span><span class="muted">${escapeHtml(t.date.slice(5))}</span><strong>${money(t.amount)}</strong></li>`;
      }).join('')}</ul>
      <p><a class="button" href="#/transactions">All transactions →</a></p>
    </section>
  </div>

  <section class="card tip">
    <h2>How this household stays on track</h2>
    <p>Payday money moves first: rent and the $400 emergency-fund transfer leave on the 1st, before anything else can be spent. Groceries are shopped once a week with a list, and the “dining out” jar is capped at $180 — when it runs out, dinner is whatever is already in the cupboard.</p>
  </section>`;
}

export function transactionsView(state, filter) {
  const query = (filter.query || '').toLowerCase();
  const catFilter = filter.category || 'all';
  let rows = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  if (catFilter !== 'all') rows = rows.filter((t) => t.category === catFilter);
  if (query) {
    rows = rows.filter(
      (t) => t.description.toLowerCase().includes(query) || (t.note || '').toLowerCase().includes(query),
    );
  }
  // Running balance: start from income, subtract spending in date order.
  const chronological = [...state.transactions].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const balanceById = {};
  let running = totalIncome(state);
  for (const t of chronological) {
    running -= t.amount;
    balanceById[t.id] = running;
  }
  const shownTotal = rows.reduce((sum, t) => sum + t.amount, 0);

  return `${nav('#/transactions')}
  <h1>Transactions</h1>
  <p class="lede">Every dollar out, newest first. Add a purchase, fix a mistake, or search for a shop — the running balance updates as you go.</p>

  <section class="card">
    <h2>Add a transaction</h2>
    <form id="add-tx" class="form-grid">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>Description <input type="text" name="description" placeholder="e.g. Corner Market — weekly shop" required maxlength="80"></label>
      <label>Category <select name="category">${categoryOptions('groceries')}</select></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Note <input type="text" name="note" placeholder="Optional note" maxlength="80"></label>
      <span></span><button type="submit" class="button primary">Add transaction</button>
    </form>
    <p class="form-status" id="add-tx-status" role="status"></p>
  </section>

  <section class="card">
    <h2>Filter</h2>
    <form id="tx-filter" class="form-grid">
      <label>Search <input type="search" name="query" value="${escapeHtml(filter.query || '')}" placeholder="Search description or note"></label>
      <label>Category <select name="category"><option value="all">All categories</option>${categoryOptions(catFilter)}</select></label>
      <span></span><button type="submit" class="button">Apply filter</button>
      <button type="button" class="button ghost" data-action="clear-filter">Clear</button>
    </form>
    <p class="muted">${rows.length} transaction${rows.length === 1 ? '' : 's'} shown · ${money(shownTotal)} in this view</p>
  </section>

  <section class="card table-card">
    <table>
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th class="num">Balance after</th><th></th></tr></thead>
      <tbody>
      ${rows.length === 0
        ? '<tr><td colspan="6">Nothing matches — try a different search or category.</td></tr>'
        : rows.map((t) => {
          const cat = categoryById(t.category);
          return `<tr>
            <td>${escapeHtml(t.date)}</td>
            <td>${escapeHtml(t.description)}${t.note ? `<br><span class="muted">${escapeHtml(t.note)}</span>` : ''}</td>
            <td><span class="cat-dot" style="background:${cat.color}"></span> ${escapeHtml(cat.label)}</td>
            <td class="num">${money(t.amount)}</td>
            <td class="num">${money(balanceById[t.id])}</td>
            <td class="row-actions"><button type="button" class="link-btn" data-action="edit-tx" data-id="${t.id}">Edit</button> <button type="button" class="link-btn danger" data-action="delete-tx" data-id="${t.id}">Delete</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </section>

  <div id="edit-slot"></div>`;
}

export function budgetsView(state) {
  const budgets = budgetStatus(state);
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalUsed = budgets.reduce((sum, b) => sum + b.used, 0);
  return `${nav('#/budgets')}
  <h1>Budgets by category</h1>
  <p class="lede">Limits the household set for November. Change a limit and the bar moves at once — the total below stays honest about what is left.</p>
  <section class="card">
    <p class="summary-line">Total budgeted <strong>${moneyWhole(totalLimit)}</strong> · spent <strong>${moneyWhole(totalUsed)}</strong> · remaining <strong>${moneyWhole(totalLimit - totalUsed)}</strong></p>
    <ul class="budget-list">
    ${budgets.map((b) => {
      const cat = categoryById(b.category);
      return `<li class="budget-row">
        <div class="budget-head"><span class="cat-dot" style="background:${cat.color}"></span><strong>${escapeHtml(cat.label)}</strong>
        <span class="budget-figures">${moneyWhole(b.used)} of ${moneyWhole(b.limit)} · ${b.over ? `<span class="over-text">over by ${moneyWhole(-b.remaining)}</span>` : `${moneyWhole(b.remaining)} left`}</span></div>
        ${progressBar(b.pct, b.over)}
        <form class="limit-form" data-category="${b.category}">
          <label>Monthly limit ($) <input type="number" name="limit" min="0" step="1" value="${b.limit}" required></label>
          <button type="submit" class="button small">Save limit</button>
          <span class="form-status" role="status"></span>
        </form>
      </li>`;
    }).join('')}
    </ul>
  </section>
  <section class="card tip">
    <h2>How the limits were set</h2>
    <p>Groceries come from the last three months’ average ($712) rounded up a little; transport from the bus passes plus two tanks of petrol; dining out is the one line the household deliberately keeps small — $180 buys about four takeaways, and the fifth has to wait for December.</p>
  </section>`;
}

export function billsView(state) {
  const paid = state.bills.filter((b) => b.paid);
  const unpaid = state.bills.filter((b) => !b.paid);
  const paidTotal = paid.reduce((sum, b) => sum + b.amount, 0);
  const unpaidTotal = unpaid.reduce((sum, b) => sum + b.amount, 0);
  const row = (b) => `<li class="bill-row">
    <div><strong>${escapeHtml(b.name)}</strong><br><span class="muted">${escapeHtml(b.frequency)} · ${escapeHtml(categoryById(b.category).label)}${b.autopay ? ' · autopay' : ''}</span></div>
    <div class="bill-due">Due ${escapeHtml(b.due)}</div>
    <strong>${moneyWhole(b.amount)}</strong>
    <button type="button" class="button small ${b.paid ? 'ghost' : 'primary'}" data-action="toggle-bill" data-id="${b.id}">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button>
  </li>`;
  return `${nav('#/bills')}
  <h1>Bills &amp; recurring</h1>
  <p class="lede">Everything that repeats, in one place. Mark a bill paid when the money leaves, and the “still to pay” total drops at once.</p>
  <section class="card">
    <p class="summary-line">Paid this month <strong>${moneyWhole(paidTotal)}</strong> · still to pay <strong>${moneyWhole(unpaidTotal)}</strong></p>
    <h2>Still to pay (${unpaid.length})</h2>
    ${unpaid.length === 0 ? '<p class="ok">Nothing left to pay this month.</p>' : `<ul class="bill-list">${unpaid.map(row).join('')}</ul>`}
    <h2>Paid (${paid.length})</h2>
    <ul class="bill-list">${paid.map(row).join('')}</ul>
  </section>
  <section class="card">
    <h2>Add a recurring bill</h2>
    <form id="add-bill" class="form-grid">
      <label>Bill name <input type="text" name="name" placeholder="e.g. Water & sewer" required maxlength="60"></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Due date <input type="date" name="due" value="2026-11-30" required></label>
      <label>Category <select name="category">${categoryOptions('utilities')}</select></label>
      <label>Frequency <select name="frequency"><option>Monthly</option><option>Quarterly</option><option>Yearly</option></select></label>
      <span></span><button type="submit" class="button primary">Add bill</button>
    </form>
    <p class="form-status" id="add-bill-status" role="status"></p>
  </section>`;
}

export function goalsView(state) {
  const totalSaved = state.goals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = state.goals.reduce((sum, g) => sum + g.target, 0);
  return `${nav('#/goals')}
  <h1>Savings goals</h1>
  <p class="lede">Money with a job to do. ${moneyWhole(totalSaved)} saved toward ${moneyWhole(totalTarget)} of goals — add a contribution whenever there is spare cash.</p>
  <section class="goal-grid">
  ${state.goals.map((g) => {
    const pct = g.target > 0 ? (g.saved / g.target) * 100 : 0;
    const done = g.saved >= g.target;
    return `<article class="card goal-card">
      <h2>${escapeHtml(g.name)}</h2>
      <p class="muted">${escapeHtml(g.note)}</p>
      <p class="goal-figures"><strong>${moneyWhole(g.saved)}</strong> of ${moneyWhole(g.target)} · ${Math.round(pct)}%</p>
      ${progressBar(pct, false)}
      ${done ? '<p class="ok">Goal reached — nicely done.</p>' : `<p>${moneyWhole(g.target - g.saved)} to go.</p>`}
      <form class="contribute-form" data-goal="${g.id}">
        <label>Add contribution ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
        <button type="submit" class="button small primary">Add to goal</button>
        <span class="form-status" role="status"></span>
      </form>
    </article>`;
  }).join('')}
  </section>
  <section class="card">
    <h2>Add a new goal</h2>
    <form id="add-goal" class="form-grid">
      <label>Goal name <input type="text" name="name" placeholder="e.g. New washing machine" required maxlength="60"></label>
      <label>Target ($) <input type="number" name="target" min="1" step="1" placeholder="1000" required></label>
      <label>Already saved ($) <input type="number" name="saved" min="0" step="1" value="0"></label>
      <span></span><button type="submit" class="button primary">Add goal</button>
    </form>
    <p class="form-status" id="add-goal-status" role="status"></p>
  </section>`;
}

export function reportsView(state) {
  const spent = spentByCategory(state);
  const parts = Object.entries(spent)
    .map(([id, value]) => ({ ...categoryById(id), value }))
    .sort((a, b) => b.value - a.value);
  const total = parts.reduce((sum, c) => sum + c.value, 0);
  const income = totalIncome(state);
  const top = parts[0];
  const dining = spent.dining || 0;
  return `${nav('#/reports')}
  <h1>Reports — November 2026</h1>
  <p class="lede">Six months of income against spending, and where November’s money actually went. The numbers below are computed live from the transactions you see on this site.</p>

  <section class="card">
    <h2>Income vs spending — last six months</h2>
    <canvas id="trend-chart" width="860" height="360" aria-label="Bar chart of monthly income and spending"></canvas>
    <table class="history-table">
      <thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spending</th><th class="num">Kept</th></tr></thead>
      <tbody>${MONTHLY_HISTORY.map((m) => `<tr><td>${m.month}</td><td class="num">${moneyWhole(m.income)}</td><td class="num">${moneyWhole(m.spending)}</td><td class="num">${moneyWhole(m.income - m.spending)}</td></tr>`).join('')}</tbody>
    </table>
  </section>

  <div class="two-col">
    <section class="card">
      <h2>Spending by category</h2>
      <div class="donut-wrap">${donutSvg(parts.map((c) => ({ value: c.value, color: c.color })), 220)}
      <ul class="legend">${parts.map((c) => `<li><span class="swatch" style="background:${c.color}"></span>${escapeHtml(c.label)} <strong>${moneyWhole(c.value)}</strong> · ${((c.value / total) * 100).toFixed(1)}%</li>`).join('')}</ul></div>
    </section>
    <section class="card">
      <h2>What the numbers say</h2>
      <ul class="insights">
        <li><strong>${escapeHtml(top.label)}</strong> is the biggest line at ${moneyWhole(top.value)} — ${((top.value / total) * 100).toFixed(0)}% of November spending. Rent is fixed, so the levers are elsewhere.</li>
        <li>Groceries are running at ${moneyWhole(spent.groceries || 0)} against a $720 limit — on track if the last weekly shop stays under $75.</li>
        <li>Dining out (${moneyWhole(dining)}) is the easiest saving to find: one fewer takeaway a week frees about $120 a month.</li>
        <li>Income of ${moneyWhole(income)} against spending of ${moneyWhole(totalSpending(state))} leaves a ${savingsRate(state).toFixed(1)}% savings rate — above the household’s 15% target.</li>
        <li>Every bill due before the 25th is paid; only gas ($58) and the gym ($36) remain.</li>
      </ul>
      <p><a class="button" href="#/budgets">Adjust the budgets →</a></p>
    </section>
  </div>`;
}

// Called after a view is inserted, to draw canvases that need a live element.
export function afterRender(route) {
  if (route === '#/reports') {
    const canvas = document.getElementById('trend-chart');
    if (canvas) drawTrendChart(canvas, MONTHLY_HISTORY);
  }
  window.__shotReady = true;
}
