import { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home",        label: "Dashboard",    path: "/student/dashboard" },
    { icon: "placement",   label: "My Placement", path: "/student/placement" },
    { icon: "logs",        label: "Weekly Logs",  path: "/student/logs" },
    { icon: "evaluations", label: "Evaluations",  path: "/student/evaluations" },
];

function StudentDashboard() {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");
    const username = localStorage.getItem("username") || "Student";

    useEffect(() => {
        api.get("/users/student-dashboard/")
            .then((res) => { setData(res.data); setError(""); })
            .catch((err) => {
                // Show the real error to help debugging
                const status = err.response?.status;
                if (status === 404) {
                    setError("Dashboard endpoint not found (404). Check your backend urls.py.");
                } else if (status === 403) {
                    setError("Access denied (403). Make sure your user has the 'student' role.");
                } else {
                    setError(`Could not load dashboard data (${status || "network error"}). Stats will show defaults.`);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Student" />

            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Hello, {data?.user || username} 👋</h1>
                    <p className="page-sub">Here's your internship overview</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        ⚠ {error}
                    </div>
                )}

                {loading ? (
                    <div className="loading-center">
                        <span className="spinner spinner-lg" />
                        <p>Loading your dashboard…</p>
                    </div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Company</div>
                                <div className="stat-value stat-accent">
                                    {data?.placement || "Not assigned yet"}
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Logs Submitted</div>
                                <div className="stat-value stat-green">
                                    {data?.total_logs ?? 0}
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">Getting started</div>
                            <p className="card-body">
                                Submit your weekly logs before the deadline. Your workplace supervisor
                                will review and either approve or return them for changes. Once approved,
                                your academic supervisor gives the final sign-off.
                            </p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default StudentDashboard;
