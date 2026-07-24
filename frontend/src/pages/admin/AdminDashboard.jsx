import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Icon = {
    users:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    placement: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
    assign:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>,
    logout:    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
    plus:      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash:     <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    close:     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

function Modal({ title, onClose, children }) {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <div className="modal-title" style={{ margin:0 }}>{title}</div>
                    <button className="btn btn-ghost btn-sm" style={{ padding:"4px 8px" }} onClick={onClose}>{Icon.close}</button>
                </div>
                {children}
            </div>
        </div>
    );
}

// ── USERS TAB ─────────────────────────────────────────────────
function UsersTab() {
    const [users, setUsers]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [msg, setMsg]           = useState({ text:"", type:"" });
    const [saving, setSaving]     = useState(false);
    const [form, setForm]         = useState({ username:"", email:"", password:"", role:"student", phone_number:"" });

    const ROLE_LABELS = { student:"Student", work_supervisor:"Work Supervisor", academic_supervisor:"Academic Supervisor", admin:"Admin" };
    const ROLE_BADGE  = { student:"badge-purple", work_supervisor:"badge-blue", academic_supervisor:"badge-green", admin:"badge-yellow" };

    const load = () => {
        setLoading(true);
        api.get("/users/")
            .then(res => setUsers(Array.isArray(res.data) ? res.data : res.data.results || []))
            .catch(() => setMsg({ text:"Failed to load users.", type:"error" }))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleCreate = async () => {
        if (!form.username || !form.email || !form.password || !form.role) {
            setMsg({ text:"All fields except phone are required.", type:"error" }); return;
        }
        setSaving(true); setMsg({ text:"", type:"" });
        try {
            await api.post("/users/", form);
            setMsg({ text:`✅ User "${form.username}" created successfully.`, type:"success" });
            setShowForm(false);
            setForm({ username:"", email:"", password:"", role:"student", phone_number:"" });
            load();
        } catch(err) {
            const d = err.response?.data;
            setMsg({ text:"❌ " + (typeof d==="object" ? JSON.stringify(d) : d||"Failed."), type:"error" });
        } finally { setSaving(false); }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete user "${user.username}"?`)) return;
        try {
            await api.delete(`/users/${user.id}/`);
            setMsg({ text:`✅ User "${user.username}" deleted.`, type:"success" });
            load();
        } catch { setMsg({ text:"❌ Failed to delete.", type:"error" }); }
    };

    return (
        <>
            {msg.text && <div className={`alert ${msg.type==="error"?"alert-error":"alert-success"}`}>{msg.text}</div>}
            <div className="card">
                <div className="card-title">
                    All Users
                    <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(true); setMsg({ text:"", type:"" }); }}>
                        {Icon.plus} Create User
                    </button>
                </div>
                {loading ? <div className="loading-center"><span className="spinner spinner-lg"/></div>
                : users.length===0 ? <div className="empty-state"><p>No users yet.</p></div>
                : (
                    <div className="table-wrap">
                        <table>
                            <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Phone</th><th></th></tr></thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td><strong>{u.username}</strong></td>
                                        <td className="text-muted">{u.email}</td>
                                        <td><span className={`badge ${ROLE_BADGE[u.role]||"badge-purple"}`}>{ROLE_LABELS[u.role]||u.role}</span></td>
                                        <td className="text-muted text-sm">{u.phone_number||"—"}</td>
                                        <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(u)}>{Icon.trash}</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showForm && (
                <Modal title="Create New User" onClose={() => setShowForm(false)}>
                    <div className="form-grid">
                        <div className="field"><label>USERNAME</label><input placeholder="e.g. john_doe" value={form.username} onChange={e => setForm({...form, username:e.target.value})}/></div>
                        <div className="field"><label>EMAIL</label><input type="email" placeholder="john@uni.ac.ug" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/></div>
                        <div className="field"><label>PASSWORD</label><input type="password" placeholder="Strong password" value={form.password} onChange={e => setForm({...form, password:e.target.value})}/></div>
                        <div className="field"><label>PHONE (optional)</label><input placeholder="+256 700 000000" value={form.phone_number} onChange={e => setForm({...form, phone_number:e.target.value})}/></div>
                    </div>
                    <div className="field">
                        <label>ROLE</label>
                        <select value={form.role} onChange={e => setForm({...form, role:e.target.value})}>
                            <option value="student">Student</option>
                            <option value="work_supervisor">Workplace Supervisor</option>
                            <option value="academic_supervisor">Academic Supervisor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    {msg.text && <div className={`alert ${msg.type==="error"?"alert-error":"alert-success"}`}>{msg.text}</div>}
                    <div className="modal-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={saving}>
                            {saving ? <span className="spinner"/> : "Create User"}
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}

// ── PLACEMENTS TAB ────────────────────────────────────────────
function PlacementsTab() {
    const [placements, setPlacements] = useState([]);
    const [users, setUsers]           = useState([]);
    const [loading, setLoading]       = useState(true);
    const [showForm, setShowForm]     = useState(false);
    const [msg, setMsg]               = useState({ text:"", type:"" });
    const [saving, setSaving]         = useState(false);
    const [form, setForm]             = useState({ student:"", company_name:"", supervisor_name:"", startdate:"", enddate:"" });

    const load = () => {
        setLoading(true);
        Promise.all([api.get("/placements/"), api.get("/users/")])
            .then(([pRes, uRes]) => {
                setPlacements(Array.isArray(pRes.data) ? pRes.data : pRes.data.results||[]);
                setUsers(Array.isArray(uRes.data) ? uRes.data : uRes.data.results||[]);
            })
            .catch(() => setMsg({ text:"Failed to load data.", type:"error" }))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const students = users.filter(u => u.role==="student");

    const handleCreate = async () => {
        if (!form.student||!form.company_name||!form.supervisor_name||!form.startdate||!form.enddate) {
            setMsg({ text:"All fields are required.", type:"error" }); return;
        }
        setSaving(true); setMsg({ text:"", type:"" });
        try {
            await api.post("/placements/", form);
            setMsg({ text:"✅ Placement created successfully.", type:"success" });
            setShowForm(false);
            setForm({ student:"", company_name:"", supervisor_name:"", startdate:"", enddate:"" });
            load();
        } catch(err) {
            const d = err.response?.data;
            setMsg({ text:"❌ " + (typeof d==="object" ? JSON.stringify(d) : d||"Failed."), type:"error" });
        } finally { setSaving(false); }
    };

    const handleDelete = async (p) => {
        if (!window.confirm(`Remove placement for "${p.student_username}"?`)) return;
        try {
            await api.delete(`/placements/${p.id}/`);
            setMsg({ text:"✅ Placement removed.", type:"success" });
            load();
        } catch { setMsg({ text:"❌ Failed.", type:"error" }); }
    };

    return (
        <>
            {msg.text && <div className={`alert ${msg.type==="error"?"alert-error":"alert-success"}`}>{msg.text}</div>}
            <div className="card">
                <div className="card-title">
                    All Placements
                    <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(true); setMsg({ text:"", type:"" }); }}>
                        {Icon.plus} Assign Placement
                    </button>
                </div>
                {loading ? <div className="loading-center"><span className="spinner spinner-lg"/></div>
                : placements.length===0 ? (
                    <div className="empty-state">
                        <div className="empty-icon-svg">{Icon.placement}</div>
                        <p>No placements yet.</p>
                        <p style={{ fontSize:12, marginTop:8, color:"var(--muted)" }}>Assign a student to a company to get started.</p>
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead><tr><th>Student</th><th>Company</th><th>Work Supervisor</th><th>Start</th><th>End</th><th></th></tr></thead>
                            <tbody>
                                {placements.map(p => (
                                    <tr key={p.id}>
                                        <td><strong>{p.student_username||p.student}</strong></td>
                                        <td>{p.company_name}</td>
                                        <td className="text-muted">{p.supervisor_name}</td>
                                        <td className="text-muted text-sm">{p.startdate}</td>
                                        <td className="text-muted text-sm">{p.enddate}</td>
                                        <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(p)}>{Icon.trash}</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showForm && (
                <Modal title="Assign Placement" onClose={() => setShowForm(false)}>
                    <div className="field">
                        <label>STUDENT</label>
                        <select value={form.student} onChange={e => setForm({...form, student:e.target.value})}>
                            <option value="">— Select student —</option>
                            {students.length===0 && <option disabled>No students found — create a student user first</option>}
                            {students.map(s => <option key={s.id} value={s.id}>{s.username} ({s.email})</option>)}
                        </select>
                    </div>
                    <div className="form-grid">
                        <div className="field"><label>COMPANY NAME</label><input placeholder="e.g. MTN Uganda" value={form.company_name} onChange={e => setForm({...form, company_name:e.target.value})}/></div>
                        <div className="field"><label>WORKPLACE SUPERVISOR NAME</label><input placeholder="e.g. Alice Nakato" value={form.supervisor_name} onChange={e => setForm({...form, supervisor_name:e.target.value})}/></div>
                        <div className="field"><label>START DATE</label><input type="date" value={form.startdate} onChange={e => setForm({...form, startdate:e.target.value})}/></div>
                        <div className="field"><label>END DATE</label><input type="date" value={form.enddate} onChange={e => setForm({...form, enddate:e.target.value})}/></div>
                    </div>
                    {msg.text && <div className={`alert ${msg.type==="error"?"alert-error":"alert-success"}`}>{msg.text}</div>}
                    <div className="modal-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={saving}>
                            {saving ? <span className="spinner"/> : "Assign"}
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}

// ── ASSIGNMENTS TAB ───────────────────────────────────────────
// Shows all placements with supervisor info — no special endpoint needed
function AssignmentsTab() {
    const [placements, setPlacements] = useState([]);
    const [users, setUsers]           = useState([]);
    const [loading, setLoading]       = useState(true);
    const [msg, setMsg]               = useState({ text:"", type:"" });
    const [showForm, setShowForm]     = useState(false);
    const [saving, setSaving]         = useState(false);
    const [form, setForm]             = useState({ placementId:"", supervisor_name:"" });

    const load = () => {
        setLoading(true);
        Promise.all([api.get("/placements/"), api.get("/users/")])
            .then(([pRes, uRes]) => {
                setPlacements(Array.isArray(pRes.data) ? pRes.data : pRes.data.results||[]);
                setUsers(Array.isArray(uRes.data) ? uRes.data : uRes.data.results||[]);
            })
            .catch(() => setMsg({ text:"Failed to load data.", type:"error" }))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const workSupervisors = users.filter(u => u.role==="work_supervisor");
    // ✅ FIX: use placements list for dropdown (each placement has student_username)
    // If no placements exist yet, show a message guiding admin to create one first
    const placementOptions = placements;

    // Update the supervisor_name on the placement record
    const handleAssign = async () => {
        if (!form.placementId || !form.supervisor_name) {
            setMsg({ text:"Please select both a student placement and a supervisor.", type:"error" }); return;
        }
        setSaving(true); setMsg({ text:"", type:"" });
        try {
            await api.patch(`/placements/${form.placementId}/`, { supervisor_name: form.supervisor_name });
            setMsg({ text:"✅ Supervisor assigned successfully.", type:"success" });
            setShowForm(false);
            setForm({ placementId:"", supervisor_name:"" });
            load();
        } catch(err) {
            const d = err.response?.data;
            setMsg({ text:"❌ " + (typeof d==="object" ? JSON.stringify(d) : d||"Failed."), type:"error" });
        } finally { setSaving(false); }
    };

    return (
        <>
            {msg.text && <div className={`alert ${msg.type==="error"?"alert-error":"alert-success"}`}>{msg.text}</div>}
            <div className="card">
                <div className="card-title">
                    Supervisor Assignments
                    <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(true); setMsg({ text:"", type:"" }); }}>
                        {Icon.plus} Assign Supervisor
                    </button>
                </div>
                {loading ? <div className="loading-center"><span className="spinner spinner-lg"/></div>
                : placements.length===0 ? (
                    <div className="empty-state">
                        <p>No placements yet. Create placements first in the Placements tab.</p>
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead><tr><th>Student</th><th>Company</th><th>Work Supervisor Assigned</th><th>Status</th></tr></thead>
                            <tbody>
                                {placements.map(p => (
                                    <tr key={p.id}>
                                        <td><strong>{p.student_username||`Student #${p.student}`}</strong></td>
                                        <td>{p.company_name}</td>
                                        <td>{p.supervisor_name
                                            ? <span className="badge badge-green">{p.supervisor_name}</span>
                                            : <span className="badge badge-red">Not assigned</span>}
                                        </td>
                                        <td><span className="badge badge-green">Active</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showForm && (
                <Modal title="Assign Work Supervisor" onClose={() => setShowForm(false)}>
                    <div className="field">
                        <label>SELECT STUDENT PLACEMENT</label>
                        <select value={form.placementId} onChange={e => setForm({...form, placementId:e.target.value})}>
                            <option value="">— Select student —</option>
                            {placementOptions.length === 0
                                ? <option disabled>No placements yet — go to Placements tab first</option>
                                : placementOptions.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.student_username || `Student #${p.student}`} — {p.company_name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="field">
                        <label>WORKPLACE SUPERVISOR</label>
                        <select value={form.supervisor_name} onChange={e => setForm({...form, supervisor_name:e.target.value})}>
                            <option value="">— Select supervisor —</option>
                            {workSupervisors.length===0
                                ? <option disabled>No work supervisors found — create one first</option>
                                : workSupervisors.map(s => <option key={s.id} value={s.username}>{s.username} ({s.email})</option>)
                            }
                        </select>
                    </div>
                    {msg.text && <div className={`alert ${msg.type==="error"?"alert-error":"alert-success"}`}>{msg.text}</div>}
                    <div className="modal-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="btn btn-primary btn-sm" onClick={handleAssign} disabled={saving}>
                            {saving ? <span className="spinner"/> : "Assign"}
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}

// ── MAIN ADMIN DASHBOARD ──────────────────────────────────────
function AdminDashboard() {
    const [tab, setTab]     = useState("users");
    const [stats, setStats] = useState({ users:0, placements:0, logs:0 });
    const navigate          = useNavigate();
    const username          = localStorage.getItem("username") || "Admin";

    useEffect(() => {
        Promise.all([api.get("/users/"), api.get("/placements/"), api.get("/weeklylogs/")])
            .then(([u,p,l]) => setStats({
                users:      (Array.isArray(u.data)?u.data:u.data.results||[]).length,
                placements: (Array.isArray(p.data)?p.data:p.data.results||[]).length,
                logs:       (Array.isArray(l.data)?l.data:l.data.results||[]).length,
            }))
            .catch(()=>{});
    },[]);

    const handleLogout = () => { localStorage.clear(); navigate("/"); };

    const tabs = [
        { key:"users",       label:"Users",       icon:Icon.users },
        { key:"placements",  label:"Placements",  icon:Icon.placement },
        { key:"assignments", label:"Assignments", icon:Icon.assign },
    ];

    return (
        <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
            <header className="admin-navbar">
                <div className="admin-navbar-brand">
                    <div className="sidebar-logo-icon" style={{ width:32, height:32, fontSize:14 }}>
                        <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                        </svg>
                    </div>
                    <span className="admin-navbar-title">ILES <span>Admin</span></span>
                </div>
                <div className="admin-navbar-right">
                    <div className="user-chip" style={{ marginBottom:0 }}>
                        <div className="avatar" style={{ width:30, height:30, fontSize:13 }}>{username[0]?.toUpperCase()}</div>
                        <div><div className="user-name">{username}</div><div className="user-role">Administrator</div></div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:6 }}>
                        {Icon.logout} Sign out
                    </button>
                </div>
            </header>

            <div className="admin-body">
                <div className="page-header">
                    <h1 className="page-title">Admin Dashboard</h1>
                    <p className="page-sub">Manage users, placements, and supervisor assignments</p>
                </div>

                <div className="stats-grid" style={{ marginBottom:28 }}>
                    <div className="stat-card"><div className="stat-label">Total Users</div><div className="stat-value stat-accent">{stats.users}</div></div>
                    <div className="stat-card"><div className="stat-label">Placements</div><div className="stat-value stat-green">{stats.placements}</div></div>
                    <div className="stat-card"><div className="stat-label">Weekly Logs</div><div className="stat-value stat-yellow">{stats.logs}</div></div>
                </div>

                <div className="admin-tabs">
                    {tabs.map(t => (
                        <button key={t.key} className={`admin-tab${tab===t.key?" active":""}`} onClick={() => setTab(t.key)}>
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                <div style={{ marginTop:20 }}>
                    {tab==="users"       && <UsersTab/>}
                    {tab==="placements"  && <PlacementsTab/>}
                    {tab==="assignments" && <AssignmentsTab/>}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
