from rest_framework.response import Response
from .models import *
import requests
# from .serializers import *
import uuid
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
# from .helpers import send_otp_to_mobile
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q


class FriendRequest(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


    def get(self, request, book_id):
        
        user = request.user

        try:
            book_obj = Book.objects.filter(unique_book_id = book_id).first()
            if not book_obj:
                res = requests.get('https://www.googleapis.com/books/v1/volumes/'+book_id+"/")
                book_obj = Book.objects.create(unique_book_id = book_id, title = res.json()["volumeInfo"]["title"],
                published_date = res.json()["volumeInfo"]["publishedDate"],
                descripiton = res.json()["volumeInfo"]["description"] if res.json()["volumeInfo"]["description"] else None,
                author = res.json()["volumeInfo"]["authors"][0] if res.json()["volumeInfo"]["authors"] else None
                )

            data ={"review":4,"review_count":2}

            return Response({"status":200, "data":data})
        except Exception as e:
            print(e)
        return Response({"status":404, "error":"something went wrong"})