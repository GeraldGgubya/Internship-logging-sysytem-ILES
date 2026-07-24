from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'student'
        )


class IsSupervisor(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ('work_supervisor', 'academic_supervisor', 'supervisor')
        )


class IsWorkSupervisor(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'work_supervisor'
        )


class IsAcademicSupervisor(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'academic_supervisor'
        )


class IsAdmin(BasePermission):
    """
    Allows access to:
    - Users with role='admin'
    - Django superusers (created via createsuperuser)
    - Staff users (is_staff=True)
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (
                request.user.role == 'admin' or
                request.user.is_superuser or
                request.user.is_staff
            )
        )


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return (
            request.user.role == 'admin' or
            request.user.is_superuser or
            request.user.is_staff
        )
