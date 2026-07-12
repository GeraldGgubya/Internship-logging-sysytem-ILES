import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/authenticationPage/Login";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

// Student
import StudentDashboard   from "./pages/student/StudentDashboard";
import StudentLogs        from "./pages/student/StudentLogs";
import CreateLog          from "./pages/student/CreateLog";
import StudentPlacement   from "./pages/student/StudentPlacement";
import StudentEvaluations from "./pages/student/StudentEvaluations";

// Work Supervisor
import WorkSupervisorDashboard  from "./pages/worksupervisor/WorkSupervisorDashboard";
import WorkSupervisorReviewLogs from "./pages/worksupervisor/WorkSupervisorReviewLogs";
import WorkSupervisorStudents   from "./pages/worksupervisor/WorkSupervisorStudents";

// Academic Supervisor
import AcademicSupervisorDashboard from "./pages/academicsupervisor/AcademicSupervisorDashboard";
import AcademicReviewLogs          from "./pages/academicsupervisor/AcademicReviewLogs";
import AcademicEvaluations         from "./pages/academicsupervisor/AcademicEvaluations";
import AcademicStudents            from "./pages/academicsupervisor/AcademicStudents";

function App() {
    return (
        <Routes>
            {/* ── PUBLIC ── */}
            <Route path="/" element={<Login />} />

            {/* ── ADMIN ── */}
            <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                </ProtectedRoute>
            } />

            {/* ── STUDENT ── */}
            <Route path="/student/dashboard" element={
                <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                </ProtectedRoute>
            } />
            <Route path="/student/logs" element={
                <ProtectedRoute allowedRoles={["student"]}>
                    <StudentLogs />
                </ProtectedRoute>
            } />
            <Route path="/student/logs/create" element={
                <ProtectedRoute allowedRoles={["student"]}>
                    <CreateLog />
                </ProtectedRoute>
            } />
            <Route path="/student/logs/:id/edit" element={
                <ProtectedRoute allowedRoles={["student"]}>
                    <CreateLog />
                </ProtectedRoute>
            } />
            <Route path="/student/placement" element={
                <ProtectedRoute allowedRoles={["student"]}>
                    <StudentPlacement />
                </ProtectedRoute>
            } />
            <Route path="/student/evaluations" element={
                <ProtectedRoute allowedRoles={["student"]}>
                    <StudentEvaluations />
                </ProtectedRoute>
            } />

            {/* ── WORK SUPERVISOR ── */}
            <Route path="/worksupervisor/dashboard" element={
                <ProtectedRoute allowedRoles={["work_supervisor"]}>
                    <WorkSupervisorDashboard />
                </ProtectedRoute>
            } />
            <Route path="/worksupervisor/reviewlogs" element={
                <ProtectedRoute allowedRoles={["work_supervisor"]}>
                    <WorkSupervisorReviewLogs />
                </ProtectedRoute>
            } />
            <Route path="/worksupervisor/students" element={
                <ProtectedRoute allowedRoles={["work_supervisor"]}>
                    <WorkSupervisorStudents />
                </ProtectedRoute>
            } />

            {/* ── ACADEMIC SUPERVISOR ── */}
            <Route path="/academicsupervisor/dashboard" element={
                <ProtectedRoute allowedRoles={["academic_supervisor"]}>
                    <AcademicSupervisorDashboard />
                </ProtectedRoute>
            } />
            <Route path="/academicsupervisor/reviewlogs" element={
                <ProtectedRoute allowedRoles={["academic_supervisor"]}>
                    <AcademicReviewLogs />
                </ProtectedRoute>
            } />
            <Route path="/academicsupervisor/evaluations" element={
                <ProtectedRoute allowedRoles={["academic_supervisor"]}>
                    <AcademicEvaluations />
                </ProtectedRoute>
            } />
            <Route path="/academicsupervisor/students" element={
                <ProtectedRoute allowedRoles={["academic_supervisor"]}>
                    <AcademicStudents />
                </ProtectedRoute>
            } />

            {/* ── CATCH-ALL → login ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
