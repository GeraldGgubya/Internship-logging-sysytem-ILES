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
