import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  const allowedRoute = ["/ordering", "/stock", "/expense", "/report"];

  if (!user) {
    return <Navigate to="/" replace />;
  } else if (
    user?.access_level === 2 &&
    !allowedRoute.includes(location.pathname)
  ) {
    return <Navigate to="/ordering" replace />;
  }

  return children;
};

export default ProtectedRoute;
