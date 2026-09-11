import { useState, useEffect } from "react";
import api from "../../services/api";

const getGrade = (score) => {
    if (score >= 90) return { letter: "A", label: "Distinction", badge: "badge-green" };
    if (score >= 80) return { letter: "B", label: "Merit",       badge: "badge-green" };
    if (score >= 70) return { letter: "C", label: "Credit",      badge: "badge-blue" };
    if (score >= 60) return { letter: "D", label: "Pass",        badge: "badge-yellow" };
    return               { letter: "F", label: "Fail",        badge: "badge-red" };
};

function StudentEvaluations() {
    const [evals, setEvals]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");

    useEffect(() => {
        api.get("/evaluations/")
            .then(res => setEvals(Array.isArray(res.data) ? res.data : res.data.results || []))
            .catch(() => setError("Failed to load evaluations."))
            .finally(() => setLoading(false));
    }, []);

    const avg = evals.length
        ? Math.round(evals.reduce((s, e) => s + e.score, 0) / evals.length)
        : null;

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">My Evaluations</h1>
                <p className="page-sub">Scores submitted by your academic supervisor</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
                <div className="loading-center"><span className="spinner spinner-lg" /></div>
            ) : evals.length === 0 ? (
                <div className="empty-state">
                    <p>No evaluations yet. Your academic supervisor will evaluate you after approving your logs.</p>
                </div>
            ) : (
                <>
                    {avg !== null && (
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Evaluations Received</div>
                                <div className="stat-value stat-accent">{evals.length}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Average Score</div>
                                <div className="stat-value stat-green">{avg}/100</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Overall Grade</div>
                                <div className="stat-value stat-accent" style={{ fontSize: 36 }}>{getGrade(avg).letter}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Classification</div>
                                <div className="stat-value stat-accent" style={{ fontSize: 16 }}>{getGrade(avg).label}</div>
                            </div>
                        </div>
                    )}
                    <div className="card">
                        <div className="card-title">Evaluation Records</div>
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr><th>Score</th><th>Grade</th><th>Classification</th><th>Comments</th></tr>
                                </thead>
                                <tbody>
                                    {evals.map(e => {
                                        const grade = getGrade(e.score);
                                        return (
                                            <tr key={e.id}>
                                                <td><span className={`badge ${grade.badge}`}>{e.score}/100</span></td>
                                                <td><span className={`badge ${grade.badge}`}>{grade.letter}</span></td>
                                                <td className="text-muted text-sm">{grade.label}</td>
                                                <td className="text-muted text-sm">{e.comments || "No comments."}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default StudentEvaluations;
