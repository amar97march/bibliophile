from rest_framework.response import Response
from .models import *
from .serializers import *
import uuid
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from .helpers import send_otp_to_mobile
from rest_framework_simplejwt.tokens import RefreshToken
import random
from django.core.cache import cache
from django.db.models import Q

class RegisterView(APIView):

    def post(self, request):
        try:
            serializer = UserSerializer(data = request.data)

            if not serializer.is_valid():
                return Response({
                    'status': 403,
                    'errors': serializer.errors
                })
            serializer.save()            
            return Response({'status':200, 'message': 'An email OTP sent on your number and email'})
        except Exception as e:
            print(e)
            return Response({'status': 404, 'error':'something went wrong'})


class UpdateProfile(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


    def patch(self, request):
        try:
            profile_image = request.FILES.get('profile_image',None)
            user = request.user
            user_obj = User.objects.get(id = user.id)
            serializer = UserSerializer(user_obj, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response({'status': 404, 'error':random.serializer.errors})
            serializer.save()
            if profile_image:
                user_obj.profile_image = profile_image
                user_obj.save()
            return Response({'status':200, 'message': 'User profile updated'})
        except Exception as e:
            print(e)
        return Response({'status': 404, 'error':'something went wrong'})


class VerifyOtp(APIView):
    def post(self, request):
        try:
            data = request.data

            user_obj = User.objects.get(phone = data.get('phone'))
            otp = data.get('otp')

            if user_obj.otp == otp:
                user_obj.is_phone_verified = True
                user_obj.save()
                refresh = RefreshToken.for_user(user_obj)
                return Response({"status":200, "message":"your OTP is verified", 'refresh': str(refresh),
        'access': str(refresh.access_token),})

            return Response({"status":403,"message":"your otp is wrong"})

        except Exception as e:
            print(e)
        return Response({"status":404, "error":"something went wrong"})

    def patch(self, request):
        try:
            data = request.data
            user_obj = User.objects.filter(phone = data.get('phone'))
            if not user_obj.exists():
                return Response({"status":404, "error":"non user found"})
            user_obj =user_obj.first()
            status, time = send_otp_to_mobile(data.get('phone'),user_obj)
            email_token = uuid.uuid4()
            subject = "Your email needs to be verifed"
            message =  f"Hi, click on the link to verify email http://127.0.0.1:8000/users/email_verification/{user_obj.email}/{email_token}/"
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [user_obj.email]
            send_mail(subject, message, email_from,recipient_list)
            user_obj.email_token = email_token
            user_obj.save()
            if status:
                return Response({"status":200, "message":"new otp sent"})
            return Response({"status":404,"error":f"try after {time} seconds"})
        except Exception as e:
            print(e)

class UserProfile(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user_data = User.objects.get(id = request.user.id)
        serializer = UserSerializer(user_data)
        data = serializer.data
        data["profile_image"] = settings.ROOT_URL+'staticfiles/'+data['profile_image'] if data['profile_image'] else None
        return Response({"status":200, "data":serializer.data})


class EmailVerification(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, email,email_token):
        try:
            data = request.data

            user_obj = User.objects.get(email = email)

            if user_obj.email_token == email_token:
                user_obj.is_phone_verified = True
                user_obj.save()
                refresh = RefreshToken.for_user(user_obj)
                return Response({"status":200, "message":"your OTP is verified", 'refresh': str(refresh),
        'access': str(refresh.access_token),})

            return Response({"status":403,"message":"your otp is wrong"})

        except Exception as e:
            print(e)
        return Response({"status":404, "error":"something went wrong"})


class ResetPasswordEmailOTP(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user_data = User.objects.get(id = request.user.id)
            if cache.get(f"RESET-{user_data.email}"):
                return Response({"status":403,  "error":f"Please retry after {cache.ttl(f'RESET-{user_data.email}')} seconds"})
            otp_to_sent = random.randint(1000,9999)
            cache.set(f"RESET-{user_data.email}", otp_to_sent, timeout=60)
            user_data.otp = otp_to_sent
            subject = "Otp for resetting password"
            message =  f"Your OTP is {otp_to_sent}"
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [user_data.email]
            send_mail(subject, message, email_from,recipient_list)
            user_data.save()
            return Response({"status":200, "message":"OTP sent to email"})
        except Exception as e:
            print(e)
        return Response({"status":404, "error":"something went wrong"})

    def patch(self, request):
        try:
            user_data = User.objects.get(id = request.user.id)
            data = request.data
            new_password = data.get("new_password","")
            if not new_password or len(new_password) < 8:
                return Response({"status":403, "error":"password must be greater than 8 characters"})
            otp = data.get("otp")
            if int(user_data.otp) == otp:
                user_data.set_password(new_password)
                user_data.save()
                return Response({"status":200, "message":"password updated"})
            
        except Exception as e:
            print(e)
        return Response({"status":404, "error":"something went wrong"})


class FriendRequest(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user
        data = request.data

        receiver_user_id = data.get('receiver_id')
        receiver  = User.objects.filter(id = receiver_user_id)
        if not receiver.exists():
            return Response({"status":403, "error":"Invalid receiver user id"})
        else:
            receiver = receiver.first()
        friend_request_obj, created = Friends.objects.get_or_create(
            sender = user, receiver = receiver
        )
        if not created:
            return Response({"status":403, "error":"Friend request already sent"})
        else:
            return Response({"status":200, "message":"Friend request sent"})

    def get(self, request):
        
        user = request.user

        try:
            friends_list = [{"id":obj.id,"user":UserSerializer(obj.receiver).data} for obj in 
            Friends.objects.filter(Q(sender = user, accepted = True) | Q(receiver = user, accepted = True))]
            pending_requests = [{"id":obj.id,"user":UserSerializer(obj.sender).data} for obj in  Friends.objects.filter(receiver = user)]
            # friends = UserSerializer(friends_list, many=True).data
            # pending = UserSerializer(pending_requests, many=True).data
            return Response({"status":200, "data":{"friends":friends_list,"pending":pending_requests}})
        except Exception as e:
            print(e)
        return Response({"status":404, "error":"something went wrong"})

    def put(self, request):

        user = request.user
        data = request.data

        request_id = data.get('request_id')
        friend_request_obj  = Friends.objects.filter(sender =user, id = request_id)
        if not friend_request_obj.exists():
            return Response({"status":403, "error":"Invalid friend request id"})
        else:
            friend_request_obj = friend_request_obj.first()
        
        friend_request_obj.accepted = True
        friend_request_obj.save()
        return Response({"status":403, "error":"Friend request already sent"})