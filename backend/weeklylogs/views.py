from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import WeeklyLog
from .serializers import WeeklyLogSerializer
from rest_framework.permissions import IsAuthenticated
class WeeklyLogViewSet(viewsets.ModelViewSet):
    queryset = WeeklyLog.objects.all()
    serializer_class = WeeklyLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # student sees only their logs
        if user.role == 'student':
            return WeeklyLog.objects.filter(student=user)
        # Supervisor sees all logs
        elif user.role == 'supervisor':
            return WeeklyLog.objects.all()
        return WeeklyLog.objects.none()
    def perform_create(self, serializer):
        # Automatically assign logged-in student
        serializer.save(student=self.request.user)