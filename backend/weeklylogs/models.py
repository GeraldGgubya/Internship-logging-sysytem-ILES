from django.db import models

# Create your models here.
from django.conf import settings
from placements.models import Placement
User = settings.AUTH_USER_MODEL
class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft',     'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed',  'Reviewed'),       # approved by workplace supervisor
        ('approved',  'Approved'),       # final approval by academic supervisor
        ('returned',  'Returned'),       # sent back for changes
    ]

    student             = models.ForeignKey(User, on_delete=models.CASCADE)
    placement           = models.ForeignKey(Placement, on_delete=models.CASCADE)
    week_number         = models.IntegerField()
    log_content         = models.TextField()
    status              = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    supervisor_feedback = models.TextField(blank=True, null=True)
    date_submitted      = models.DateTimeField(auto_now_add=True)