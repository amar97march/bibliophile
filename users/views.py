""" Views for Users APIs """
from rest_framework.response import Response
from .models import *
from .serializers import *

from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .helpers import send_otp_to_mobile, user_profile_pic_update, send_email_token,\
    friend_profile_data, user_profile_data, get_homepage_data
from rest_framework_simplejwt.tokens import RefreshToken
from books.models import *
import random
from django.core.mail import send_mail
import logging


class RegisterView(CreateModelMixin, GenericAPIView):
    """Review view api"""

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        """ User Creation API """
        return self.create(request, *args, **kwargs)


class UpdateProfile(APIView):
    """  Update user api class """
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        """Update user details api"""
        try:
            profile_image = request.FILES.get('profile_image', None)
            user = request.user
            user_obj = User.objects.get(id=user.id)
            serializer = UserSerializer(
                user_obj, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response({'status': 404, 'error': random.serializer.errors})
            serializer.save()
            
            if profile_image:
                user_profile_pic_update(user_obj, profile_image)
            return Response({'status': 200, 'message': 'User profile updated'})
        except Exception as e:
            logging.error(e)
        return Response({'status': 404, 'error': 'something went wrong'})


class UpdateProfilePicture(APIView):
    """  Update user api class """
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        """Update user details api"""
        try:
            profile_image = request.FILES.get('profile_image', None)
            user = request.user
            user_obj = User.objects.get(id=user.id)
            if profile_image:
                user_profile_pic_update(user_obj, profile_image)
            return Response({'status': 200, 'message': 'User profile updated'})
        except Exception as e:
            logging.error(e)
        return Response({'status': 404, 'error': 'something went wrong'})


class VerifyOtp(APIView):
    """Verify OTP url class"""

    def post(self, request):
        """Ceerify by OTP method"""
        try:
            data = request.data

            user_obj = User.objects.get(email=data.get('email'))
            otp = data.get('otp')

            if user_obj.otp == otp:
                user_obj.is_phone_verified = True
                user_obj.save()
                refresh = RefreshToken.for_user(user_obj)
                return Response({"status": 200, "message": "your OTP is verified", 'refresh': str(refresh),
                                 'access': str(refresh.access_token), })

            return Response({"status": 403, "message": "your otp is wrong"}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            logging.error(e)
        return Response({"status": 404, "error": "something went wrong"}, status=status.HTTP_403_FORBIDDEN)

    def patch(self, request):
        """Resend OTP and email method"""
        try:
            data = request.data
            user_obj = User.objects.filter(email=data.get('email'))
            if not user_obj.exists():
                return Response({"status": 404, "error": "non user found"}, status=status.HTTP_404_NOT_FOUND)
            user_obj = user_obj.first()
            otp_status, time = send_otp_to_mobile(user_obj.phone, user_obj)
            if not otp_status:
                return Response({"status": 403, "error": f"Try again after {time} seconds"},
                                status=status.HTTP_403_FORBIDDEN)
            email_token = send_email_token(user_obj)
            user_obj.email_token = email_token
            user_obj.save()
            return Response({"status": 200, "message": "new otp sent"})

        except Exception as e:
            logging.error(e)


class UserProfile(APIView):
    """User data class"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """User data fetch method"""
        user_data = User.objects.get(id=request.user.id)
        serializer = UserSerializer(user_data)
        data = serializer.data
        data = user_profile_data(user_data, data,request)
        return Response({"status": 200, "data": data})

    def put(self, request):
        """ Update user profile data"""

        serializer = UserSerializer(
            request.user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"status": 200, "data": serializer.data})
        else:
            return Response({'status': 404, 'error': random.serializer.errors}, status=status.HTTP_403_FORBIDDEN)


class FriendProfile(APIView):
    """Different User Profile"""
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        """Other user profile data fetch"""
        user_data = User.objects.get(id=user_id)
        serializer = UserSerializer(user_data)
        data = serializer.data
        data = friend_profile_data(user_data, data, request)
        return Response({"status": 200, "data": data})


class EmailVerification(APIView):
    """Verify OTP by email class"""
    permission_classes = [AllowAny]

    def post(self, request):
        """Verify email method"""
        try:

            user_obj = User.objects.get(email=request.data.get("email"))

            if user_obj.email_token == request.data.get("email_token"):
                user_obj.is_phone_verified = True
                user_obj.save()
                refresh = RefreshToken.for_user(user_obj)
                return Response({"status": 200, "message": "your OTP is verified", 'refresh': str(refresh),
                                 'access': str(refresh.access_token), })

            return Response({"status": 403, "message": "your token is wrong"}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            logging.error(e)
        return Response({"status": 404, "error": "something went wrong"}, status=status.HTTP_404_NOT_FOUND)


class ResetPasswordEmailOTP(APIView):
    """Reset password by email oto"""
    permission_classes = [AllowAny]

    def post(self, request):
        """Send OTP and link to email"""
        try:
            user_data = User.objects.get(email=request.data.get("email"))
            otp_to_sent = random.randint(1000, 9999)
            user_data.otp = otp_to_sent
            subject = "Otp for resetting password"
            message = f"Your OTP is {otp_to_sent}"
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [user_data.email]
            send_mail(subject, message, email_from, recipient_list)
            user_data.save()
            return Response({"status": 200, "message": "OTP sent to email"})
        except Exception as e:
            logging.error(e)
        return Response({"status": 404, "error": "something went wrong"})

    def patch(self, request):
        """Update password by email verification"""
        try:
            user_data = User.objects.get(email=request.data.get("email"))
            data = request.data
            new_password = data.get("newPassword", "")
            if not new_password or len(new_password) < 8:
                return Response({"status": 403, "error": "password must be greater than 8 characters"},
                                status=status.HTTP_403_FORBIDDEN)
            otp = int(data.get("otp"))
            if int(user_data.otp) == otp:
                user_data.set_password(new_password)
                user_data.save()
                return Response({"status": 200, "message": "password updated"})

        except Exception as e:
            logging.error(e)
        return Response({"status": 404, "error": "something went wrong"}, status=status.HTTP_403_FORBIDDEN)


class FriendRequest(APIView):
    """User friends class"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Send request method"""

        user = request.user
        data = request.data

        receiver_user_id = data.get('receiver_id')
        receiver = User.objects.filter(id=receiver_user_id)
        if not receiver.exists():
            return Response({"status": 403, "error": "Invalid receiver user id"})
        else:
            receiver = receiver.first()
        friend_request_obj, created = Friends.objects.get_or_create(
            sender=user, receiver=receiver
        )
        if not created:
            return Response({"status": 403, "error": "Friend request already sent"})
        else:
            return Response({"status": 200, "message": "Friend request sent"})

    def get(self, request):
        """Get friends method"""

        user = request.user

        try:
            friends_list = [{"id": obj.id, "user": UserSerializer(obj.sender).data} for obj in
                            Friends.objects.filter(receiver=user, accepted=True, status=True)]
            friends_list_send = [{"id": obj.id, "user": UserSerializer(obj.receiver).data} for obj in
                                 Friends.objects.filter(sender=user, accepted=True, status=True)]
            friends_list.extend(friends_list_send)
            pending_requests = [{"id": obj.id, "user": UserSerializer(
                obj.sender).data} for obj in Friends.objects.filter(receiver=user, accepted=False)]
            return Response({"status": 200, "data": {"friends": friends_list, "pending": pending_requests}})
        except Exception as e:
            logging.error(e)
        return Response({"status": 404, "error": "something went wrong"})

    def put(self, request):
        """Accept of reject request method"""

        user = request.user
        data = request.data

        request_id = data.get('request_id')
        request_status = bool(data.get('status'))
        friend_request_obj = Friends.objects.filter(
            receiver=user, id=request_id, status=True)
        if not friend_request_obj.exists():
            return Response({"status": 403, "error": "Invalid friend request id"})
        else:
            friend_request_obj = friend_request_obj.first()

        friend_request_obj.accepted = request_status
        friend_request_obj.save()
        return Response({"status": 200, "error": "Friend request updated"})


class HomePage(APIView):
    """Home page url class"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Fetch user homepage details"""

        user = request.user
        data = request.data
        data = get_homepage_data(user)
        
        return Response({"status": 200, "data": data})
