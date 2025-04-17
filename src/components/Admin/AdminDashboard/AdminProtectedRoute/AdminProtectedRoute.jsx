import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  // Optionally, you can add logic here to verify token validity, e.g., decode it and check roles

  return token ? children : <Navigate to="/admin" />;
};

export default AdminProtectedRoute;
