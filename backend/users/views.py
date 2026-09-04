from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from weeklylogs.models import WeeklyLog
from placements.models import Placement
from .serializers import UserSerializer
from .permissions import IsStudent, IsSupervisor, IsAdmin

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset           = User.objects.all().order_by('id')
    serializer_class   = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.is_superuser or user.is_staff:
            return User.objects.all().order_by('id')
        return User.objects.none()

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        return Response(UserSerializer(request.user).data)


@api_view(['GET'])
@permission_classes([IsStudent])
def student_dashboard(request):
    user      = request.user
    placement = Placement.objects.filter(student=user).first()
    logs      = WeeklyLog.objects.filter(student=user)
    return Response({
        'user':       user.username,
        'placement':  placement.company_name if placement else None,
        'total_logs': logs.count(),
    })


@api_view(['GET'])
@permission_classes([IsSupervisor])
def supervisor_dashboard(request):
    students = User.objects.filter(role='student')
    logs     = WeeklyLog.objects.all()
    return Response({
        'total_students': students.count(),
        'total_logs':     logs.count(),
    })
@api_view(['GET'])
@permission_classes([AllowAny])
def reset_admin(request):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    u = User.objects.filter(email="admin@uni.ac.ug").first()
    if u:
        u.set_password("Admin123")
        u.save()
        return Response({"message": "Password reset to Admin123"})
    return Response({"message": "User not found"})