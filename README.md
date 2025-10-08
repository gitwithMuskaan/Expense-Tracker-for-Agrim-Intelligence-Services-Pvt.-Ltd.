# Personal Expense Tracker

A lightweight, browser-only expense tracker built for the Agrim Intelligence Services Private Limited AI-Powered Development Assignment.

- Frontend: HTML, CSS, JavaScript (no build tools)
- UI: Bootstrap 5 + Bootstrap Icons, custom CSS
- Charts: Chart.js + chartjs-plugin-datalabels (CDN)
- Storage: localStorage (persists in the browser)
- Bonus: CSV export + category pie chart with in-slice labels

## Quick Start

1. Download or clone this repository.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).
   - Internet connection is needed for CDN assets (Bootstrap, Icons, Chart.js, DataLabels).
   - No backend, server, or install required.

## What You Can Do

- Add an expense with amount, category, date, and optional description
- View expenses in a responsive table with alternating rows and hover effects
- Filter by category and date range (from/to) + Clear filters
- See statistics: total spending, number of transactions, and top category
- Visualize category spending with a compact pie chart (with labels)
- Delete individual expenses (removes from localStorage)
- Export the (filtered) list to CSV

## UI/UX Redesign (What changed and why)

- Centered content inside a clean `app-card` container with a subtle shadow for focus.
- Soft gradient page background for modern aesthetics.
- Sectioned layout with clear hierarchy:
  - Header + tagline: “Track your spending smartly.”
  - Form in a responsive grid (2 columns on large screens, 1 on small).
  - Stats as small, aligned mini-cards (Total, Transactions, Top Category).
  - Compact chart section titled “Spending by Category”.
  - Expense table with striped rows and refined spacing.
- Buttons and inputs:
  - Primary action uses a gradient button with hover lift.
  - Inputs get a subtle focus ring and rounded corners.
- Interactions:
  - Mobile floating “Add Expense” button scrolls to the form.
  - Row fade-in animation to emphasize newly rendered content.
- Colors and spacing: pastel chart palette, balanced paddings, rounded corners (12–16px).

## Validation Rules (Inline)

- Amount: must be a positive number.
- Category: required (Food, Transport, Entertainment, Bills, Shopping, Other).
- Date: required and cannot be in the future.
- Description: optional (sanitized for display).

## Data Model

Each expense is stored in localStorage under the key `expense-tracker:expenses` as an array of objects:

```json
{
  "id": "string",
  "amount": 349.50,
  "category": "Food",
  "date": "YYYY-MM-DD",
  "description": "Optional text"
}
```

Notes:
- IDs are generated using Web Crypto (if available) else a fallback.
- Dates are compared with normalized day boundaries to avoid timezone issues.

## Filtering & Statistics

- Filters (category, from, to) apply instantly to the list, stats, and chart.
- Statistics include:
  - Total amount spent across filtered items
  - Number of transactions
  - Top category by spend (name + amount)

## Chart Details (Chart.js)

- Type: pie chart, approx 250×250, constrained in a centered wrapper.
- Title: “Spending by Category”.
- Legend: bottom.
- Pastel color palette for readability.
- Data labels (via chartjs-plugin-datalabels): shows category and percentage inside slices (hidden for very small slices < ~6% for legibility).

## CSV Export

- The “Export CSV” button downloads the currently filtered expenses as `expenses.csv`.
- Properly escapes commas and quotes.

## Accessibility & Responsiveness

- Responsive layout using Bootstrap grid and utilities.
- Color contrast and focus states on inputs and primary actions.
- Works well on mobile; includes a floating action button for quick add.

## Folder Structure

```
expense-tracker/
├── index.html         # Markup, layout, and section structure
├── style.css          # Theme, spacing, animations, and component styling
├── script.js          # LocalStorage, rendering, filters, statistics, chart config
├── README.md          # You are here
└── screenshots/       # Sample visuals (placeholders included)
```

## How to Test

1. Add several expenses across different categories and dates.
2. Verify validation (e.g., negative amount or future date should fail).
3. Apply category and date filters and confirm the table, stats, and chart update.
4. Delete a row and confirm it disappears and stats update.
5. Click “Export CSV” and open the file to verify contents and escaping.
6. Refresh the page and confirm your data persists (localStorage).

## Example Scenarios (Edge Cases Considered)

- All expenses on a single day: date filters should still work.
- No expenses after filtering: table shows an empty state, chart clears.
- Many small slices in chart: labels appear only for slices ≥ ~6% to avoid clutter.
- Corrupted localStorage: loader normalizes and falls back safely.

## Implementation Notes

- Stateless rendering functions: `renderTable`, `renderStats`, `renderChart` are called from `renderAll()` to keep UI consistent.
- Chart is re-created when filters change to ensure accurate labels and layout.
- DOM updates are batched per render; event listeners are bound after table rows render.

## Prompts Used in Cursor (Examples)

1. "Create a Bootstrap-based layout with a form, filters, stats, table, and chart canvas for an expense tracker."
2. "Implement localStorage CRUD for expenses and render a table with delete actions and validation."
3. "Add category and date-range filtering functions and wire them to inputs for dynamic updates."
4. "Compute and display statistics (total, count, top category) and render a Chart.js pie chart."
5. "Redesign the UI with a centered card container, gradient background, stat mini-cards, modern inputs, and a smaller pie chart with datalabels."
6. "Add CSV export and ensure escaping; add mobile FAB and row fade-in."

## How Cursor Helped

- Structured the work into atomic TODOs and iterated quickly on layout and logic.
- Parallel file edits with instant preview improved design iteration speed.
- Automated checks helped keep code clean and consistent.

## Challenges & Solutions

- Timezone/date edge cases: compared using `YYYY-MM-DD` inputs and `endOfDay` to avoid off-by-one errors.
- Keeping chart labels readable: added datalabels and hid very small slice labels.
- Maintaining performance while re-rendering: kept rendering functions focused and lightweight.

## Bonus Features Implemented

- CSV export for filtered results.
- Chart.js pie chart with in-slice labels via DataLabels plugin.

## Time Spent

~3–4 hours including UI redesign, logic, validation tests, and documentation.

## Roadmap (Future Improvements)

- Inline editing of existing expenses
- Budget limits and alerts
- Text search in descriptions
- Recurring expense templates
- Multi-currency with exchange rates

## License

MIT
