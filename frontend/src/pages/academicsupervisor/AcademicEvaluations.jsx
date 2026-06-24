import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "🏠", label: "Dashboard",      path: "/academicsupervisor/dashboard" },
    { icon: "📝", label: "Final Sign-off", path: "/academicsupervisor/reviewlogs" },
    { icon: "📊", label: "Evaluations",    path: "/academicsupervisor/evaluations" },
    { icon: "👥", label: "Students",       path: "/academicsupervisor/students" },
];

function AcademicEvaluations() {
    const [evals, setEvals]         = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState("");
    const [showForm, setShowForm]   = useState(false);
    const [form, setForm]           = useState({ placement: "", score: "", comments: "" });
    const [saving, setSaving]       = useState(false);
    const [msg, setMsg]             = useState("");
    const location = useLocation();

    const load = () => {
        setLoading(true);
        api.get("/evaluations/")
            .then((res) => setEvals(Array.isArray(res.data) ? res.data : res.data.results || []))
            .catch(() => setError("Failed to load evaluations."))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleSave = async () => {
        if (!form.placement || !form.score) { setMsg("Placement ID and score are required."); return; }
        setSaving(true); setMsg("");
        try {
            await api.post("/evaluations/", form);
            setMsg("✅ Evaluation submitted successfully.");
            setShowForm(false);
            setForm({ placement: "", score: "", comments: "" });
            load();
        } catch (err) {
            setMsg("❌ " + (err.response?.data ? JSON.stringify(err.response.data) : "Save failed."));
        } finally {
            setSaving(false);
        }
    };

    const scoreBadge = (score) => {
        if (score >= 80) return "badge-green";
        if (score >= 60) return "badge-yellow";
        return "badge-red";
    };

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Academic Supervisor" activePath={location.pathname} />

            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Evaluations</h1>
                    <p className="page-sub">Score and evaluate student internship performance</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {msg   && (
                    <div className={`alert ${msg.startsWith("❌") ? "alert-error" : "alert-success"}`}>
                        {msg}
                    </div>
                )}

                <div className="card">
                    <div className="card-title">
                        All Evaluations
                        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
                            + Add Evaluation
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-center"><span className="spinner spinner-lg" /></div>
                    ) : evals.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📊</div>
                            <p>No evaluations submitted yet.</p>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Placement</th>
                                        <th>Score</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evals.map((e) => (
                                        <tr key={e.id}>
                                            <td>{e.student_username || e.student || "—"}</td>
                                            <td>{e.placement}</td>
                                            <td>
                                                <span className={`badge ${scoreBadge(e.score)}`}>
                                                    {e.score}/100
                                                </span>
                                            </td>
                                            <td className="text-muted text-sm">{e.comments || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Add evaluation modal */}
                {showForm && (
                    <div className="modal-backdrop" onClick={() => setShowForm(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-title">Add Evaluation</div>
                            <div className="field">
                                <label>PLACEMENT ID</label>
                                <input
                                    type="number"
                                    placeholder="Student's placement ID"
                                    value={form.placement}
                                    onChange={(e) => setForm({ ...form, placement: e.target.value })}
                                />
                            </div>
                            <div className="field">
                                <label>SCORE (0 – 100)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="e.g. 78"
                                    value={form.score}
                                    onChange={(e) => setForm({ ...form, score: e.target.value })}
                                />
                            </div>
                            <div className="field">
                                <label>COMMENTS</label>
                                <textarea
                                    rows={4}
                                    placeholder="Overall performance feedback for the student…"
                                    value={form.comments}
                                    onChange={(e) => setForm({ ...form, comments: e.target.value })}
                                />
                            </div>
                            {msg && <div className="alert alert-error">{msg}</div>}
                            <div className="modal-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                                    {saving ? <span className="spinner" /> : "Submit Evaluation"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AcademicEvaluations;
