/*
  Personal Expense Tracker - Browser-only app using localStorage
  Features:
  - Add, list, delete expenses with validation
  - Filters: category and date range
  - Statistics: total, count, top category, by-category breakdown
  - Bonus: CSV export + Chart.js pie chart of category spending
*/

(function(){
  const STORAGE_KEY = 'expense-tracker:expenses';

  /** @typedef {{id:string, amount:number, category:string, date:string, description:string}} Expense */

  const form = document.getElementById('expense-form');
  const amountInput = document.getElementById('amount');
  const categoryInput = document.getElementById('category');
  const dateInput = document.getElementById('date');
  const descriptionInput = document.getElementById('description');

  const filterCategory = document.getElementById('filter-category');
  const filterFrom = document.getElementById('filter-from');
  const filterTo = document.getElementById('filter-to');
  const clearFiltersBtn = document.getElementById('clear-filters');

  const tbody = document.getElementById('expenses-tbody');
  const statTotal = document.getElementById('stat-total');
  const statCount = document.getElementById('stat-count');
  const statTop = document.getElementById('stat-top');
  const exportCsvBtn = document.getElementById('export-csv');

  let expenses = loadExpenses();
  let chartRef = null;

  // Initialize date input default to today
  dateInput.max = formatDateInput(new Date());
  dateInput.value = formatDateInput(new Date());

  renderAll();

  // UI enhancement: Floating action button scrolls to the form (mobile convenience)
  const fab = document.getElementById('fab-add');
  if(fab){
    fab.addEventListener('click', ()=>{
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      amountInput.focus();
    });
  }

  // Event listeners
  form.addEventListener('submit', onSubmitExpense);
  filterCategory.addEventListener('change', renderAll);
  filterFrom.addEventListener('change', renderAll);
  filterTo.addEventListener('change', renderAll);
  clearFiltersBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    filterCategory.value = 'all';
    filterFrom.value = '';
    filterTo.value = '';
    renderAll();
  });
  exportCsvBtn.addEventListener('click', onExportCsv);

  // Core functions
  function onSubmitExpense(e){
    e.preventDefault();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;
    const description = (descriptionInput.value || '').trim();

    const valid = validateForm(amount, category, date);
    form.classList.toggle('was-validated', !valid);
    if(!valid){
      return;
    }

    const newExpense = {
      id: cryptoRandomId(),
      amount,
      category,
      date,
      description
    };

    expenses.push(newExpense);
    saveExpenses(expenses);
    form.reset();
    dateInput.max = formatDateInput(new Date());
    dateInput.value = formatDateInput(new Date());
    form.classList.remove('was-validated');
    renderAll();
  }

  function validateForm(amount, category, dateStr){
    let ok = true;

    if(!(typeof amount === 'number' && isFinite(amount) && amount > 0)){
      amountInput.classList.add('is-invalid');
      ok = false;
    } else {
      amountInput.classList.remove('is-invalid');
    }

    if(!category || category === ''){
      categoryInput.classList.add('is-invalid');
      ok = false;
    } else {
      categoryInput.classList.remove('is-invalid');
    }

    const today = new Date();
    const inputDate = dateStr ? new Date(dateStr + 'T00:00:00') : null;
    if(!inputDate || inputDate > endOfDay(today)){
      dateInput.classList.add('is-invalid');
      ok = false;
    } else {
      dateInput.classList.remove('is-invalid');
    }

    return ok;
  }

  function renderAll(){
    const filtered = applyFilters(expenses);
    renderTable(filtered);
    renderStats(filtered);
    renderChart(filtered);
  }

  function applyFilters(items){
    const cat = filterCategory.value;
    const from = filterFrom.value ? new Date(filterFrom.value + 'T00:00:00') : null;
    const to = filterTo.value ? endOfDay(new Date(filterTo.value + 'T00:00:00')) : null;

    return items.filter((x)=>{
      if(cat && cat !== 'all' && x.category !== cat) return false;
      const d = new Date(x.date + 'T00:00:00');
      if(from && d < from) return false;
      if(to && d > to) return false;
      return true;
    }).sort((a,b)=> new Date(b.date) - new Date(a.date));
  }

  function renderTable(items){
    tbody.innerHTML = '';
    if(items.length === 0){
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 5;
      td.className = 'text-center text-muted';
      td.textContent = 'No expenses found.';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    for(const exp of items){
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDisplayDate(exp.date)}</td>
        <td>${escapeHtml(exp.category)}</td>
        <td class="text-end">${formatCurrency(exp.amount)}</td>
        <td>${escapeHtml(exp.description || '')}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-danger" data-id="${exp.id}">Delete</button>
        </td>
      `;
      // UI enhancement: fade-in effect for rendered rows
      tr.classList.add('fade-in');
      tbody.appendChild(tr);
    }

    tbody.querySelectorAll('button[data-id]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-id');
        expenses = expenses.filter(e => e.id !== id);
        saveExpenses(expenses);
        renderAll();
      });
    });
  }

  function renderStats(items){
    const total = items.reduce((s,x)=> s + x.amount, 0);
    const count = items.length;
    const byCat = groupByCategory(items);
    const top = Object.entries(byCat).sort((a,b)=> b[1]-a[1])[0];
    statTotal.textContent = formatCurrency(total);
    statCount.textContent = String(count);
    statTop.textContent = top ? `${top[0]} (${formatCurrency(top[1])})` : '—';
  }

  function renderChart(items){
    const byCat = groupByCategory(items);
    const labels = Object.keys(byCat);
    const data = Object.values(byCat);

    const ctx = document.getElementById('categoryChart');
    if(!ctx){ return; }

    if(chartRef){
      chartRef.destroy();
      chartRef = null;
    }

    // UI enhancement: register datalabels plugin (if loaded) and render a smaller, labeled pie chart
    if(window.ChartDataLabels){
      Chart.register(window.ChartDataLabels);
    }

    chartRef = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            '#A5B4FC', /* indigo-200 */
            '#C7D2FE', /* indigo-200 light */
            '#FBCFE8', /* pink-200 */
            '#BBF7D0', /* green-200 */
            '#FDE68A', /* yellow-300 */
            '#FCA5A5', /* red-300 */
            '#BAE6FD', /* sky-200 */
            '#FDBA74'  /* orange-300 */
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Spending by Category' },
          datalabels: window.ChartDataLabels ? {
            color: '#1f2937',
            font: { weight: '600', size: 11 },
            formatter: (value, ctx) => {
              const total = ctx.chart.data.datasets[0].data.reduce((a,b)=>a+b,0);
              const pct = total ? (value/total*100) : 0;
              const label = ctx.chart.data.labels[ctx.dataIndex] || '';
              // Only show labels for slices >= ~6% for readability
              return pct >= 6 ? `${label}\n${pct.toFixed(0)}%` : '';
            },
            padding: 4
          } : undefined
        }
      }
    });
  }

  function onExportCsv(){
    const filtered = applyFilters(expenses);
    const header = ['Date','Category','Amount','Description'];
    const rows = filtered.map(e=> [e.date, e.category, e.amount.toFixed(2), (e.description||'').replaceAll('"','""')]);
    const csvLines = [header.join(','), ...rows.map(r=> r.map(cell => /[",\n]/.test(String(cell)) ? `"${cell}"` : String(cell)).join(','))];
    const blob = new Blob([csvLines.join('\n')], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Helpers
  function loadExpenses(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw){ return []; }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(normalizeExpense) : [];
    }catch{
      return [];
    }
  }

  function saveExpenses(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function normalizeExpense(obj){
    return {
      id: String(obj.id || cryptoRandomId()),
      amount: Number(obj.amount) || 0,
      category: String(obj.category || 'Other'),
      date: obj.date || formatDateInput(new Date()),
      description: obj.description ? String(obj.description) : ''
    };
  }

  function groupByCategory(items){
    const map = {};
    for(const x of items){
      map[x.category] = (map[x.category] || 0) + x.amount;
    }
    return map;
  }

  function formatCurrency(n){
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n || 0);
  }

  function formatDateInput(d){
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }

  function endOfDay(d){
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  }

  function formatDisplayDate(iso){
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString();
  }

  function escapeHtml(s){
    return String(s)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function cryptoRandomId(){
    if(window.crypto && crypto.getRandomValues){
      const a = new Uint32Array(4);
      crypto.getRandomValues(a);
      return Array.from(a).map(x=> x.toString(16).padStart(8,'0')).join('');
    }
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
  }
})();


