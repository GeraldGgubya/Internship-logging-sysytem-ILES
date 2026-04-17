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