from rest_framework import serializers
from .models import WeeklyLog


class WeeklyLogSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model  = WeeklyLog
        fields = '__all__'
        # ✅ FIX: student and placement are set automatically in perform_create
        # frontend only needs to send: week_number, log_content, status
        read_only_fields = ['student', 'placement', 'date_submitted']
