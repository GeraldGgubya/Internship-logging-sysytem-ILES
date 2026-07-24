from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import WeeklyLog
from .serializers import WeeklyLogSerializer
from placements.models import Placement


class WeeklyLogViewSet(viewsets.ModelViewSet):
    queryset           = WeeklyLog.objects.all()
    serializer_class   = WeeklyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return WeeklyLog.objects.filter(student=user)
        elif user.role in ('work_supervisor', 'academic_supervisor', 'supervisor'):
            return WeeklyLog.objects.all()
        elif user.role == 'admin':
            return WeeklyLog.objects.all()
        return WeeklyLog.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        # ✅ FIX: Auto-assign the logged-in student — frontend no longer needs to send 'student'
        # ✅ FIX: Auto-fetch the student's real placement — frontend no longer needs to send 'placement'
        placement = Placement.objects.filter(student=user).first()
        serializer.save(student=user, placement=placement)
