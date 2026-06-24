import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "🏠", label: "Dashboard",    path: "/student/dashboard" },
    { icon: "🏢", label: "My Placement", path: "/student/placement" },
    { icon: "📝", label: "Weekly Logs",  path: "/student/logs" },
    { icon: "📊", label: "Evaluations",  path: "/student/evaluations" },
];

const STATUS_BADGE = {
    draft:      "badge-yellow",
    submitted:  "badge-purple",
    reviewed:   "badge-blue",
    approved:   "badge-green",
    returned:   "badge-red",
};

function StudentLogs() {
    const [logs, setLogs]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const load = () => {
        setLoading(true);
        api.get("/weeklylogs/")
            .then((res) => setLogs(Array.isArray(res.data) ? res.data : res.data.results || []))
            .catch(() => setError("Failed to load logs."))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Student" activePath={location.pathname} />

            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Weekly Logs</h1>
                    <p className="page-sub">Your submitted internship logs</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="card">
                    <div className="card-title">
                        All Logs
                        <button className="btn btn-primary btn-sm" onClick={() => navigate("/student/logs/create")}>
                            + New Log
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-center"><span className="spinner spinner-lg" /></div>
                    ) : logs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <p>No logs yet. Submit your first weekly log!</p>
                            <button className="btn btn-primary btn-sm" style={{marginTop:12}} onClick={() => navigate("/student/logs/create")}>
                                Submit a log
                            </button>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Week</th>
                                        <th>Date Submitted</th>
                                        <th>Status</th>
                                        <th>Preview</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id}>
                                            <td><span className="badge badge-purple">Week {log.week_number}</span></td>
                                            <td className="text-muted">{new Date(log.date_submitted).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${STATUS_BADGE[log.status] || "badge-yellow"}`}>
                                                    {log.status || "draft"}
                                                </span>
                                            </td>
                                            <td className="text-muted text-sm">
                                                {log.log_content?.slice(0, 60)}…
                                            </td>
                                            <td>
                                                {/* If log was returned, student can resubmit */}
                                                {log.status === "returned" && (
                                                    <button
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => navigate(`/student/logs/${log.id}/edit`)}
                                                    >
                                                        Edit & Resubmit
                                                    </button>
                                                )}
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

export default StudentLogs;
