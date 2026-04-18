from rest_framework import serializers
from .models import WeeklyLog
class WeeklyLogSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)
    class Meta:
        model = WeeklyLog
        fields = '__all__'
