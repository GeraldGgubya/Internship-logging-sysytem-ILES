from rest_framework.permissions import BasePermission

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        # Example logic: only allow users with role 'student'
        return hasattr(request.user, 'role') and request.user.role == 'student'
class IsSupervisor(BasePermission):
    def has_permission(self, request, view):
        # Example logic: only allow users with role 'supervisor'
        return hasattr(request.user, 'role') and request.user.role == 'supervisor'