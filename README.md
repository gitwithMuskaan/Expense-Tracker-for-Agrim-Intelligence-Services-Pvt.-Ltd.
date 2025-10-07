# Personal Expense Tracker

A lightweight, browser-only expense tracker built for the Agrim Intelligence Services Private Limited AI-Powered Development Assignment.

- Frontend: HTML, CSS, JavaScript
- UI: Bootstrap 5
- Storage: localStorage
- Bonus: CSV export + Chart.js pie chart

## How to Run

1. Download or clone this repository.
2. Open `index.html` in any modern browser (no build step required).

## Features Implemented

- Add expenses with amount, category, date, and optional description
- Inline form validation (positive amount, category required, no future date)
- Persistent storage using `localStorage`
- Expense list with delete per item
- Filters: category and date range (from/to), clear option
- Statistics: total spending, number of transactions, top category, per-category spending
- Bonus features:
  - CSV export of filtered expenses
  - Chart.js pie chart for category spending
- Responsive and clean Bootstrap UI with subtle hover interactions

## Screenshots

See `/screenshots/`:
- Adding an expense
- Filtering view
- Statistics with chart

## Folder Structure

```
expense-tracker/
├── index.html
├── style.css
├── script.js
├── README.md
└── screenshots/
```

## Cursor Prompts Used

1. "Create a Bootstrap-based layout with a form, filters, stats, table, and chart canvas for an expense tracker."
2. "Implement localStorage CRUD for expenses and render a table with delete actions and validation."
3. "Add category and date-range filtering functions and wire them to inputs for dynamic updates."
4. "Compute and display statistics (total, count, top category) and render a Chart.js pie chart."
5. "Add CSV export for filtered expenses and polish responsive styles."

## How Cursor Helped

- Structured the implementation into atomic tasks and iterated quickly on UI and logic.
- Parallel file edits with immediate previews improved productivity.
- Automated code quality checks and quick adjustments reduced regressions.

## Notable Code Decisions

- `localStorage` key namespaced as `expense-tracker:expenses` for clarity.
- Validation uses basic checks and Bootstrap invalid styles; future-proofed for extension.
- Chart rebuilds on every filter change for correctness and simplicity.
- CSV export respects current filters and properly escapes cells with quotes or commas.

## Challenges & Solutions

- Date validation and timezones: normalized comparisons using `endOfDay` and `YYYY-MM-DD` inputs to avoid off-by-one errors.
- Keeping chart in sync with filters: destroyed and recreated the chart on each render cycle.
- Ensuring robust persistence: normalized records on load to guard against malformed data.

## Bonus Feature Explanation

- Implemented CSV export for all (filtered) expenses via a generated Blob download.
- Implemented a category spending pie chart with Chart.js for quick visual insights.

## Time Spent

~3–4 hours including UI, logic, testing validations, and documentation.

## License

MIT
