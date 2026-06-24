# ILES Frontend — What Was Fixed

## Bug Fixes

### 1. Login was sending `username` instead of `email`
Your backend sets `USERNAME_FIELD = "email"`, so Django expects `email` in the login request.
- ❌ Before: `{ username, password }`
- ✅ After:  `{ email, password }`

### 2. Missing trailing slashes on all API URLs
Django returns a 301 redirect or 404 without trailing slashes.
- ❌ Before: `/api/login`, `/api/student-dashboard`
- ✅ After:  `/api/login/`, `/api/users/student-dashboard/`, `/api/users/supervisor-dashboard/`

### 3. `data.user.role` doesn't exist in JWT response
SimpleJWT only returns `{ access, refresh }` — no user object. Role must be decoded from the token payload.
- ❌ Before: `localStorage.setItem("role", data.user.role)` → crashes
- ✅ After:  Decode JWT: `JSON.parse(atob(access.split(".")[1]))` → read `.role`

### 4. Token stored as `"token"` — inconsistent key name
- ✅ Now stored as `"access_token"` and `"refresh_token"` consistently across all files.

### 5. No error handling (only `alert()`)
- ✅ Now shows inline error messages with proper styling.

### 6. No loading states
- ✅ Spinner shown while API calls are in progress.

### 7. No logout button
- ✅ Sidebar now has a Sign out button that clears localStorage and redirects to login.

### 8. Zero styling — plain unstyled HTML
- ✅ Full dark-theme design with sidebar layout, stat cards, badges, and responsive mobile support.

---

## Required Backend Change (for role in JWT)

Add this to `users/serializers.py`:

```python
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role          # ← adds role to JWT
        token["username"] = user.username  # ← adds username to JWT
        return token
```

And in `settings.py`:

```python
SIMPLE_JWT = {
    "TOKEN_OBTAIN_SERIALIZER": "users.serializers.MyTokenObtainPairSerializer",
}
```

---

## File Structure

```
src/
├── pages/
│   ├── Login.jsx              ← fixed
│   ├── StudentDashboard.jsx   ← fixed + styled
│   └── SupervisorDashboard.jsx← fixed + styled
├── App.jsx                    ← unchanged routing
├── App.css                    ← full design system
├── index.css                  ← minimal
└── main.jsx                   ← imports App.css
# ILES Frontend — Complete Setup Guide

## Final File Structure

```
src/
├── components/
│   └── Sidebar.jsx                        ← shared sidebar (all dashboards use this)
├── services/
│   └── api.js                             ← axios instance, auto token attach & refresh
├── pages/
│   ├── authenticationPage/
│   │   └── Login.jsx                      ← email login, routes by role
│   ├── student/
│   │   ├── StudentDashboard.jsx
│   │   ├── StudentLogs.jsx                ← list logs, see status, resubmit returned
│   │   ├── CreateLog.jsx                  ← create new OR edit/resubmit returned log
│   │   ├── StudentPlacement.jsx           ← view placement details
│   │   └── StudentEvaluations.jsx         ← view scores from academic supervisor
│   ├── worksupervisor/
│   │   ├── WorkSupervisorDashboard.jsx
│   │   ├── WorkSupervisorReviewLogs.jsx   ← approve logs or return with feedback
│   │   └── WorkSupervisorStudents.jsx     ← view assigned students
│   └── academicsupervisor/
│       ├── AcademicSupervisorDashboard.jsx
│       ├── AcademicReviewLogs.jsx         ← final approve or request changes
│       ├── AcademicEvaluations.jsx        ← submit student scores
│       └── AcademicStudents.jsx           ← view all students
├── App.jsx                                ← all routes
├── App.css                                ← full design system
├── main.jsx
└── index.css
```

---

## Workflow Implemented

```
Student submits log (status: "submitted")
        ↓
Workplace Supervisor reviews
   ├── Approve  → status: "reviewed"  → goes to Academic Supervisor
   └── Return   → status: "returned"  → student edits and resubmits
        ↓
Academic Supervisor final sign-off
   ├── Final Approve  → status: "approved" ✅
   └── Request Changes→ status: "returned" → student resubmits again
        ↓
Academic Supervisor submits Evaluation (score + comments)
```

---

## Required Backend Changes

### 1. Add `status` and `supervisor_feedback` fields to WeeklyLog model

In `weeklylogs/models.py`:
```python
class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft',     'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed',  'Reviewed'),       # approved by workplace supervisor
        ('approved',  'Approved'),       # final approval by academic supervisor
        ('returned',  'Returned'),       # sent back for changes
    ]

    student             = models.ForeignKey(User, on_delete=models.CASCADE)
    placement           = models.ForeignKey(Placement, on_delete=models.CASCADE)
    week_number         = models.IntegerField()
    log_content         = models.TextField()
    status              = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    supervisor_feedback = models.TextField(blank=True, null=True)
    date_submitted      = models.DateTimeField(auto_now_add=True)
```

Run migrations after:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Add role to JWT token

In `users/serializers.py`:
```python
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role']     = user.role
        token['username'] = user.username
        return token
```

In `settings.py`:
```python
SIMPLE_JWT = {
    "TOKEN_OBTAIN_SERIALIZER": "users.serializers.MyTokenObtainPairSerializer",
}
```

### 3. Add role values for the two supervisors

In your `users/models.py` update ROLE_CHOICES:
```python
ROLE_CHOICES = (
    ('student',              'Student'),
    ('work_supervisor',      'Workplace Supervisor'),
    ('academic_supervisor',  'Academic Supervisor'),
    ('admin',                'Admin'),
)
```

---

## How to Copy Files Into Your Project

Replace these files in `Internship-logging-sysytem-ILES/frontend/src/`:

1. Copy `components/Sidebar.jsx`         → `src/components/Sidebar.jsx`
2. Copy `services/api.js`                → `src/services/api.js`
3. Copy `pages/authenticationPage/Login.jsx` → replace your existing Login
4. Copy all `pages/student/` files       → `src/pages/student/`
5. Copy all `pages/worksupervisor/` files→ `src/pages/worksupervisor/`
6. Copy all `pages/academicsupervisor/`  → `src/pages/academicsupervisor/`
7. Replace `App.jsx`, `App.css`, `main.jsx`

---

## Then run:
```bash
npm run dev
```