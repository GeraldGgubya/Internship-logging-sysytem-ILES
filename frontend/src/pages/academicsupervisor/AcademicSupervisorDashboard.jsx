import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "🏠", label: "Dashboard",    path: "/academicsupervisor/dashboard" },
    { icon: "📝", label: "Final Sign-off", path: "/academicsupervisor/reviewlogs" },
    { icon: "📊", label: "Evaluations",  path: "/academicsupervisor/evaluations" },
    { icon: "👥", label: "Students",     path: "/academicsupervisor/students" },
];

function AcademicSupervisorDashboard() {
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
            <Sidebar navItems={NAV} role="Academic Supervisor" activePath={location.pathname} />

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
                                <div className="stat-value stat-accent">{data?.total_students ?? 0}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Total Logs</div>
                                <div className="stat-value stat-green">{data?.total_logs ?? 0}</div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">Your role in the workflow</div>
                            <div className="workflow-steps">
                                <div className="workflow-step">
                                    <div className="step-icon">📨</div>
                                    <div className="step-text">
                                        <strong>Student submits</strong>
                                        <span>Weekly log sent before deadline</span>
                                    </div>
                                </div>
                                <div className="workflow-arrow">→</div>
                                <div className="workflow-step">
                                    <div className="step-icon">🏢</div>
                                    <div className="step-text">
                                        <strong>Workplace supervisor</strong>
                                        <span>Reviews and forwards approved logs</span>
                                    </div>
                                </div>
                                <div className="workflow-arrow">→</div>
                                <div className="workflow-step active-step">
                                    <div className="step-icon">🎓</div>
                                    <div className="step-text">
                                        <strong>You — final sign-off</strong>
                                        <span>Approve or request changes, then evaluate</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">Quick actions</div>
                            <p className="card-body">
                                Logs forwarded by the workplace supervisor appear under
                                <strong> Final Sign-off</strong>. After approving, you can submit
                                evaluations under <strong>Evaluations</strong>.
                            </p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default AcademicSupervisorDashboard;
