from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Placement
from .serializers import PlacementSerializer
from rest_framework.permissions import IsAuthenticated
class PlacementViewSet(viewsets.ModelViewSet):
    queryset = Placement.objects.all()
    serializer_class = PlacementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Placement.objects.filter(student=user)
        elif user.role == 'supervisor':
            return Placement.objects.all()
        else:
            return Placement.objects.none()