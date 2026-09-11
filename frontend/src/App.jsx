import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Student layout — persistent sidebar fix
import StudentLayout from "./components/StudentLayout";

// Auth
import Login from "./pages/authenticationPage/Login";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

// Student pages — no sidebar (StudentLayout handles it)
import StudentDashboard   from "./pages/student/StudentDashboard";
import StudentLogs        from "./pages/student/StudentLogs";
import CreateLog          from "./pages/student/CreateLog";
import StudentPlacement   from "./pages/student/StudentPlacement";
import StudentEvaluations from "./pages/student/StudentEvaluations";

// Work Supervisor — unchanged, keep their own sidebars
import WorkSupervisorDashboard  from "./pages/worksupervisor/WorkSupervisorDashboard";
import WorkSupervisorReviewLogs from "./pages/worksupervisor/WorkSupervisorReviewLogs";
import WorkSupervisorStudents   from "./pages/worksupervisor/WorkSupervisorStudents";

// Academic Supervisor — unchanged, keep their own sidebars
import AcademicSupervisorDashboard from "./pages/academicsupervisor/AcademicSupervisorDashboard";
import AcademicReviewLogs          from "./pages/academicsupervisor/AcademicReviewLogs";
import AcademicEvaluations         from "./pages/academicsupervisor/AcademicEvaluations";
import AcademicStudents            from "./pages/academicsupervisor/AcademicStudents";

function App() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Login />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>
            } />

            {/* ── STUDENT — persistent sidebar via layout ── */}
            <Route path="/student" element={
                <ProtectedRoute allowedRoles={["student"]}><StudentLayout /></ProtectedRoute>
            }>
                <Route path="dashboard"     element={<StudentDashboard />} />
                <Route path="placement"     element={<StudentPlacement />} />
                <Route path="logs"          element={<StudentLogs />} />
                <Route path="logs/create"   element={<CreateLog />} />
                <Route path="logs/:id/edit" element={<CreateLog />} />
                <Route path="evaluations"   element={<StudentEvaluations />} />
            </Route>

            {/* ── WORK SUPERVISOR — unchanged ── */}
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

            {/* ── ACADEMIC SUPERVISOR — unchanged ── */}
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

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
