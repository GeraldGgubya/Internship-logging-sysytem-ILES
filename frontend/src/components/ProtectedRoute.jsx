import { Navigate } from "react-router-dom";

// Wraps any route that requires login.
// If no token exists → redirect to login page.
// If role is provided, also checks the user has the right role.
function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("access_token");
    const role  = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Logged in but wrong role — send them to their own dashboard
        if (role === "admin")               return <Navigate to="/admin/dashboard" replace />;
        if (role === "work_supervisor")     return <Navigate to="/worksupervisor/dashboard" replace />;
        if (role === "academic_supervisor") return <Navigate to="/academicsupervisor/dashboard" replace />;
        return <Navigate to="/student/dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;
