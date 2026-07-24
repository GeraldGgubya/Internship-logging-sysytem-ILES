from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Placement
from .serializers import PlacementSerializer
from users.permissions import IsAdmin


class PlacementViewSet(viewsets.ModelViewSet):
    serializer_class   = PlacementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # ✅ FIX: is_staff covers superusers created via createsuperuser
        # role=='admin' covers users created via the admin dashboard
        if user.role == 'admin' or user.is_staff or user.is_superuser:
            return Placement.objects.all()

        if user.role == 'student':
            return Placement.objects.filter(student=user)

        if user.role in ('work_supervisor', 'academic_supervisor'):
            return Placement.objects.all()

        return Placement.objects.none()

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]
