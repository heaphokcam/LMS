import { Outlet, redirect, Route, RootRoute, Router } from '@tanstack/react-router'
import { getRolesAllowedForPath } from '../config/navConfig'
import MainLayout from '../layouts/MainLayout'
import { readStoredToken, readStoredWorkspaceRole } from '../utils/sessionRole'
import ApplicationHistoryPage from '../pages/ApplicationHistoryPage'
import ApplyLoanPage from '../pages/ApplyLoanPage'
import CustomerListPage from '../pages/CustomerListPage'
import ApprovalWorkflowPage from '../pages/ApprovalWorkflowPage'
import DashboardPage from '../pages/DashboardPage'
import LoanProductsPage from '../pages/LoanProductsPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import LogoutPage from '../pages/LogoutPage'
import NotFoundPage from '../pages/NotFoundPage'
import DisbursementPage from '../pages/DisbursementPage'
import OfficerReviewPage from '../pages/OfficerReviewPage'
import OverdueSimulationPage from '../pages/OverdueSimulationPage'
import RepaymentCalculatorPage from '../pages/RepaymentCalculatorPage'
import ReportingPage from '../pages/ReportingPage'
import StatusTrackingPage from '../pages/StatusTrackingPage'
import TeamPage from '../pages/TeamPage'
import UsersRolesPage from '../pages/UsersRolesPage'

const rootRoute = new RootRoute({
  component: () => <Outlet />,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/login' })
  },
})

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const mainLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'main-layout',
  component: MainLayout,
  beforeLoad: ({ location }) => {
    const token = readStoredToken()
    if (!token) {
      throw redirect({ to: '/login' })
    }
    const pathname = location.pathname
    const allowed = getRolesAllowedForPath(pathname)
    if (allowed) {
      const role = readStoredWorkspaceRole()
      if (!allowed.includes(role)) {
        throw redirect({ to: '/dashboard' })
      }
    }
  },
})

const dashboardRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const loanProductsRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/loan-products',
  component: LoanProductsPage,
})

const customersRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/customers',
  component: CustomerListPage,
})

const applyLoanRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/apply-loan',
  component: ApplyLoanPage,
})

const applicationHistoryRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/application-history',
  component: ApplicationHistoryPage,
})

const officerReviewRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/officer-review',
  component: OfficerReviewPage,
})

const statusTrackingRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/status-tracking',
  component: StatusTrackingPage,
})

const disbursementRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/disbursement',
  component: DisbursementPage,
})

const approvalWorkflowRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/approval-workflow',
  component: ApprovalWorkflowPage,
})

const repaymentCalculatorRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/repayment-calculator',
  component: RepaymentCalculatorPage,
})

const reportingRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/reporting',
  component: ReportingPage,
})

const overdueSimulationRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/overdue-simulation',
  component: OverdueSimulationPage,
})

const usersRolesRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/users-roles',
  component: UsersRolesPage,
})

const teamRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/team',
  component: TeamPage,
})

const logoutRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/logout',
  component: LogoutPage,
})

const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  mainLayoutRoute.addChildren([
    dashboardRoute,
    loanProductsRoute,
    customersRoute,
    applyLoanRoute,
    applicationHistoryRoute,
    officerReviewRoute,
    statusTrackingRoute,
    disbursementRoute,
    approvalWorkflowRoute,
    repaymentCalculatorRoute,
    reportingRoute,
    overdueSimulationRoute,
    usersRolesRoute,
    teamRoute,
    logoutRoute,
  ]),
  notFoundRoute,
])

export const router = new Router({ routeTree })

