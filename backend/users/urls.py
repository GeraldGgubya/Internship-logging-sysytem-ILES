from os import path

from .views import student_dashbord, supervisor_dashboard
urlpatterns = [
    path('student-dashboard/', student_dashbord),
    path('supervisor-dashboard/', supervisor_dashboard),
]
