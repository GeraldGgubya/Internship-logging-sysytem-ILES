import { useState, useEffect } from "react";

import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home", label: "Dashboard",   path: "/worksupervisor/dashboard" },
    { icon: "review", label: "Review Logs", path: "/worksupervisor/reviewlogs" },
    { icon: "students", label: "My Students", path: "/worksupervisor/students" },
];

function WorkSupervisorStudents() {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState("");
    

    useEffect(() => {
        api.get("/placements/")
            .then((res) => setPlacements(Array.isArray(res.data) ? res.data : res.data.results || []))
            .catch(() => setError("Failed to load students."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Workplace Supervisor"  />
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">My Students</h1>
                    <p className="page-sub">Students under your supervision</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="card">
                    <div className="card-title">Student Placements</div>
                    {loading ? (
                        <div className="loading-center"><span className="spinner spinner-lg" /></div>
                    ) : placements.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">👥</div>
                            <p>No students assigned to you yet.</p>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Company</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {placements.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.student_username || p.student}</td>
                                            <td>{p.company_name}</td>
                                            <td className="text-muted text-sm">{p.startdate}</td>
                                            <td className="text-muted text-sm">{p.enddate}</td>
                                            <td><span className="badge badge-green">Active</span></td>
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

export default WorkSupervisorStudents;
