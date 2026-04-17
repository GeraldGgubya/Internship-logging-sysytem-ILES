from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Evaluation
from .serializers import EvaluationSerializer
from rest_framework.permissions import IsAuthenticated
class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Evaluation.objects.filter(placement__student=user)
        elif user.role == 'supervisor':
            return Evaluation.objects.all()
        else:
            return Evaluation.objects.none()