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