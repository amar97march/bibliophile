from rest_framework import serializers
from .models import *
from .helpers import send_otp_to_mobile


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id','email', 'password','phone', 'first_name', 'last_name', 'description','profile_image']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create(email = validated_data['email'], phone = validated_data["phone"])
        user.set_password(validated_data['password'])
        user.save()
        send_otp_to_mobile(user.phone, user)
        return user