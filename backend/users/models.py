from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
class User(AbstractUser):
    # Authenticate using email (so Django admin login works with email + password)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    ROLE_CHOICES = (
    ('student',              'Student'),
    ('work_supervisor',      'Workplace Supervisor'),
    ('academic_supervisor',  'Academic Supervisor'),
    ('admin',                'Admin'),
)

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True)

    # Must be unique because email is used as USERNAME_FIELD.
    # Note: if you already have duplicate emails in your DB, migrations will fail.
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username
