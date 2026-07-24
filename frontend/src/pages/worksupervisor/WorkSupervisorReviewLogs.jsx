import { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home",     label: "Dashboard",   path: "/worksupervisor/dashboard" },
    { icon: "review",   label: "Review Logs", path: "/worksupervisor/reviewlogs" },
    { icon: "students", label: "My Students", path: "/worksupervisor/students" },
];

const STATUS_BADGE = {
    draft:     "badge-yellow",
    submitted: "badge-purple",
    reviewed:  "badge-blue",
    approved:  "badge-green",
    returned:  "badge-red",
};

function WorkSupervisorReviewLogs() {
    const [logs, setLogs]           = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState("");
    const [actionMsg, setActionMsg] = useState({ text: "", type: "" });
    const [acting, setActing]       = useState(false);

    // Selected log for reading full content
    const [viewLog, setViewLog]     = useState(null);
    // Selected log for returning with feedback
    const [returnLog, setReturnLog] = useState(null);
    const [feedback, setFeedback]   = useState("");
    // Comments when approving
    const [approveLog, setApproveLog] = useState(null);
    const [approveComment, setApproveComment] = useState("");

    const load = () => {
        setLoading(true);
        api.get("/weeklylogs/")
            .then(res => {
                const all = Array.isArray(res.data) ? res.data : res.data.results || [];
                setLogs(all.filter(l => ["submitted","reviewed","approved","returned"].includes(l.status)));
            })
            .catch(() => setError("Failed to load logs."))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleApprove = async () => {
        setActing(true); setActionMsg({ text: "", type: "" });
        try {
            await api.patch(`/weeklylogs/${approveLog.id}/`, {
                status: "reviewed",
                supervisor_feedback: approveComment || "Approved by workplace supervisor.",
            });
            setActionMsg({ text: `✅ Week ${approveLog.week_number} log approved and forwarded to academic supervisor.`, type: "success" });
            setApproveLog(null); setApproveComment(""); load();
        } catch {
            setActionMsg({ text: "❌ Action failed. Please try again.", type: "error" });
        } finally { setActing(false); }
    };

    const handleReturn = async () => {
        if (!feedback.trim()) {
            setActionMsg({ text: "Please provide a reason for returning this log.", type: "error" }); return;
        }
        setActing(true); setActionMsg({ text: "", type: "" });
        try {
            await api.patch(`/weeklylogs/${returnLog.id}/`, {
                status: "returned",
                supervisor_feedback: feedback,
            });
            setActionMsg({ text: "↩ Log returned to student with your feedback.", type: "success" });
            setReturnLog(null); setFeedback(""); load();
        } catch {
            setActionMsg({ text: "❌ Action failed. Please try again.", type: "error" });
        } finally { setActing(false); }
    };

    const pendingCount = logs.filter(l => l.status === "submitted").length;

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Workplace Supervisor" />
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Review Logs</h1>
                    <p className="page-sub">Read through logs, add comments, then approve or return for revision</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {actionMsg.text && (
                    <div className={`alert ${actionMsg.type === "error" ? "alert-error" : "alert-success"}`}>
                        {actionMsg.text}
                    </div>
                )}

                <div className="card">
                    <div className="card-title">
                        Submitted Logs
                        {pendingCount > 0 && (
                            <span className="badge badge-yellow">{pendingCount} pending</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="loading-center"><span className="spinner spinner-lg" /></div>
                    ) : logs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon-svg">
                                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <p>No logs pending review. All caught up!</p>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th><th>Week</th><th>Submitted</th>
                                        <th>Status</th><th>Preview</th><th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id}>
                                            <td><strong>{log.student_username || log.student}</strong></td>
                                            <td><span className="badge badge-purple">Week {log.week_number}</span></td>
                                            <td className="text-muted text-sm">
                                                {new Date(log.date_submitted).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className={`badge ${STATUS_BADGE[log.status] || "badge-yellow"}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="text-muted text-sm">
                                                {log.log_content?.slice(0, 60)}…
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                    {/* Read full log */}
                                                    <button className="btn btn-ghost btn-sm" onClick={() => setViewLog(log)}>
                                                        Read
                                                    </button>
                                                    {log.status === "submitted" && (
                                                        <>
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => { setApproveLog(log); setActionMsg({ text: "", type: "" }); }}
                                                                disabled={acting}
                                                            >
                                                                ✓ Approve
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => { setReturnLog(log); setActionMsg({ text: "", type: "" }); }}
                                                                disabled={acting}
                                                            >
                                                                ↩ Return
                                                            </button>
                                                        </>
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

                {/* ── READ FULL LOG MODAL ── */}
                {viewLog && (
                    <div className="modal-backdrop" onClick={() => setViewLog(null)}>
                        <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <div className="modal-title" style={{ margin: 0 }}>
                                    Week {viewLog.week_number} Log — {viewLog.student_username || viewLog.student}
                                </div>
                                <span className={`badge ${STATUS_BADGE[viewLog.status]}`}>{viewLog.status}</span>
                            </div>
                            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                                Submitted: {new Date(viewLog.date_submitted).toLocaleString()}
                            </div>
                            <div className="log-content-box">
                                {viewLog.log_content}
                            </div>
                            {viewLog.supervisor_feedback && (
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                                        Previous Feedback
                                    </div>
                                    <div className="feedback-box">{viewLog.supervisor_feedback}</div>
                                </div>
                            )}
                            <div className="modal-actions">
                                {viewLog.status === "submitted" && (
                                    <>
                                        <button className="btn btn-danger btn-sm" onClick={() => { setReturnLog(viewLog); setViewLog(null); }}>
                                            ↩ Return
                                        </button>
                                        <button className="btn btn-success btn-sm" onClick={() => { setApproveLog(viewLog); setViewLog(null); }}>
                                            ✓ Approve
                                        </button>
                                    </>
                                )}
                                <button className="btn btn-ghost btn-sm" onClick={() => setViewLog(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── APPROVE WITH COMMENT MODAL ── */}
                {approveLog && (
                    <div className="modal-backdrop" onClick={() => setApproveLog(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-title">✓ Approve — Week {approveLog.week_number}</div>
                            <p className="card-body" style={{ marginBottom: 14 }}>
                                Add a comment before forwarding to the academic supervisor (optional).
                            </p>
                            <div className="field">
                                <label>COMMENTS (OPTIONAL)</label>
                                <textarea
                                    rows={3}
                                    placeholder="e.g. Good work this week. Well documented tasks."
                                    value={approveComment}
                                    onChange={e => setApproveComment(e.target.value)}
                                />
                            </div>
                            <div className="modal-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => { setApproveLog(null); setApproveComment(""); }}>Cancel</button>
                                <button className="btn btn-success btn-sm" onClick={handleApprove} disabled={acting}>
                                    {acting ? <span className="spinner" /> : "Approve & Forward"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── RETURN WITH FEEDBACK MODAL ── */}
                {returnLog && (
                    <div className="modal-backdrop" onClick={() => setReturnLog(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-title">↩ Return — Week {returnLog.week_number}</div>
                            <p className="card-body" style={{ marginBottom: 14 }}>
                                Explain what needs to be fixed so the student can resubmit correctly.
                            </p>
                            <div className="field">
                                <label>REASON FOR RETURNING *</label>
                                <textarea
                                    rows={4}
                                    placeholder="e.g. Please elaborate on Tuesday's tasks and include specific skills learned."
                                    value={feedback}
                                    onChange={e => setFeedback(e.target.value)}
                                />
                            </div>
                            {actionMsg.text && <div className="alert alert-error">{actionMsg.text}</div>}
                            <div className="modal-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => { setReturnLog(null); setFeedback(""); }}>Cancel</button>
                                <button className="btn btn-danger btn-sm" onClick={handleReturn} disabled={acting}>
                                    {acting ? <span className="spinner" /> : "Return to Student"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default WorkSupervisorReviewLogs;
