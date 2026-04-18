from rest_framework import serializers
from .models import Evaluation
class EvaluationSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)
    class Meta:
        model = Evaluation
        fields = '__all__'