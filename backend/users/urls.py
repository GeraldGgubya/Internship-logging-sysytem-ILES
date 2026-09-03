from django.urls import path                                    # ✅ FIX: was missing
from .views import student_dashboard, supervisor_dashboard      # ✅ FIX: typo 'student_dashbord' → 'student_dashboard'

urlpatterns = [
    path('student-dashboard/',    student_dashboard),
    path('supervisor-dashboard/', supervisor_dashboard),
]