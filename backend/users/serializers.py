from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# ── JWT TOKEN SERIALIZER ──────────────────────────────────────
# Adds role + username into the JWT payload so the frontend
# can decode them without a separate /me/ API call
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"]     = user.role
        token["username"] = user.username
        return token


# ── USER SERIALIZER ───────────────────────────────────────────
class UserSerializer(serializers.ModelSerializer):
    # password is write-only: accepted on create, never returned in responses
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'role', 'phone_number', 'password']

    def create(self, validated_data):
        # Pop password out before creating the user so we can hash it properly
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)   # ← hashes the password correctly
        user.save()
        return user

    def update(self, instance, validated_data):
        # If password is being updated, hash it; otherwise update fields normally
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
