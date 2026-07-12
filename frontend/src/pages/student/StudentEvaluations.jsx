import { useState, useEffect } from "react";

import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "home", label: "Dashboard",    path: "/student/dashboard" },
    { icon: "placement", label: "My Placement", path: "/student/placement" },
    { icon: "logs", label: "Weekly Logs",  path: "/student/logs" },
    { icon: "evaluations", label: "Evaluations",  path: "/student/evaluations" },
];

function StudentEvaluations() {
    const [evals, setEvals]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");
    

    useEffect(() => {
        api.get("/evaluations/")
            .then((res) => setEvals(Array.isArray(res.data) ? res.data : res.data.results || []))
            .catch(() => setError("Failed to load evaluations."))
            .finally(() => setLoading(false));
    }, []);

    const scoreBadge = (score) => {
        if (score >= 80) return "badge-green";
        if (score >= 60) return "badge-yellow";
        return "badge-red";
    };

    const scoreLabel = (score) => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Satisfactory";
        return "Needs Improvement";
    };

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Student"  />
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">My Evaluations</h1>
                    <p className="page-sub">Scores submitted by your academic supervisor</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-center"><span className="spinner spinner-lg" /></div>
                ) : evals.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <p>No evaluations yet. Your academic supervisor will evaluate you after approving your logs.</p>
                    </div>
                ) : (
                    <>
                        {/* Score summary */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Evaluations Received</div>
                                <div className="stat-value stat-accent">{evals.length}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Average Score</div>
                                <div className="stat-value stat-green">
                                    {Math.round(evals.reduce((s, e) => s + e.score, 0) / evals.length)}/100
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">Evaluation Records</div>
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Score</th>
                                            <th>Grade</th>
                                            <th>Comments from Supervisor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {evals.map((e) => (
                                            <tr key={e.id}>
                                                <td>
                                                    <span className={`badge ${scoreBadge(e.score)}`}>
                                                        {e.score}/100
                                                    </span>
                                                </td>
                                                <td className="text-muted text-sm">{scoreLabel(e.score)}</td>
                                                <td className="text-muted text-sm">{e.comments || "No comments provided."}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default StudentEvaluations;
