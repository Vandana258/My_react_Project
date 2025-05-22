import { Navigate, Outlet } from "react-router-dom";

const RoleBasedRoutes = ({ allowedRoles }) => {
    const authUser = localStorage.getItem('user');
    const user = authUser ? JSON.parse(authUser) : null;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default RoleBasedRoutes;