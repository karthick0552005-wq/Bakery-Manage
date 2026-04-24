import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useBakery } from "@/store/BakeryContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useBakery();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
