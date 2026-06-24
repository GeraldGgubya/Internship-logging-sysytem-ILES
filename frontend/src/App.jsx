import { Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/authenticationPage/Login";

// Student
import StudentDashboard  from "./pages/student/StudentDashboard";
import StudentLogs       from "./pages/student/StudentLogs";
import CreateLog         from "./pages/student/CreateLog";

// Work Supervisor
import WorkSupervisorDashboard   from "./pages/worksupervisor/WorkSupervisorDashboard";
import WorkSupervisorReviewLogs  from "./pages/worksupervisor/WorkSupervisorReviewLogs";

// Academic Supervisor
import AcademicSupervisorDashboard from "./pages/academicsupervisor/AcademicSupervisorDashboard";
import AcademicReviewLogs          from "./pages/academicsupervisor/AcademicReviewLogs";
import AcademicEvaluations         from "./pages/academicsupervisor/AcademicEvaluations";
import AcademicStudents            from "./pages/academicsupervisor/AcademicStudents";

function App() {
    return (
        <Routes>
            {/* Auth */}
            <Route path="/"  element={<Login />} />

            {/* Student routes */}
            <Route path="/student/dashboard"       element={<StudentDashboard />} />
            <Route path="/student/logs"            element={<StudentLogs />} />
            <Route path="/student/logs/create"     element={<CreateLog />} />
            <Route path="/student/logs/:id/edit"   element={<CreateLog />} />

            {/* Work Supervisor routes */}
            <Route path="/worksupervisor/dashboard"   element={<WorkSupervisorDashboard />} />
            <Route path="/worksupervisor/reviewlogs"  element={<WorkSupervisorReviewLogs />} />

            {/* Academic Supervisor routes */}
            <Route path="/academicsupervisor/dashboard"   element={<AcademicSupervisorDashboard />} />
            <Route path="/academicsupervisor/reviewlogs"  element={<AcademicReviewLogs />} />
            <Route path="/academicsupervisor/evaluations" element={<AcademicEvaluations />} />
            <Route path="/academicsupervisor/students"    element={<AcademicStudents />} />
        </Routes>
    );
}

export default App;
