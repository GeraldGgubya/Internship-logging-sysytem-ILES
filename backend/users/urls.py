from django.urls import path                                    # ✅ FIX: was missing
from .views import student_dashboard, supervisor_dashboard      # ✅ FIX: typo 'student_dashbord' → 'student_dashboard'

urlpatterns = [
    path('student-dashboard/',    student_dashboard),
    path('supervisor-dashboard/', supervisor_dashboard),
]
from django.urls import path
from .views import student_dashboard, supervisor_dashboard, create_admin

urlpatterns = [
    path('student-dashboard/',    student_dashboard),
    path('supervisor-dashboard/', supervisor_dashboard),
    path('create-admin/',         create_admin),   # ← add this
]