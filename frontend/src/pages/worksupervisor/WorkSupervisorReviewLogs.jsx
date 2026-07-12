import { useState, useEffect } from "react";

import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home", label: "Dashboard",   path: "/worksupervisor/dashboard" },
    { icon: "review", label: "Review Logs", path: "/worksupervisor/reviewlogs" },
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
    const [selected, setSelected]   = useState(null);   // log being acted on
    const [feedback, setFeedback]   = useState("");      // return reason
    const [actionMsg, setActionMsg] = useState("");
    const [acting, setActing]       = useState(false);
    

    const load = () => {
        setLoading(true);
        api.get("/weeklylogs/")
            .then((res) => {
                const all = Array.isArray(res.data) ? res.data : res.data.results || [];
                // Work supervisor only sees submitted logs (not drafts)
                setLogs(all.filter((l) => l.status === "submitted" || l.status === "returned" || l.status === "reviewed" || l.status === "approved"));
            })
            .catch(() => setError("Failed to load logs."))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    // Approve: mark as reviewed → passes to academic supervisor
    const handleApprove = async (log) => {
        setActing(true); setActionMsg("");
        try {
            await api.patch(`/weeklylogs/${log.id}/`, { status: "reviewed" });
            setActionMsg(`✅ Log for Week ${log.week_number} approved and forwarded to academic supervisor.`);
            load();
        } catch {
            setActionMsg("❌ Action failed. Please try again.");
        } finally {
            setActing(false); setSelected(null); setFeedback("");
        }
    };

    // Return: mark as returned with feedback → student must resubmit
    const handleReturn = async () => {
        if (!feedback.trim()) { setActionMsg("Please provide a reason for returning this log."); return; }
        setActing(true); setActionMsg("");
        try {
            await api.patch(`/weeklylogs/${selected.id}/`, {
                status: "returned",
                supervisor_feedback: feedback,
            });
            setActionMsg(`↩ Log returned to student with feedback.`);
            load();
        } catch {
            setActionMsg("❌ Action failed. Please try again.");
        } finally {
            setActing(false); setSelected(null); setFeedback("");
        }
    };

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Workplace Supervisor"  />

            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Review Logs</h1>
                    <p className="page-sub">Approve logs or return them to students for revision</p>
                </div>

                {error     && <div className="alert alert-error">{error}</div>}
                {actionMsg && <div className={`alert ${actionMsg.startsWith("❌") ? "alert-error" : "alert-success"}`}>{actionMsg}</div>}

                <div className="card">
                    <div className="card-title">Submitted Logs</div>
                    {loading ? (
                        <div className="loading-center"><span className="spinner spinner-lg" /></div>
                    ) : logs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">✅</div>
                            <p>No logs pending review. All caught up!</p>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Week</th>
                                        <th>Submitted</th>
                                        <th>Status</th>
                                        <th>Log Preview</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id}>
                                            <td>{log.student_username || log.student}</td>
                                            <td><span className="badge badge-purple">Week {log.week_number}</span></td>
                                            <td className="text-muted text-sm">{new Date(log.date_submitted).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${STATUS_BADGE[log.status] || "badge-yellow"}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="text-muted text-sm">{log.log_content?.slice(0, 70)}…</td>
                                            <td>
                                                {log.status === "submitted" && (
                                                    <div style={{ display: "flex", gap: 8 }}>
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleApprove(log)}
                                                            disabled={acting}
                                                        >
                                                            ✓ Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => { setSelected(log); setActionMsg(""); }}
                                                            disabled={acting}
                                                        >
                                                            ↩ Return
                                                        </button>
                                                    </div>
                                                )}
                                                {log.status !== "submitted" && (
                                                    <span className="text-muted text-sm">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Return modal */}
                {selected && (
                    <div className="modal-backdrop" onClick={() => setSelected(null)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-title">↩ Return Log — Week {selected.week_number}</div>
                            <p className="card-body" style={{ marginBottom: 16 }}>
                                Provide clear feedback so the student knows what to fix before resubmitting.
                            </p>
                            <div className="field">
                                <label>REASON FOR RETURNING</label>
                                <textarea
                                    rows={4}
                                    placeholder="e.g. Missing details about tasks completed on Tuesday. Please elaborate on the challenges you faced."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </div>
                            {actionMsg && <div className="alert alert-error">{actionMsg}</div>}
                            <div className="modal-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => { setSelected(null); setFeedback(""); }}>
                                    Cancel
                                </button>
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
