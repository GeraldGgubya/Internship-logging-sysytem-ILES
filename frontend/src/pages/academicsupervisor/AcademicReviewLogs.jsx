import { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home",        label: "Dashboard",      path: "/academicsupervisor/dashboard" },
    { icon: "signoff",     label: "Final Sign-off", path: "/academicsupervisor/reviewlogs" },
    { icon: "evaluations", label: "Evaluations",    path: "/academicsupervisor/evaluations" },
    { icon: "students",    label: "Students",       path: "/academicsupervisor/students" },
];

const STATUS_BADGE = {
    reviewed: "badge-blue",
    approved: "badge-green",
    returned: "badge-red",
};

function AcademicReviewLogs() {
    const [logs, setLogs]           = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState("");
    const [actionMsg, setActionMsg] = useState({ text: "", type: "" });
    const [acting, setActing]       = useState(false);
    const [viewLog, setViewLog]     = useState(null);
    const [returnLog, setReturnLog] = useState(null);
    const [feedback, setFeedback]   = useState("");
    const [approveLog, setApproveLog] = useState(null);
    const [approveComment, setApproveComment] = useState("");

    const load = () => {
        setLoading(true);
        api.get("/weeklylogs/")
            .then(res => {
                const all = Array.isArray(res.data) ? res.data : res.data.results || [];
                setLogs(all.filter(l => ["reviewed", "approved"].includes(l.status)));
            })
            .catch(() => setError("Failed to load logs."))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleApprove = async () => {
        setActing(true);
        try {
            await api.patch(`/weeklylogs/${approveLog.id}/`, {
                status: "approved",
                supervisor_feedback: approveComment || "Final approval granted.",
            });
            setActionMsg({ text: `✅ Week ${approveLog.week_number} log given final approval.`, type: "success" });
            setApproveLog(null); setApproveComment(""); load();
        } catch {
            setActionMsg({ text: "❌ Action failed.", type: "error" });
        } finally { setActing(false); }
    };

    const handleReturn = async () => {
        if (!feedback.trim()) {
            setActionMsg({ text: "Please provide feedback before returning.", type: "error" }); return;
        }
        setActing(true);
        try {
            await api.patch(`/weeklylogs/${returnLog.id}/`, {
                status: "returned",
                supervisor_feedback: feedback,
            });
            setActionMsg({ text: "↩ Changes requested. Log returned to student.", type: "success" });
            setReturnLog(null); setFeedback(""); load();
        } catch {
            setActionMsg({ text: "❌ Action failed.", type: "error" });
        } finally { setActing(false); }
    };

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Academic Supervisor" />
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Final Sign-off</h1>
                    <p className="page-sub">Logs reviewed by the workplace supervisor awaiting your final approval</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {actionMsg.text && (
                    <div className={`alert ${actionMsg.type === "error" ? "alert-error" : "alert-success"}`}>
                        {actionMsg.text}
                    </div>
                )}

                <div className="card">
                    <div className="card-title">
                        Logs Awaiting Final Sign-off
                        <span className="badge badge-blue">
                            {logs.filter(l => l.status === "reviewed").length} pending
                        </span>
                    </div>

                    {loading ? (
                        <div className="loading-center"><span className="spinner spinner-lg" /></div>
                    ) : logs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon-svg">
                                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <p>No logs awaiting your sign-off right now.</p>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr><th>Student</th><th>Week</th><th>Date</th><th>Status</th><th>Preview</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id}>
                                            <td><strong>{log.student_username || log.student}</strong></td>
                                            <td><span className="badge badge-purple">Week {log.week_number}</span></td>
                                            <td className="text-muted text-sm">{new Date(log.date_submitted).toLocaleDateString()}</td>
                                            <td><span className={`badge ${STATUS_BADGE[log.status] || "badge-blue"}`}>{log.status}</span></td>
                                            <td className="text-muted text-sm">{log.log_content?.slice(0, 55)}…</td>
                                            <td>
                                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                    <button className="btn btn-ghost btn-sm" onClick={() => setViewLog(log)}>Read</button>
                                                    {log.status === "reviewed" && (
                                                        <>
                                                            <button className="btn btn-success btn-sm" onClick={() => { setApproveLog(log); setActionMsg({ text: "", type: "" }); }} disabled={acting}>✓ Approve</button>
                                                            <button className="btn btn-danger btn-sm" onClick={() => { setReturnLog(log); setActionMsg({ text: "", type: "" }); }} disabled={acting}>↩ Return</button>
                                                        </>
                                                    )}
                                                    {log.status === "approved" && <span className="badge badge-green">Approved ✓</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* READ LOG MODAL */}
                {viewLog && (
                    <div className="modal-backdrop" onClick={() => setViewLog(null)}>
                        <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <div className="modal-title" style={{ margin: 0 }}>
                                    Week {viewLog.week_number} — {viewLog.student_username || viewLog.student}
                                </div>
                                <span className={`badge ${STATUS_BADGE[viewLog.status] || "badge-blue"}`}>{viewLog.status}</span>
                            </div>
                            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                                Submitted: {new Date(viewLog.date_submitted).toLocaleString()}
                            </div>
                            <div className="log-content-box">{viewLog.log_content}</div>
                            {viewLog.supervisor_feedback && (
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Workplace Supervisor Comment</div>
                                    <div className="feedback-box">{viewLog.supervisor_feedback}</div>
                                </div>
                            )}
                            <div className="modal-actions">
                                {viewLog.status === "reviewed" && (
                                    <>
                                        <button className="btn btn-danger btn-sm" onClick={() => { setReturnLog(viewLog); setViewLog(null); }}>↩ Return</button>
                                        <button className="btn btn-success btn-sm" onClick={() => { setApproveLog(viewLog); setViewLog(null); }}>✓ Final Approve</button>
                                    </>
                                )}
                                <button className="btn btn-ghost btn-sm" onClick={() => setViewLog(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* APPROVE MODAL */}
                {approveLog && (
                    <div className="modal-backdrop" onClick={() => setApproveLog(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-title">✓ Final Approval — Week {approveLog.week_number}</div>
                            <div className="field">
                                <label>FINAL COMMENT (OPTIONAL)</label>
                                <textarea rows={3} placeholder="e.g. Excellent work. All objectives met." value={approveComment} onChange={e => setApproveComment(e.target.value)} />
                            </div>
                            <div className="modal-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => { setApproveLog(null); setApproveComment(""); }}>Cancel</button>
                                <button className="btn btn-success btn-sm" onClick={handleApprove} disabled={acting}>
                                    {acting ? <span className="spinner" /> : "Give Final Approval"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* RETURN MODAL */}
                {returnLog && (
                    <div className="modal-backdrop" onClick={() => setReturnLog(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-title">↩ Request Changes — Week {returnLog.week_number}</div>
                            <div className="field">
                                <label>FEEDBACK / CHANGES REQUIRED *</label>
                                <textarea rows={4} placeholder="e.g. Please relate your activities more clearly to your course learning outcomes." value={feedback} onChange={e => setFeedback(e.target.value)} />
                            </div>
                            {actionMsg.text && <div className="alert alert-error">{actionMsg.text}</div>}
                            <div className="modal-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => { setReturnLog(null); setFeedback(""); }}>Cancel</button>
                                <button className="btn btn-danger btn-sm" onClick={handleReturn} disabled={acting}>
                                    {acting ? <span className="spinner" /> : "Request Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AcademicReviewLogs;
