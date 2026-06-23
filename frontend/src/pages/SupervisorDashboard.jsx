import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SupervisorDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const username = localStorage.getItem("username") || "Supervisor";

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) { navigate("/"); return; }

        // ✅ FIX: Correct endpoint URL with trailing slash
        axios.get("http://127.0.0.1:8000/api/users/supervisor-dashboard/", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setData(res.data))
        .catch((err) => {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate("/");
            } else {
                setError("Failed to load dashboard. Please try again.");
            }
        })
        .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">🎓</div>
                    <div className="sidebar-logo-text">ILES <span>Portal</span></div>
                </div>

                <nav>
                    <button className="nav-item active">
                        <span className="nav-icon">🏠</span> Dashboard
                    </button>
                    <button className="nav-item">
                        <span className="nav-icon">👥</span> Students
                    </button>
                    <button className="nav-item">
                        <span className="nav-icon">🏢</span> Placements
                    </button>
                    <button className="nav-item">
                        <span className="nav-icon">📝</span> Weekly Logs
                    </button>
                    <button className="nav-item">
                        <span className="nav-icon">📊</span> Evaluations
                    </button>
                </nav>

                <div className="sidebar-bottom">
                    <div className="user-chip">
                        <div className="avatar">
                            {username[0]?.toUpperCase()}
                        </div>
                        <div>
                            <div className="user-name">{username}</div>
                            <div className="user-role">Supervisor</div>
                        </div>
                    </div>
                    <button className="btn btn-danger btn-full btn-sm" onClick={handleLogout}>
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Supervisor Overview</h1>
                    <p className="page-sub">All students and logs at a glance</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-center">
                        <span className="spinner spinner-lg" />
                        <p>Loading dashboard…</p>
                    </div>
                ) : (
                    <>
                        {/* Stat cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Total Students</div>
                                <div className="stat-value stat-accent">
                                    {data?.total_students ?? 0}
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Total Weekly Logs</div>
                                <div className="stat-value stat-green">
                                    {data?.total_logs ?? 0}
                                </div>
                            </div>
                        </div>

                        {/* Summary card */}
                        <div className="card">
                            <div className="card-title">Summary</div>
                            <div className="detail-row">
                                <span className="detail-label">Students enrolled</span>
                                <span className="badge badge-purple">{data?.total_students ?? 0}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Logs submitted</span>
                                <span className="badge badge-green">{data?.total_logs ?? 0}</span>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">Quick actions</div>
                            <p className="card-body">
                                Navigate using the sidebar to review student placements,
                                read weekly logs, and submit evaluations for your students.
                            </p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default SupervisorDashboard;

