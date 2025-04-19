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
        path: "AdminEmailPasswordChange",
        element: (
          <AdminProtectedRoute>
            <AdminEmailPasswordChange />
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
        path: "AdminWithdrawal",
        element: (
          <AdminProtectedRoute>
            <AdminWithdrawal />
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
]);
