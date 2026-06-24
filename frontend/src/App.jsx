import { Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/authenticationPage/Login";

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
            {/* Auth */}
            <Route path="/" element={<Login />} />

            {/* Student */}
            <Route path="/student/dashboard"     element={<StudentDashboard />} />
            <Route path="/student/logs"          element={<StudentLogs />} />
            <Route path="/student/logs/create"   element={<CreateLog />} />
            <Route path="/student/logs/:id/edit" element={<CreateLog />} />
            <Route path="/student/placement"     element={<StudentPlacement />} />
            <Route path="/student/evaluations"   element={<StudentEvaluations />} />

            {/* Work Supervisor */}
            <Route path="/worksupervisor/dashboard"  element={<WorkSupervisorDashboard />} />
            <Route path="/worksupervisor/reviewlogs" element={<WorkSupervisorReviewLogs />} />
            <Route path="/worksupervisor/students"   element={<WorkSupervisorStudents />} />

            {/* Academic Supervisor */}
            <Route path="/academicsupervisor/dashboard"   element={<AcademicSupervisorDashboard />} />
            <Route path="/academicsupervisor/reviewlogs"  element={<AcademicReviewLogs />} />
            <Route path="/academicsupervisor/evaluations" element={<AcademicEvaluations />} />
            <Route path="/academicsupervisor/students"    element={<AcademicStudents />} />
        </Routes>
    );
}

export default App;
