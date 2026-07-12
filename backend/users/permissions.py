from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    """Allows access only to users with role='student'."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'student'
        )


class IsSupervisor(BasePermission):
    """Allows access to both work_supervisor and academic_supervisor."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ('work_supervisor', 'academic_supervisor', 'supervisor')
        )


class IsWorkSupervisor(BasePermission):
    """Allows access only to workplace supervisors."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'work_supervisor'
        )


class IsAcademicSupervisor(BasePermission):
    """Allows access only to academic supervisors."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'academic_supervisor'
        )


class IsAdmin(BasePermission):
    """Allows access only to admin users."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'admin'
        )


class IsAdminOrReadOnly(BasePermission):
    """Admin can do everything; others can only read (GET)."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return request.user.role == 'admin'
