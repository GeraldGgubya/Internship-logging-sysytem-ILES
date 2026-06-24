import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "🏠", label: "Dashboard",      path: "/academicsupervisor/dashboard" },
    { icon: "📝", label: "Final Sign-off", path: "/academicsupervisor/reviewlogs" },
    { icon: "📊", label: "Evaluations",    path: "/academicsupervisor/evaluations" },
    { icon: "👥", label: "Students",       path: "/academicsupervisor/students" },
];

function AcademicStudents() {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState("");
    const location = useLocation();

    useEffect(() => {
        api.get("/placements/")
            .then((res) => setPlacements(Array.isArray(res.data) ? res.data : res.data.results || []))
            .catch(() => setError("Failed to load students."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Academic Supervisor" activePath={location.pathname} />

            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Students</h1>
                    <p className="page-sub">All students and their placement details</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="card">
                    <div className="card-title">Enrolled Students</div>
                    {loading ? (
                        <div className="loading-center"><span className="spinner spinner-lg" /></div>
                    ) : placements.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">👥</div>
                            <p>No students found.</p>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Company</th>
                                        <th>Workplace Supervisor</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {placements.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.student_username || p.student}</td>
                                            <td>{p.company_name}</td>
                                            <td>{p.supervisor_name}</td>
                                            <td className="text-muted text-sm">{p.startdate}</td>
                                            <td className="text-muted text-sm">{p.enddate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AcademicStudents;
