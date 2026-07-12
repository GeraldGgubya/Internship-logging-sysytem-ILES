import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home", label: "Dashboard",    path: "/student/dashboard" },
    { icon: "placement", label: "My Placement", path: "/student/placement" },
    { icon: "logs", label: "Weekly Logs",  path: "/student/logs" },
    { icon: "evaluations", label: "Evaluations",  path: "/student/evaluations" },
];

// This component handles both CREATE (no id) and EDIT/RESUBMIT (with id)
function CreateLog() {
    const { id }  = useParams();             // present when editing
    const isEdit  = Boolean(id);
    const navigate = useNavigate();
    

    const [form, setForm]       = useState({ week_number: "", log_content: "", placement: "" });
    const [saving, setSaving]   = useState(false);
    const [error, setError]     = useState("");
    const [success, setSuccess] = useState("");

    // Pre-fill form when editing a returned log
    useEffect(() => {
        if (isEdit) {
            api.get(`/weeklylogs/${id}/`)
                .then((res) => setForm({
                    week_number: res.data.week_number,
                    log_content: res.data.log_content,
                    placement:   res.data.placement,
                }))
                .catch(() => setError("Could not load log."));
        }
    }, [id, isEdit]);

    const handleSave = async (submitNow = false) => {
        if (!form.week_number || !form.log_content || !form.placement) {
            setError("Please fill in all fields."); return;
        }
        setSaving(true); setError(""); setSuccess("");
        try {
            const payload = { ...form, status: submitNow ? "submitted" : "draft" };
            if (isEdit) {
                await api.patch(`/weeklylogs/${id}/`, payload);
                setSuccess(submitNow ? "Log resubmitted successfully!" : "Log saved as draft.");
            } else {
                await api.post("/weeklylogs/", payload);
                setSuccess(submitNow ? "Log submitted successfully!" : "Log saved as draft.");
            }
            setTimeout(() => navigate("/student/logs"), 1200);
        } catch (err) {
            setError(err.response?.data ? JSON.stringify(err.response.data) : "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Student"  />

            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">{isEdit ? "Edit & Resubmit Log" : "Submit Weekly Log"}</h1>
                    <p className="page-sub">
                        {isEdit
                            ? "Make your changes and resubmit for review."
                            : "Record your activities for this week before the deadline."}
                    </p>
                </div>

                {error   && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="card">
                    <div className="form-grid">
                        <div className="field">
                            <label>PLACEMENT ID</label>
                            <input
                                type="number"
                                placeholder="Your placement ID"
                                value={form.placement}
                                onChange={(e) => setForm({ ...form, placement: e.target.value })}
                            />
                        </div>
                        <div className="field">
                            <label>WEEK NUMBER</label>
                            <input
                                type="number"
                                placeholder="e.g. 3"
                                value={form.week_number}
                                onChange={(e) => setForm({ ...form, week_number: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label>LOG CONTENT</label>
                        <textarea
                            rows={8}
                            placeholder="Describe what you did this week, skills learned, challenges faced…"
                            value={form.log_content}
                            onChange={(e) => setForm({ ...form, log_content: e.target.value })}
                        />
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-ghost" onClick={() => navigate("/student/logs")}>
                            Cancel
                        </button>
                        <button className="btn btn-ghost" onClick={() => handleSave(false)} disabled={saving}>
                            Save as Draft
                        </button>
                        <button className="btn btn-primary" onClick={() => handleSave(true)} disabled={saving}>
                            {saving ? <span className="spinner" /> : isEdit ? "Resubmit Log" : "Submit Log"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CreateLog;
