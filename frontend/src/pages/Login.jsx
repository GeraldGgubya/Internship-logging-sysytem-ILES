import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            // ✅ FIX 1: Backend uses email (not username) as USERNAME_FIELD
            // ✅ FIX 2: Trailing slash required by Django
            const response = await axios.post("http://127.0.0.1:8000/api/login/", {
                email,
                password,
            });

            const { access, refresh } = response.data;
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            // ✅ FIX 3: Decode role from JWT payload (SimpleJWT doesn't return user object)
            // Requires custom TokenObtainPairSerializer in backend — see README
            const payload = JSON.parse(atob(access.split(".")[1]));
            const role = payload.role || "student";
            localStorage.setItem("role", role);
            localStorage.setItem("username", payload.username || email);

            if (role === "supervisor" || role === "admin") {
                navigate("/supervisor-dashboard");
            } else {
                navigate("/student-dashboard");
            }
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
                {/* Logo */}
                <div className="login-logo">
                    <div className="login-logo-icon">🎓</div>
                    <div className="login-logo-text">
                        ILES <span>Portal</span>
                    </div>
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
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                </div>

                <div className="field">
                    <label>PASSWORD</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                </div>

                <button
                    className="btn btn-primary btn-full"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? <span className="spinner" /> : "Sign in"}
                </button>
            </div>
        </div>
    );
}

export default Login;
