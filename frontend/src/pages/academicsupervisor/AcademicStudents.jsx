import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home",        label: "Dashboard",      path: "/academicsupervisor/dashboard" },
    { icon: "signoff",     label: "Final Sign-off", path: "/academicsupervisor/reviewlogs" },
    { icon: "evaluations", label: "Evaluations",    path: "/academicsupervisor/evaluations" },
    { icon: "students",    label: "Students",       path: "/academicsupervisor/students" },
];

function AcademicStudents() {
    const [placements, setPlacements] = useState([]);
    const [logCounts, setLogCounts]   = useState({});
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([api.get("/placements/"), api.get("/weeklylogs/")])
            .then(([pRes, lRes]) => {
                const pl   = Array.isArray(pRes.data) ? pRes.data : pRes.data.results || [];
                const logs = Array.isArray(lRes.data) ? lRes.data : lRes.data.results || [];
                // Count logs per student
                const counts = {};
                logs.forEach(l => {
                    const sid = l.student;
                    counts[sid] = (counts[sid] || 0) + 1;
                });
                setPlacements(pl);
                setLogCounts(counts);
            })
            .catch(() => setError("Failed to load students."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Academic Supervisor" />
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Students</h1>
                    <p className="page-sub">All enrolled students and their placement details</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="card">
                    <div className="card-title">
                        Enrolled Students
                        <span className="badge badge-purple">{placements.length} students</span>
                    </div>
                    {loading ? (
                        <div className="loading-center"><span className="spinner spinner-lg" /></div>
                    ) : placements.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon-svg">
                                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                                </svg>
                            </div>
                            <p>No students found. Add placements from the Admin Dashboard.</p>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th><th>Company</th><th>Work Supervisor</th>
                                        <th>Start</th><th>End</th><th>Logs</th><th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {placements.map(p => (
                                        <tr key={p.id}>
                                            <td><strong>{p.student_username || p.student}</strong></td>
                                            <td>{p.company_name}</td>
                                            <td className="text-muted">{p.supervisor_name}</td>
                                            <td className="text-muted text-sm">{p.startdate}</td>
                                            <td className="text-muted text-sm">{p.enddate}</td>
                                            <td>
                                                <span className="badge badge-purple">
                                                    {logCounts[p.student] || 0} logs
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => navigate("/academicsupervisor/evaluations")}
                                                >
                                                    Evaluate
                                                </button>
                                            </td>
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
