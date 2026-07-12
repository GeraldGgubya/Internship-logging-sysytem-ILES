import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Map role → dashboard path
const ROLE_ROUTES = {
    admin:               "/admin/dashboard",
    work_supervisor:     "/worksupervisor/dashboard",
    academic_supervisor: "/academicsupervisor/dashboard",
    student:             "/student/dashboard",
};

function Login() {
    const [email, setEmail]     = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState("");
    const navigate = useNavigate();

    // If already logged in, skip login page
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const role  = localStorage.getItem("role");
        if (token && role && ROLE_ROUTES[role]) {
            navigate(ROLE_ROUTES[role], { replace: true });
        }
    }, [navigate]);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login/", {
                email,
                password,
            });

            const { access, refresh } = response.data;
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            // Decode role + username from JWT payload
            const payload  = JSON.parse(atob(access.split(".")[1]));
            const role     = payload.role || "student";
            const username = payload.username || email;
            localStorage.setItem("role", role);
            localStorage.setItem("username", username);

            navigate(ROLE_ROUTES[role] || "/student/dashboard", { replace: true });
        } catch (err) {
            const msg = err.response?.data?.detail || "Login failed. Check your email and password.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrap">
            <div className="login-card">

                {/* Logo — SVG only, no emoji */}
                <div className="login-logo">
                    <div className="login-logo-icon">
                        <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                        </svg>
                    </div>
                    <div className="login-logo-text">ILES <span>Portal</span></div>
                </div>

                <h1 className="login-title">Welcome back</h1>
                <p className="login-sub">Sign in to your internship account</p>

                {error && <div className="alert alert-error">⚠ {error}</div>}

                <div className="field">
                    <label>EMAIL ADDRESS</label>
                    <input
                        type="email"
                        placeholder="you@university.ac.ug"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleLogin()}
                        autoFocus
                    />
                </div>

                <div className="field">
                    <label>PASSWORD</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleLogin()}
                    />
                </div>

                <button
                    className="btn btn-primary btn-full"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? <span className="spinner" /> : "Sign in"}
                </button>

                <p style={{ marginTop: 20, fontSize: 12, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
                    Internship Logging &amp; Evaluation System<br />
                    Makerere University
                </p>
            </div>
        </div>
    );
}

export default Login;
