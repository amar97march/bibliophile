"""Serializer for user"""
from rest_framework import serializers
from .models import *
# from .helpers import send_otp_to_mobile


class UserSerializer(serializers.ModelSerializer):
    """ Serializer for user"""
    class Meta:
        model = User
        fields = ['id','sub','email','first_name' ,'last_name' , 'password','phone', 'description','profile_image']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create(email=validated_data['email'],
                                   phone=validated_data["phone"],
                                #    first_name=validated_data["first_name"],
                                #    last_name=validated_data["last_name"]
                                   )
        user.set_password(validated_data['password'])
        user.save()
        # send_otp_to_mobile(user.phone, user)
        return user

    def update(self, user, validated_data):
        user.email = validated_data.get('email', user.email)
        user.first_name = validated_data.get('first_name', user.first_name)
        user.last_name = validated_data.get('last_name', user.last_name)
        user.phone = validated_data.get('phone', user.phone)
        user.description = validated_data.get('description', user.description)
        user.save()
        return user
