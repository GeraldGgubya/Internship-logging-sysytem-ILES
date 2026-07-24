import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home",        label: "Dashboard",    path: "/student/dashboard" },
    { icon: "placement",   label: "My Placement", path: "/student/placement" },
    { icon: "logs",        label: "Weekly Logs",  path: "/student/logs" },
    { icon: "evaluations", label: "Evaluations",  path: "/student/evaluations" },
];

const STATUS_BADGE = {
    draft:     "badge-yellow",
    submitted: "badge-purple",
    reviewed:  "badge-blue",
    approved:  "badge-green",
    returned:  "badge-red",
};

const STATUS_LABEL = {
    draft:     "Draft",
    submitted: "Submitted",
    reviewed:  "Under Review",
    approved:  "Approved",
    returned:  "Returned — needs revision",
};

function StudentLogs() {
    const [logs, setLogs]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");
    const [viewLog, setViewLog] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [msg, setMsg]         = useState({ text:"", type:"" });
    const navigate = useNavigate();

    const load = () => {
        setLoading(true);
        api.get("/weeklylogs/")
            .then(res => setLogs(Array.isArray(res.data) ? res.data : res.data.results || []))
            .catch(() => setError("Failed to load logs."))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleDelete = async (log) => {
        if (!window.confirm(`Delete Week ${log.week_number} draft?`)) return;
        setDeleting(log.id);
        try {
            await api.delete(`/weeklylogs/${log.id}/`);
            setMsg({ text:"✅ Draft deleted.", type:"success" });
            load();
        } catch {
            setMsg({ text:"❌ Failed to delete.", type:"error" });
        } finally { setDeleting(null); }
    };

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Student" />
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Weekly Logs</h1>
                    <p className="page-sub">Your submitted internship logs</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {msg.text && (
                    <div className={`alert ${msg.type==="error"?"alert-error":"alert-success"}`}>
                        {msg.text}
                    </div>
                )}

                <div className="card">
                    <div className="card-title">
                        All Logs
                        <button className="btn btn-primary btn-sm" onClick={() => navigate("/student/logs/create")}>
                            + New Log
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-center"><span className="spinner spinner-lg"/></div>
                    ) : logs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon-svg">
                                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                </svg>
                            </div>
                            <p>No logs yet. Submit your first weekly log!</p>
                            <button className="btn btn-primary btn-sm" style={{ marginTop:12 }} onClick={() => navigate("/student/logs/create")}>
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
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id}>
                                            <td>
                                                <span className="badge badge-purple">Week {log.week_number}</span>
                                            </td>
                                            <td className="text-muted text-sm">
                                                {new Date(log.date_submitted).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className={`badge ${STATUS_BADGE[log.status] || "badge-yellow"}`}>
                                                    {STATUS_LABEL[log.status] || log.status}
                                                </span>
                                            </td>
                                            <td className="text-muted text-sm">
                                                {log.log_content?.slice(0, 60)}…
                                            </td>
                                            <td>
                                                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                                                    {/* Read button — always visible */}
                                                    <button
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => setViewLog(log)}
                                                    >
                                                        Read
                                                    </button>

                                                    {/* Edit button — for drafts and returned logs */}
                                                    {(log.status === "draft" || log.status === "returned") && (
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => navigate(`/student/logs/${log.id}/edit`)}
                                                        >
                                                            {log.status === "draft" ? "Edit & Submit" : "Edit & Resubmit"}
                                                        </button>
                                                    )}

                                                    {/* Delete button — only for drafts */}
                                                    {log.status === "draft" && (
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleDelete(log)}
                                                            disabled={deleting === log.id}
                                                        >
                                                            {deleting === log.id ? <span className="spinner"/> : "Delete"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* READ FULL LOG MODAL */}
                {viewLog && (
                    <div className="modal-backdrop" onClick={() => setViewLog(null)}>
                        <div className="modal" style={{ maxWidth:620 }} onClick={e => e.stopPropagation()}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                                <div className="modal-title" style={{ margin:0 }}>
                                    Week {viewLog.week_number} Log
                                </div>
                                <span className={`badge ${STATUS_BADGE[viewLog.status]}`}>
                                    {STATUS_LABEL[viewLog.status] || viewLog.status}
                                </span>
                            </div>
                            <div style={{ fontSize:13, color:"var(--muted)", marginBottom:12 }}>
                                Submitted: {new Date(viewLog.date_submitted).toLocaleString()}
                            </div>
                            <div className="log-content-box">
                                {viewLog.log_content}
                            </div>

                            {/* Show supervisor feedback if log was returned */}
                            {viewLog.supervisor_feedback && (
                                <div style={{ marginTop:16 }}>
                                    <div style={{ fontSize:11, fontWeight:600, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>
                                        Supervisor Feedback
                                    </div>
                                    <div className="feedback-box">
                                        {viewLog.supervisor_feedback}
                                    </div>
                                </div>
                            )}

                            <div className="modal-actions">
                                {(viewLog.status === "draft" || viewLog.status === "returned") && (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => { setViewLog(null); navigate(`/student/logs/${viewLog.id}/edit`); }}
                                    >
                                        {viewLog.status === "draft" ? "Edit & Submit" : "Edit & Resubmit"}
                                    </button>
                                )}
                                <button className="btn btn-ghost btn-sm" onClick={() => setViewLog(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default StudentLogs;
