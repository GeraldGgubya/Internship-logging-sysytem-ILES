from django.db import models

# Create your models here.
from placements.models import Placement
class Evaluation(models.Model):
    placement = models.ForeignKey(Placement, on_delete=models.CASCADE)
    score = models.IntegerField()
    comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Evaluation for {self.placement} with score {self.score}"