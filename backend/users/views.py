from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from weeklylogs.models import WeeklyLog
from placements.models import Placement
from .serializers import UserSerializer
from .permissions import IsStudent, IsSupervisor, IsAdmin

User = get_user_model()


# ── USER VIEWSET ──────────────────────────────────────────────
# Provides: GET /api/users/        → list all users     (admin only)
#           POST /api/users/       → create a user      (admin only)
#           GET /api/users/{id}/   → get one user       (admin only)
#           PATCH /api/users/{id}/ → update a user      (admin only)
#           DELETE /api/users/{id}/→ delete a user      (admin only)
class UserViewSet(viewsets.ModelViewSet):
    queryset           = User.objects.all().order_by('id')
    serializer_class   = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    # Optional: non-admins can view their own profile
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# ── STUDENT DASHBOARD ─────────────────────────────────────────
# GET /api/users/student-dashboard/
@api_view(['GET'])
@permission_classes([IsStudent])
def student_dashboard(request):
    user      = request.user
    placement = Placement.objects.filter(student=user).first()  # FIX: was 'placements'
    logs      = WeeklyLog.objects.filter(student=user)          # FIX: was 'weekly_logs'
    return Response({
        'user':       user.username,
        'placement':  placement.company_name if placement else None,  # FIX: was 'placements.company_name'
        'total_logs': logs.count(),                                   # FIX: was 'logs.count()' on wrong var
    })


# ── SUPERVISOR DASHBOARD ──────────────────────────────────────
# GET /api/users/supervisor-dashboard/
@api_view(['GET'])
@permission_classes([IsSupervisor])
def supervisor_dashboard(request):
    students = User.objects.filter(role='student')   # FIX: was 'Students' (wrong case)
    logs     = WeeklyLog.objects.all()
    return Response({
        'total_students': students.count(),
        'total_logs':     logs.count(),
    })
