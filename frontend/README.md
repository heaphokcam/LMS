# Loan Management System UI (React + Tailwind)

Responsive bilingual UX/UI for a **bank loan system** using:
- React + Vite
- Tailwind CSS (`@tailwindcss/vite`)
- React Router DOM

## Features
- English / Khmer language toggle
- Role switcher: `CUSTOMER`, `OFFICER`, `MANAGER`, `ADMIN`
- Responsive navigation and page layouts
- Custom logo and dashboard visuals
- Midterm + Final scope screens

## Pages
- `/login`
- `/dashboard`
- `/loan-products`
- `/apply-loan`
- `/application-history`
- `/officer-review`
- `/status-tracking`
- `/approval-workflow`
- `/repayment-calculator`
- `/reporting`
- `/overdue-simulation`

## Folder Structure
```text
src/
  app/
    AppRouter.jsx
  assets/
    loan-logo.svg
  components/
    charts/
      StatusBarChart.jsx
    common/
      LanguageToggle.jsx
      Logo.jsx
      PageHeader.jsx
      ProgressBar.jsx
      RoleSelector.jsx
      StatCard.jsx
      StatusBadge.jsx
  contexts/
    AppContext.jsx
  data/
    workflowSteps.js
  i18n/
    translations.js
  layouts/
    MainLayout.jsx
  pages/
    ApplicationHistoryPage.jsx
    ApplyLoanPage.jsx
    ApprovalWorkflowPage.jsx
    DashboardPage.jsx
    LoanProductsPage.jsx
    LoginPage.jsx
    NotFoundPage.jsx
    OfficerReviewPage.jsx
    OverdueSimulationPage.jsx
    RepaymentCalculatorPage.jsx
    ReportingPage.jsx
    StatusTrackingPage.jsx
  utils/
    format.js
  App.jsx
  index.css
  main.jsx
```

## Run
```bash
npm install
npm run dev
```

## Validation
```bash
npm run lint
npm run build
```
