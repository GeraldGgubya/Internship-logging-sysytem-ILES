import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ navItems, role }) {
    const navigate = useNavigate();
    // Read location INSIDE Sidebar so it always reflects the current URL
    const location = useLocation();
    const username = localStorage.getItem("username") || "User";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // SVG icons — reliable across all environments (no emoji font needed)
    const icons = {
        home:        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
        placement:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
        logs:        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
        evaluations: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
        students:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
        review:      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
        signoff:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                </div>
                <div className="sidebar-logo-text">ILES <span>Portal</span></div>
            </div>

            <nav>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            className={`nav-item${isActive ? " active" : ""}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="nav-icon">
                                {icons[item.icon] || icons.home}
                            </span>
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar-bottom">
                <div className="user-chip">
                    <div className="avatar">{username[0]?.toUpperCase()}</div>
                    <div>
                        <div className="user-name">{username}</div>
                        <div className="user-role">{role}</div>
                    </div>
                </div>
                <button className="btn btn-danger btn-full btn-sm" onClick={handleLogout}>
                    Sign out
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
