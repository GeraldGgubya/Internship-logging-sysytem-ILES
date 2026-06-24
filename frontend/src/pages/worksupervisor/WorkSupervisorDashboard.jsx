import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "🏠", label: "Dashboard",    path: "/worksupervisor/dashboard" },
    { icon: "📝", label: "Review Logs",  path: "/worksupervisor/reviewlogs" },
    { icon: "👥", label: "My Students",  path: "/worksupervisor/students" },
];

function WorkSupervisorDashboard() {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");
    const location = useLocation();

    useEffect(() => {
        api.get("/users/supervisor-dashboard/")
            .then((res) => setData(res.data))
            .catch(() => setError("Failed to load dashboard."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Workplace Supervisor" activePath={location.pathname} />

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
                                <div className="stat-value stat-accent">{data?.total_students ?? 0}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Logs to Review</div>
                                <div className="stat-value stat-yellow">{data?.pending_logs ?? data?.total_logs ?? 0}</div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">Your role in the workflow</div>
                            <div className="workflow-steps">
                                <div className="workflow-step">
                                    <div className="step-icon">📨</div>
                                    <div className="step-text">
                                        <strong>Student submits log</strong>
                                        <span>Student sends weekly log before deadline</span>
                                    </div>
                                </div>
                                <div className="workflow-arrow">→</div>
                                <div className="workflow-step active-step">
                                    <div className="step-icon">👁</div>
                                    <div className="step-text">
                                        <strong>You review</strong>
                                        <span>Approve or return for changes</span>
                                    </div>
                                </div>
                                <div className="workflow-arrow">→</div>
                                <div className="workflow-step">
                                    <div className="step-icon">🎓</div>
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
