import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
        </Routes>
    );
}

export default App;
