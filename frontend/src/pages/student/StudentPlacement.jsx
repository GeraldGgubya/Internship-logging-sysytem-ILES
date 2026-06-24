import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const NAV = [
    { icon: "🏠", label: "Dashboard",    path: "/student/dashboard" },
    { icon: "🏢", label: "My Placement", path: "/student/placement" },
    { icon: "📝", label: "Weekly Logs",  path: "/student/logs" },
    { icon: "📊", label: "Evaluations",  path: "/student/evaluations" },
];

function StudentPlacement() {
    const [placement, setPlacement] = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState("");
    const location = useLocation();

    useEffect(() => {
        api.get("/placements/")
            .then((res) => {
                const results = Array.isArray(res.data) ? res.data : res.data.results || [];
                setPlacement(results[0] || null);
            })
            .catch(() => setError("Failed to load placement details."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="app-layout">
            <Sidebar navItems={NAV} role="Student" activePath={location.pathname} />
            <main className="main">
                <div className="page-header">
                    <h1 className="page-title">My Placement</h1>
                    <p className="page-sub">Your internship placement details</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-center"><span className="spinner spinner-lg" /></div>
                ) : !placement ? (
                    <div className="empty-state">
                        <div className="empty-icon">🏢</div>
                        <p>You have not been assigned a placement yet. Contact your academic supervisor.</p>
                    </div>
                ) : (
                    <div className="card">
                        <div className="card-title">Placement Details</div>
                        <div className="detail-row">
                            <span className="detail-label">Company</span>
                            <strong>{placement.company_name}</strong>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Workplace Supervisor</span>
                            <span>{placement.supervisor_name}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Start Date</span>
                            <span>{placement.startdate}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">End Date</span>
                            <span>{placement.enddate}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Status</span>
                            <span className="badge badge-green">Active</span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default StudentPlacement;
