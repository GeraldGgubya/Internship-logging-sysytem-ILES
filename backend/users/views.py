from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .permissions import IsStudent # type: ignore
from weeklylogs.models import WeeklyLog
from placements.models import Placement
@api_view(['GET'])
@permission_classes([IsStudent])
def student_dashboard(request):
    user = request.user
    placements = Placement.objects.filter(student=user).first()
    weekly_logs = WeeklyLog.objects.filter(student=user)
    return Response({
        'user': user.username,
        'placements': placement.company_name if placements else None, # type: ignore
        'total_logs': logs.count(),  # type: ignore
    })
from .permissions import IsSupervisor # type: ignore
from django.contrib.auth import get_user_model
from weeklylogs.models import WeeklyLog
User = get_user_model()
@api_view(['GET'])
@permission_classes([IsSupervisor])
def supervisor_dashboard(request):
    students = User.objects.filter(role ='Students')
    logs = WeeklyLog.objects.all()
    return Response({
        'total_students': students.count(),
        'total_logs': logs.count(),
    })