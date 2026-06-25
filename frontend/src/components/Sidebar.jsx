import { useNavigate } from "react-router-dom";

// navItems: array of { icon, label, path }
// role: string shown under username
// activePath: current page path to highlight active item
function Sidebar({ navItems, role, activePath }) {
    const navigate   = useNavigate();
    const username   = localStorage.getItem("username") || "User";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">🎓</div>
                <div className="sidebar-logo-text">ILES <span>Portal</span></div>
            </div>

            <nav>
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        className={`nav-item ${activePath === item.path ? "active" : ""}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
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
