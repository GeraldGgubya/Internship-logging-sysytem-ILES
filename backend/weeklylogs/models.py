from django.db import models

# Create your models here.
from django.conf import settings
from placements.models import Placement
User = settings.AUTH_USER_MODEL
class WeeklyLog(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    placement = models.ForeignKey(Placement, on_delete=models.CASCADE)
    week_number = models.IntegerField()
    log_content = models.TextField()
    date_submitted = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Weekly Log for {self.student} - Week {self.week_number}"