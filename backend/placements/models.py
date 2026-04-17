from django.db import models

# Create your models here.
from django.conf import settings
User = settings.AUTH_USER_MODEL
class Placement(models.Model):
    student = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    supervisor_name = models.CharField(max_length=255)
    startdate = models.DateField()
    enddate = models.DateField()
    def __str__(self):
        return f"{self.student.username} - {self.company_name}"
    def clean(self):
        if self.enddate < self.startdate:
            raise ValidationError('End date cannot be before start date.')