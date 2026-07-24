import { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home",        label: "Dashboard",      path: "/academicsupervisor/dashboard" },
    { icon: "signoff",     label: "Final Sign-off", path: "/academicsupervisor/reviewlogs" },
    { icon: "evaluations", label: "Evaluations",    path: "/academicsupervisor/evaluations" },
    { icon: "students",    label: "Students",       path: "/academicsupervisor/students" },
];

function AcademicSupervisorDashboard() {
    const [stats, setStats]     = useState({ total_students: 0, total_logs: 0, pending: 0, approved: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");

    useEffect(() => {
        Promise.all([api.get("/placements/"), api.get("/weeklylogs/")])
            .then(([pRes, lRes]) => {
                const placements = Array.isArray(pRes.data) ? pRes.data : pRes.data.results || [];
                const logs       = Array.isArray(lRes.data) ? lRes.data : lRes.data.results || [];
                setStats({
                    total_students: placements.length,
                    total_logs:     logs.length,
                    pending:        logs.filter(l => l.status === "reviewed").length,
                    approved:       logs.filter(l => l.status === "approved").length,
                });
            })
            .catch(() => setError("Failed to load dashboard data."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Academic Supervisor" />
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Academic Supervisor</h1>
                    <p className="page-sub">Give final sign-off on reviewed logs and evaluate students</p>
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
                                <div className="stat-label">Awaiting Sign-off</div>
                                <div className="stat-value stat-yellow">{stats.pending}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Total Logs</div>
                                <div className="stat-value stat-green">{stats.total_logs}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Fully Approved</div>
                                <div className="stat-value stat-green">{stats.approved}</div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">Your role in the workflow</div>
                            <div className="workflow-steps">
                                <div className="workflow-step">
                                    <div className="step-icon">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                    </div>
                                    <div className="step-text"><strong>Student submits</strong><span>Weekly log sent before deadline</span></div>
                                </div>
                                <div className="workflow-arrow">→</div>
                                <div className="workflow-step">
                                    <div className="step-icon">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                                    </div>
                                    <div className="step-text"><strong>Workplace supervisor</strong><span>Reviews and forwards approved logs</span></div>
                                </div>
                                <div className="workflow-arrow">→</div>
                                <div className="workflow-step active-step">
                                    <div className="step-icon">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                                    </div>
                                    <div className="step-text"><strong>You — final sign-off</strong><span>Approve or request changes, then evaluate</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">Quick actions</div>
                            <p className="card-body">
                                Logs forwarded by the workplace supervisor appear under <strong>Final Sign-off</strong>.
                                After approving, submit evaluations under <strong>Evaluations</strong>.
                            </p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default AcademicSupervisorDashboard;
