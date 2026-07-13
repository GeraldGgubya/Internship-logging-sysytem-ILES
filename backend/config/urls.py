from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .router import router


# ✅ FIX: Use your custom serializer so role+username go into the JWT token
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/',   CustomTokenObtainPairView.as_view()),  # ✅ was TokenObtainPairView (no role in token)
    path('api/refresh/', TokenRefreshView.as_view()),
    path('api/',         include(router.urls)),
    path('api/users/',   include('users.urls')),                # ✅ ADD: connects dashboard endpoints
]