import { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home",     label: "Dashboard",   path: "/worksupervisor/dashboard" },
    { icon: "review",   label: "Review Logs", path: "/worksupervisor/reviewlogs" },
    { icon: "students", label: "My Students", path: "/worksupervisor/students" },
];

function WorkSupervisorDashboard() {
    const [stats, setStats]     = useState({ total_students: 0, total_logs: 0, pending_logs: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");

    useEffect(() => {
        // Fetch students and logs in parallel for accurate counts
        Promise.all([
            api.get("/placements/"),
            api.get("/weeklylogs/"),
        ])
        .then(([pRes, lRes]) => {
            const placements = Array.isArray(pRes.data) ? pRes.data : pRes.data.results || [];
            const logs       = Array.isArray(lRes.data) ? lRes.data : lRes.data.results || [];
            const pending    = logs.filter(l => l.status === "submitted").length;
            setStats({
                total_students: placements.length,
                total_logs:     logs.length,
                pending_logs:   pending,
            });
        })
        .catch(() => setError("Failed to load dashboard data."))
        .finally(() => setLoading(false));
    }, []);

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Workplace Supervisor" />
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Workplace Supervisor</h1>
                    <p className="page-sub">Review student logs and forward approved ones to the academic supervisor</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-center"><span className="spinner spinner-lg" /></div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Total Students</div>
                                <div className="stat-value stat-accent">{stats.total_students}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Logs to Review</div>
                                <div className="stat-value stat-yellow">{stats.pending_logs}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Total Logs</div>
                                <div className="stat-value stat-green">{stats.total_logs}</div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">Your role in the workflow</div>
                            <div className="workflow-steps">
                                <div className="workflow-step">
                                    <div className="step-icon">
                                        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                    </div>
                                    <div className="step-text">
                                        <strong>Student submits log</strong>
                                        <span>Student sends weekly log before deadline</span>
                                    </div>
                                </div>
                                <div className="workflow-arrow">→</div>
                                <div className="workflow-step active-step">
                                    <div className="step-icon">
                                        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    </div>
                                    <div className="step-text">
                                        <strong>You review</strong>
                                        <span>Read, add comments, approve or return</span>
                                    </div>
                                </div>
                                <div className="workflow-arrow">→</div>
                                <div className="workflow-step">
                                    <div className="step-icon">
                                        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                                    </div>
                                    <div className="step-text">
                                        <strong>Academic supervisor</strong>
                                        <span>Final sign-off and evaluation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default WorkSupervisorDashboard;
