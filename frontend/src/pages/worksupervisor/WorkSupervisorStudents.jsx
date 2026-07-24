import { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home",     label: "Dashboard",   path: "/worksupervisor/dashboard" },
    { icon: "review",   label: "Review Logs", path: "/worksupervisor/reviewlogs" },
    { icon: "students", label: "My Students", path: "/worksupervisor/students" },
];

function WorkSupervisorStudents() {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState("");
    const username = localStorage.getItem("username") || "";

    useEffect(() => {
        api.get("/placements/")
            .then(res => {
                const all = Array.isArray(res.data) ? res.data : res.data.results || [];
                // Filter placements where this supervisor is assigned
                // Match by supervisor_name field
                const mine = all.filter(p =>
                    p.supervisor_name?.toLowerCase() === username.toLowerCase()
                );
                // If no match by name, show all (admin may not have set supervisor yet)
                setPlacements(mine.length > 0 ? mine : all);
            })
            .catch(() => setError("Failed to load students."))
            .finally(() => setLoading(false));
    }, [username]);

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Workplace Supervisor" />
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">My Students</h1>
                    <p className="page-sub">Students under your supervision</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="card">
                    <div className="card-title">
                        Student Placements
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
                            <p>No students assigned to you yet.</p>
                            <p style={{ fontSize: 12, marginTop: 8, color: "var(--muted)" }}>
                                Ask your admin to assign students to you via the Admin Dashboard → Placements tab.
                            </p>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th><th>Company</th>
                                        <th>Start Date</th><th>End Date</th><th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {placements.map(p => (
                                        <tr key={p.id}>
                                            <td><strong>{p.student_username || p.student}</strong></td>
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
