from django.contrib.auth.models import User
from rest_framework import serializers

# Serializes User data (username, email, and password)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Specifies the User model
        fields = ['username', 'email', 'password']  # Fields to be included in the serialization
