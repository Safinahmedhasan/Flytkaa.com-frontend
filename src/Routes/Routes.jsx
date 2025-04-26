import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home/Home";
import AdminLogin from "../components/Admin/AdminLogin/AdminLogin";
import DashboardLayout from "../components/Admin/AdminDashboard/DashboardLayout";
import Dashboard from "../components/Admin/Dashboard/Dashboard";
import AdminProtectedRoute from "../components/Admin/AdminDashboard/AdminProtectedRoute/AdminProtectedRoute";
import AdminEmailPasswordChange from "../components/Admin/AdminEmailPasswordChange/AdminEmailPasswordChange";
import UserRegistration from "../components/User/Register/Register";
import UserLogin from "../components/User/Login/Login";
import UserProfile from "../components/User/UserProfile/UserProfile";
import Deposit from "../components/User/UserDeposit/Deposit";
import AdminDeposit from "../components/Admin/AdminDeposit/AdminDeposit";
import AdminWithdrawal from "../components/Admin/AdminWithdrawal/AdminWithdrawal";
import Withdraw from "../components/User/Withdraw/Withdraw";
import BettingSystem from "../components/User/BettingSystem/BettingSystem";
import AdminBettingDashboard from "../components/Admin/AdminBettingDashboard/AdminBettingDashboard";
import CurrencySetting from "../components/Admin/CurrencySetting/CurrencySetting";
import AdminNotifications from "../components/Admin/AdminNotifications/AdminNotifications";
import ErrorPage from "../ErrorPage/ErrorPage";
import AdminHelpline from "../components/Admin/AdminHelpLine/AdminHelpLine";
import Helpline from "../components/User/HelpLine/HelpLine";
import AdminPartnersManagement from "../components/Admin/AdminPartnersManagement/AdminPartnersManagement";
import PartnersDisplay from "../components/User/PartnersDisplay/PartnersDisplay";
import AdminTestimonialsManagement from "../components/Admin/AdminTestimonialsManagement/AdminTestimonialsManagement";
import AdminUsersManagement from "../components/Admin/AdminUsersManagement/AdminUsersManagement";
import AdminPaymentMethod from "../components/Admin/AdminPaymentMethod/AdminPaymentMethod";
import AdminNewRegisterBonus from "../components/Admin/AdminNewRegisterBonus/AdminNewRegisterBonus";
import AdminReffarSetting from "../components/Admin/AdminReffarSetting/AdminReffarSetting";
import DetailsReferralDetails from "../components/User/DetailsReferralDetails/DetailsReferralDetails";
import AdminSocialMedia from "../components/Admin/AdminSocialMedia/AdminSocialMedia";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/Deposit",
        element: <Deposit />,
      },
      {
        path: "/Withdraw",
        element: <Withdraw />,
      },
      {
        path: "/BettingSystem",
        element: <BettingSystem />,
      },
      {
        path: "/Helpline",
        element: <Helpline />,
      },
      {
        path: "/PartnersDisplay",
        element: <PartnersDisplay />,
      },
      {
        path: "/DetailsReferralDetails",
        element: <DetailsReferralDetails />,
      },
    ],
  },
  // Admin Login Page
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  // Admin DashBoard
  {
    path: "/dashboard",
    element: (
      <AdminProtectedRoute>
        <DashboardLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <AdminProtectedRoute>
            <Dashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminUsersManagement",
        element: (
          <AdminProtectedRoute>
            <AdminUsersManagement />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminSocialMedia ",
        element: (
          <AdminProtectedRoute>
            <AdminSocialMedia />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminPaymentMethod",
        element: (
          <AdminProtectedRoute>
            <AdminPaymentMethod />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminEmailPasswordChange",
        element: (
          <AdminProtectedRoute>
            <AdminEmailPasswordChange />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminNewRegisterBonus",
        element: (
          <AdminProtectedRoute>
            <AdminNewRegisterBonus />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminReffarSetting",
        element: (
          <AdminProtectedRoute>
            <AdminReffarSetting />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminPartnersManagement",
        element: (
          <AdminProtectedRoute>
            <AdminPartnersManagement />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminDeposit",
        element: (
          <AdminProtectedRoute>
            <AdminDeposit />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminBettingDashboard",
        element: (
          <AdminProtectedRoute>
            <AdminBettingDashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "CurrencySetting",
        element: (
          <AdminProtectedRoute>
            <CurrencySetting />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminNotifications ",
        element: (
          <AdminProtectedRoute>
            <AdminNotifications />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminWithdrawal",
        element: (
          <AdminProtectedRoute>
            <AdminWithdrawal />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminTestimonialsManagement ",
        element: (
          <AdminProtectedRoute>
            <AdminTestimonialsManagement />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "AdminHelpline",
        element: (
          <AdminProtectedRoute>
            <AdminHelpline />
          </AdminProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <UserLogin />,
  },
  {
    path: "Register",
    element: <UserRegistration />,
  },
  {
    path: "/*",
    element: <ErrorPage/>,
  },
]);
