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
    const [placement, setPlacement] = useState(null);
    const [logs, setLogs]           = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState("");
    const username = localStorage.getItem("username") || "Student";

    useEffect(() => {
        // Fetch placement + logs directly — don't rely on dashboard endpoint
        Promise.all([api.get("/placements/"), api.get("/weeklylogs/")])
            .then(([pRes, lRes]) => {
                const placements = Array.isArray(pRes.data) ? pRes.data : pRes.data.results || [];
                const allLogs    = Array.isArray(lRes.data) ? lRes.data : lRes.data.results || [];
                setPlacement(placements[0] || null);
                setLogs(allLogs);
                setError("");
            })
            .catch(err => {
                const status = err.response?.status;
                if (status === 403) setError("Access denied. Make sure your account has the 'student' role and you are logged in with the correct account.");
                else setError(`Could not load dashboard data (${status || "network error"}).`);
            })
            .finally(() => setLoading(false));
    }, []);

    const submittedLogs = logs.filter(l => l.status !== "draft").length;
    const approvedLogs  = logs.filter(l => l.status === "approved").length;
    const pendingLogs   = logs.filter(l => l.status === "returned").length;

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Student" />
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Hello, {username} 👋</h1>
                    <p className="page-sub">Here's your internship overview</p>
                </div>

                {error && <div className="alert alert-error">⚠ {error}</div>}

                {loading ? (
                    <div className="loading-center"><span className="spinner spinner-lg" /><p>Loading…</p></div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Company</div>
                                <div className="stat-value stat-accent">
                                    {placement?.company_name || "Not assigned yet"}
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Logs Submitted</div>
                                <div className="stat-value stat-green">{submittedLogs}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Logs Approved</div>
                                <div className="stat-value stat-green">{approvedLogs}</div>
                            </div>
                            {pendingLogs > 0 && (
                                <div className="stat-card">
                                    <div className="stat-label">Needs Revision</div>
                                    <div className="stat-value stat-yellow">{pendingLogs}</div>
                                </div>
                            )}
                        </div>

                        {placement && (
                            <div className="card">
                                <div className="card-title">My Placement</div>
                                <div className="detail-row">
                                    <span className="detail-label">Company</span>
                                    <strong>{placement.company_name}</strong>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Workplace Supervisor</span>
                                    <span>{placement.supervisor_name}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Duration</span>
                                    <span>{placement.startdate} → {placement.enddate}</span>
                                </div>
                            </div>
                        )}

                        {pendingLogs > 0 && (
                            <div className="alert alert-error" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                ⚠ You have {pendingLogs} log(s) returned for revision. Go to <strong>Weekly Logs</strong> to resubmit.
                            </div>
                        )}

                        <div className="card">
                            <div className="card-title">Getting started</div>
                            <p className="card-body">
                                Submit your weekly logs before the deadline. Your workplace supervisor
                                will review and either approve or return them for changes. Once approved,
                                your academic supervisor gives the final sign-off and evaluation.
                            </p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default StudentDashboard;
