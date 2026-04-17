from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from placements.views import PlacementViewSet
from weeklylogs.views import WeeklyLogViewSet
from evaluations.views import EvaluationViewSet
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'placements', PlacementViewSet)
router.register(r'weeklylogs', WeeklyLogViewSet)
router.register(r'evaluations', EvaluationViewSet)