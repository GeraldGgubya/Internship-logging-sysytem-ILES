import { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home",        label: "Dashboard",      path: "/academicsupervisor/dashboard" },
    { icon: "signoff",     label: "Final Sign-off", path: "/academicsupervisor/reviewlogs" },
    { icon: "evaluations", label: "Evaluations",    path: "/academicsupervisor/evaluations" },
    { icon: "students",    label: "Students",       path: "/academicsupervisor/students" },
];

const getGrade = (score) => {
    if (score >= 90) return { letter: "A",  label: "Distinction",   badge: "badge-green" };
    if (score >= 80) return { letter: "B",  label: "Merit",         badge: "badge-green" };
    if (score >= 70) return { letter: "C",  label: "Credit",        badge: "badge-blue" };
    if (score >= 60) return { letter: "D",  label: "Pass",          badge: "badge-yellow" };
    return               { letter: "F",  label: "Fail",          badge: "badge-red" };
};

function AcademicEvaluations() {
    const [evals, setEvals]         = useState([]);
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [showForm, setShowForm]   = useState(false);
    const [form, setForm]           = useState({ placement: "", score: "", comments: "" });
    const [saving, setSaving]       = useState(false);
    const [msg, setMsg]             = useState({ text: "", type: "" });

    const load = () => {
        setLoading(true);
        Promise.all([api.get("/evaluations/"), api.get("/placements/")])
            .then(([eRes, pRes]) => {
                setEvals(Array.isArray(eRes.data) ? eRes.data : eRes.data.results || []);
                setPlacements(Array.isArray(pRes.data) ? pRes.data : pRes.data.results || []);
            })
            .catch(() => setMsg({ text: "Failed to load data.", type: "error" }))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleSave = async () => {
        if (!form.placement || !form.score) {
            setMsg({ text: "Please select a student and enter a score.", type: "error" }); return;
        }
        if (form.score < 0 || form.score > 100) {
            setMsg({ text: "Score must be between 0 and 100.", type: "error" }); return;
        }
        setSaving(true); setMsg({ text: "", type: "" });
        try {
            await api.post("/evaluations/", form);
            setMsg({ text: "✅ Evaluation submitted successfully.", type: "success" });
            setShowForm(false);
            setForm({ placement: "", score: "", comments: "" });
            load();
        } catch (err) {
            const detail = err.response?.data;
            setMsg({ text: "❌ " + (typeof detail === "object" ? JSON.stringify(detail) : detail || "Failed."), type: "error" });
        } finally { setSaving(false); }
    };

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Academic Supervisor" />
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">Evaluations</h1>
                    <p className="page-sub">Score and evaluate student internship performance</p>
                </div>

                {msg.text && (
                    <div className={`alert ${msg.type === "error" ? "alert-error" : "alert-success"}`}>
                        {msg.text}
                    </div>
                )}

                {/* Grading scale reference */}
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-title">Grading Scale</div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {[
                            { range: "90–100", letter: "A", label: "Distinction", badge: "badge-green" },
                            { range: "80–89",  letter: "B", label: "Merit",       badge: "badge-green" },
                            { range: "70–79",  letter: "C", label: "Credit",      badge: "badge-blue" },
                            { range: "60–69",  letter: "D", label: "Pass",        badge: "badge-yellow" },
                            { range: "0–59",   letter: "F", label: "Fail",        badge: "badge-red" },
                        ].map(g => (
                            <div key={g.letter} className="grade-chip">
                                <span className={`badge ${g.badge}`}>{g.letter}</span>
                                <span className="grade-chip-label">{g.label}</span>
                                <span className="grade-chip-range">{g.range}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="card-title">
                        All Evaluations
                        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(true); setMsg({ text: "", type: "" }); }}>
                            + Add Evaluation
                        </button>
                    </div>
                    {loading ? (
                        <div className="loading-center"><span className="spinner spinner-lg" /></div>
                    ) : evals.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon-svg">
                                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                                </svg>
                            </div>
                            <p>No evaluations yet. Evaluate students after approving their logs.</p>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr><th>Student</th><th>Score</th><th>Grade</th><th>Classification</th><th>Comments</th></tr>
                                </thead>
                                <tbody>
                                    {evals.map(e => {
                                        const grade = getGrade(e.score);
                                        return (
                                            <tr key={e.id}>
                                                <td><strong>{e.student_username || e.placement}</strong></td>
                                                <td><span className={`badge ${grade.badge}`}>{e.score}/100</span></td>
                                                <td><span className={`badge ${grade.badge}`}>{grade.letter}</span></td>
                                                <td className="text-muted text-sm">{grade.label}</td>
                                                <td className="text-muted text-sm">{e.comments || "—"}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ADD EVALUATION MODAL */}
                {showForm && (
                    <div className="modal-backdrop" onClick={() => setShowForm(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-title">Add Evaluation</div>

                            <div className="field">
                                <label>SELECT STUDENT</label>
                                <select
                                    value={form.placement}
                                    onChange={e => setForm({ ...form, placement: e.target.value })}
                                >
                                    <option value="">— Select student —</option>
                                    {placements.length === 0 && (
                                        <option disabled>No placements found — add placements first</option>
                                    )}
                                    {placements.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.student_username || `Student #${p.student}`} — {p.company_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label>SCORE (0 – 100)</label>
                                <input
                                    type="number" min="0" max="100"
                                    placeholder="e.g. 78"
                                    value={form.score}
                                    onChange={e => setForm({ ...form, score: e.target.value })}
                                />
                                {form.score && (
                                    <div style={{ marginTop: 6, fontSize: 13 }}>
                                        Grade: <span className={`badge ${getGrade(Number(form.score)).badge}`}>
                                            {getGrade(Number(form.score)).letter} — {getGrade(Number(form.score)).label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="field">
                                <label>COMMENTS</label>
                                <textarea
                                    rows={4}
                                    placeholder="Overall performance feedback for the student…"
                                    value={form.comments}
                                    onChange={e => setForm({ ...form, comments: e.target.value })}
                                />
                            </div>

                            {msg.text && <div className={`alert ${msg.type === "error" ? "alert-error" : "alert-success"}`}>{msg.text}</div>}

                            <div className="modal-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
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
