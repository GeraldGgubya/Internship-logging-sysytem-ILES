import { useState, useEffect } from "react";

import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home", label: "Dashboard",      path: "/academicsupervisor/dashboard" },
    { icon: "signoff", label: "Final Sign-off", path: "/academicsupervisor/reviewlogs" },
    { icon: "evaluations", label: "Evaluations",    path: "/academicsupervisor/evaluations" },
    { icon: "students", label: "Students",       path: "/academicsupervisor/students" },
];

const STATUS_BADGE = {
    draft:     "badge-yellow",
    submitted: "badge-purple",
    reviewed:  "badge-blue",
    approved:  "badge-green",
    returned:  "badge-red",
};

function AcademicReviewLogs() {
    const [logs, setLogs]           = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState("");
    const [selected, setSelected]   = useState(null);
    const [feedback, setFeedback]   = useState("");
    const [actionMsg, setActionMsg] = useState("");
    const [acting, setActing]       = useState(false);
    

    const load = () => {
        setLoading(true);
        api.get("/weeklylogs/")
            .then((res) => {
                const all = Array.isArray(res.data) ? res.data : res.data.results || [];
                // Academic supervisor only sees logs already reviewed by workplace supervisor
                setLogs(all.filter((l) => l.status === "reviewed" || l.status === "approved"));
            })
            .catch(() => setError("Failed to load logs."))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    // Final approval — log is fully done
    const handleApprove = async (log) => {
        setActing(true); setActionMsg("");
        try {
            await api.patch(`/weeklylogs/${log.id}/`, { status: "approved" });
            setActionMsg(`✅ Week ${log.week_number} log given final approval.`);
            load();
        } catch {
            setActionMsg("❌ Action failed. Please try again.");
        } finally {
            setActing(false);
        }
    };

    // Request changes — send back to student via returned status
    const handleRequestChanges = async () => {
        if (!feedback.trim()) { setActionMsg("Please provide feedback before requesting changes."); return; }
        setActing(true); setActionMsg("");
        try {
            await api.patch(`/weeklylogs/${selected.id}/`, {
                status: "returned",
                supervisor_feedback: feedback,
            });
            setActionMsg("↩ Changes requested. Log returned to student.");
            load();
        } catch {
            setActionMsg("❌ Action failed. Please try again.");
        } finally {
            setActing(false); setSelected(null); setFeedback("");
        }
    };

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Academic Supervisor"  />

            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Final Sign-off</h1>
                    <p className="page-sub">
                        These logs have been reviewed by the workplace supervisor and are
                        awaiting your final approval
                    </p>
                </div>

                {error     && <div className="alert alert-error">{error}</div>}
                {actionMsg && (
                    <div className={`alert ${actionMsg.startsWith("❌") ? "alert-error" : "alert-success"}`}>
                        {actionMsg}
                    </div>
                )}

                <div className="card">
                    <div className="card-title">
                        Logs Awaiting Final Sign-off
                        <span className="badge badge-purple" style={{ fontSize: 13 }}>
                            {logs.filter((l) => l.status === "reviewed").length} pending
                        </span>
                    </div>

                    {loading ? (
                        <div className="loading-center"><span className="spinner spinner-lg" /></div>
                    ) : logs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">✅</div>
                            <p>No logs awaiting your sign-off right now.</p>
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
                                            <td className="text-muted text-sm">
                                                {new Date(log.date_submitted).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className={`badge ${STATUS_BADGE[log.status] || "badge-yellow"}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="text-muted text-sm">
                                                {log.log_content?.slice(0, 70)}…
                                            </td>
                                            <td>
                                                {log.status === "reviewed" && (
                                                    <div style={{ display: "flex", gap: 8 }}>
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleApprove(log)}
                                                            disabled={acting}
                                                        >
                                                            ✓ Final Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => { setSelected(log); setActionMsg(""); }}
                                                            disabled={acting}
                                                        >
                                                            ↩ Request Changes
                                                        </button>
                                                    </div>
                                                )}
                                                {log.status === "approved" && (
                                                    <span className="badge badge-green">Approved ✓</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Request changes modal */}
                {selected && (
                    <div className="modal-backdrop" onClick={() => setSelected(null)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-title">↩ Request Changes — Week {selected.week_number}</div>
                            <p className="card-body" style={{ marginBottom: 16 }}>
                                Explain what the student needs to fix. The log will be returned to them for resubmission.
                            </p>
                            <div className="field">
                                <label>FEEDBACK / CHANGES REQUIRED</label>
                                <textarea
                                    rows={4}
                                    placeholder="e.g. Please provide more detail on your learning outcomes and how they relate to your course objectives."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </div>
                            {actionMsg && <div className="alert alert-error">{actionMsg}</div>}
                            <div className="modal-actions">
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => { setSelected(null); setFeedback(""); }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={handleRequestChanges}
                                    disabled={acting}
                                >
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
