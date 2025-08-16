import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
// const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
// const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));

// USER
// const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
// const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/task/list'));
const UserDetailsPage = lazy(() => import('src/pages/dashboard/task/details'));

// const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/task/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/task/edit'));

const InventoryListPage = lazy(() => import('src/pages/dashboard/inventory/list'));
const InventoryDetailsPage = lazy(() => import('src/pages/dashboard/inventory/details'));
const InventoryEditPage = lazy(() => import('src/pages/dashboard/inventory/edit'));
const InventoryRequestPage = lazy(() => import('src/pages/dashboard/inventory/request'));
const InventoryRequestAssignPage = lazy(() => import('src/pages/dashboard/inventory/assign'));

// Maintenance ssection
const MaintenanceListPage = lazy(() => import('src/pages/dashboard/maintenance/list'));
const MaintenanceNewPage = lazy(() => import('src/pages/dashboard/maintenance/new'));
const MaintenanceEditPage = lazy(() => import('src/pages/dashboard/maintenance/edit'));

const TrainingListPage = lazy(() => import('src/pages/dashboard/training/list'));

const ScheduleListPage = lazy(() => import('src/pages/dashboard/schedule/list'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// JOB
// const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
// const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
// const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
// const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
// const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
// const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
// const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
// const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
// const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
// const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      // { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      // { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      // { path: 'file', element: <OverviewFilePage /> },
      {
        path: 'task',
        children: [
          { element: <UserListPage />, index: true },
          // { path: 'profile', element: <UserProfilePage /> },
          // { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id', element: <UserDetailsPage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          // { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'inventory',
        children: [
          { element: <InventoryListPage />, index: true },
          // { path: 'profile', element: <UserProfilePage /> },
          // { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: ':id', element: <InventoryDetailsPage /> },
          { path: ':id/edit', element: <InventoryEditPage /> },
          { path: 'request', element: <InventoryRequestPage /> },
          { path: 'request/assign', element: <InventoryRequestAssignPage /> },
        ],
      },
      {
        path: 'maintenance',
        children: [
          { element: <MaintenanceListPage />, index: true },
          { path: ':id/edit', element: <MaintenanceEditPage /> },
          { path: 'new', element: <MaintenanceNewPage /> },
        ],
      },
      {
        path: 'training',
        children: [
          { element: <TrainingListPage />, index: true },
          // { path: 'profile', element: <UserProfilePage /> },
          // { path: 'cards', element: <UserCardsPage /> },

          // { path: ':id', element: <InventoryDetailsPage /> },
          // { path: ':id/edit', element: <InventoryDetailsPage /> },
          // { path: 'account', element: <UserAccountPage /> },
        ],
      },

      {
        path: 'schedule',
        children: [
          { element: <ScheduleListPage />, index: true },
          // { path: 'profile', element: <UserProfilePage /> },
          // { path: 'cards', element: <UserCardsPage /> },

          // { path: ':id', element: <InventoryDetailsPage /> },
          // { path: ':id/edit', element: <InventoryDetailsPage /> },
          // { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'event',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':slug', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':slug/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <UserListPage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':slug', element: <BlogPostPage /> },
          { path: ':slug/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        // path: 'job',
        // children: [
        //   { element: <JobListPage />, index: true },
        //   { path: 'list', element: <JobListPage /> },
        //   { path: ':id', element: <JobDetailsPage /> },
        //   { path: 'new', element: <JobCreatePage /> },
        //   { path: ':id/edit', element: <JobEditPage /> },
        // ],
      },
      {
        path: 'room',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      // { path: 'file-manager', element: <FileManagerPage /> },
      // { path: 'mail', element: <MailPage /> },
      // { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      // { path: 'kanban', element: <KanbanPage /> },
      // { path: 'permission', element: <PermissionDeniedPage /> },
      // { path: 'blank', element: <BlankPage /> },
    ],
  },
];
