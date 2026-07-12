import axios from "axios";

// ─── Change this to your deployed URL when going to production ───
export const BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auto-refresh expired token, redirect to login if refresh also fails
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;
            const refresh = localStorage.getItem("refresh_token");
            if (refresh) {
                try {
                    const res = await axios.post(`${BASE_URL}/refresh/`, { refresh });
                    localStorage.setItem("access_token", res.data.access);
                    original.headers.Authorization = `Bearer ${res.data.access}`;
                    return api(original);
                } catch {
                    localStorage.clear();
                    window.location.href = "/";
                    return;
                }
            }
            localStorage.clear();
            window.location.href = "/";
        }
        return Promise.reject(err);
    }
);

export default api;
