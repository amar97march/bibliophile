"""Urls view for Book APIs"""
from rest_framework.response import Response
from .models import *
import requests
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
# from .helpers import send_otp_to_mobile
from users.serializers import UserSerializer
from django.db.models import Q, Avg


class BookInfo(APIView):
    """Info information class"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, book_id):
        """fetch api fot books"""
        user = request.user

        try:
            book_obj = Book.objects.filter(unique_book_id=book_id).first()
            if not book_obj:
                res = requests.get('https://www.googleapis.com/books/v1/volumes/'+book_id+"/")
                # if "large" in res.json()["volumeInfo"]["imageLinks"]:
                #     image_link = res.json()["volumeInfo"]["imageLinks"]["large"]
                # elif "medium" in res.json()["volumeInfo"]["imageLinks"]:
                #     image_link = res.json()["volumeInfo"]["imageLinks"]["medium"]
                # elif "small" in res.json()["volumeInfo"]["imageLinks"]:
                #     image_link = res.json()["volumeInfo"]["imageLinks"]["small"]
                if "thumbnail" in res.json()["volumeInfo"]["imageLinks"]:
                    image_link = res.json()["volumeInfo"]["imageLinks"]["thumbnail"]
                else:
                    image_link = None
                book_obj = Book.objects.create(
                    unique_book_id=book_id, title=res.json()["volumeInfo"]["title"],
                    image_link=image_link,
                    descripiton=res.json()["volumeInfo"]["description"]if ("description" in res.json()["volumeInfo"]) \
                    else None,
                    author=res.json()["volumeInfo"]["authors"][0] if res.json()["volumeInfo"]["authors"] else None
                )
            wishlist_obj = Wishlist.objects.filter(book=book_obj, user=user).first()
            if wishlist_obj and wishlist_obj.status:
                wishlist_status = True
            else:
                wishlist_status = False
            readlist_obj = Readlist.objects.filter(book=book_obj, user=user).first()
            if readlist_obj and readlist_obj.status:
                readlist_status = True
            else:
                readlist_status = False
            shelflist_obj = Shelflist.objects.filter(book=book_obj, user=user).first()
            if shelflist_obj and shelflist_obj.status:
                shelflist_status = True
            else:
                shelflist_status = False
            all_reviews = BookReview.objects.filter(book=book_obj).order_by("-created_at")
            average_rating = all_reviews.aggregate(Avg('rating'))
            book_review = [{"rating": inst.rating, "comment": inst.comment, "user_id": inst.user.id,
                            "user": inst.user.email, "timestamp": inst.updated_at}
                           for inst in all_reviews]
            reading_users_list = [{"id": inst.id, "user": UserSerializer(inst.user).data} for inst in
                                  Readlist.objects.filter(book=book_obj, status=True)]

            data = {"reviews": book_review, "review_count": all_reviews.count(),
                    "average_rating": average_rating["rating__avg"] if average_rating["rating__avg"] else 0,
                    "wishlist_status": wishlist_status, "readlist_status": readlist_status,
                    "reading_users": reading_users_list,
                    "shelflist_status": shelflist_status}

            return Response({"status": 200, "data": data})
        except Exception as e:
            print(e)
        return Response({"status": 404, "error": "something went wrong"})


class BookReviews(APIView):
    """Class for book reviews"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Create review for books"""
        user = request.user
        data = request.data
        try:

            book_obj = Book.objects.filter(unique_book_id=data.get("book_id")).first()
            if not book_obj:
                return Response({"status": 404, "error": "Book not found"})
            review_obj = BookReview.objects.filter(book = book_obj, user=user).first()
            # if review_obj:
            #     return Response({"status":403, "error":"Review already added by this user for this book"})
            review_obj = BookReview.objects.create(book=book_obj, user=user, comment=data.get("comment"),
                                                   rating=data.get("rating"))
            
            return Response({"status": 200, "message": "Review added successfully"})
        except Exception as e:
            print(e)
        return Response({"status": 404, "error": "something went wrong"})


class BookWishlist(APIView):
    """Wishlist API class"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        """Add wishlist"""
        user = request.user
        data = request.data
        try:

            book_obj = Book.objects.filter(unique_book_id=data.get("book_id")).first()
            if not book_obj:
                return Response({"status": 404, "error": "Book not found"})
            wishlist_obj = Wishlist.objects.filter(book=book_obj, user=user).first()
            if wishlist_obj:
                wishlist_obj.status = bool(data.get("status"))
                wishlist_obj.save()
            else:
                wishlist_obj = Wishlist.objects.create(book=book_obj, user=user, status=True)
            if bool(data.get("status")):
                return Response({"status": True, "message": "Book added to wishlist"})
            else:
                return Response({"status": False, "message": "Book removed from wishlist"})
        except Exception as e:
            print(e)
        return Response({"status": 404, "error": "something went wrong"})


class BookReadlist(APIView):
    """Add book to read section api"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        """Add or remove book from readlist api"""
        user = request.user
        data = request.data
        try:

            book_obj = Book.objects.filter(unique_book_id=data.get("book_id")).first()
            if not book_obj:
                return Response({"status": 404, "error": "Book not found"})
            readlist_obj = Readlist.objects.filter(book=book_obj, user=user).first()
            if readlist_obj:
                readlist_obj.status = bool(data.get("status"))
                readlist_obj.save()
            else:
                readlist_obj = Readlist.objects.create(book=book_obj, user=user, status=True)
            if bool(data.get("status")):
                return Response({"status": True, "message": "Book added to readlist"})
            else:
                return Response({"status": False, "message": "Book removed from readlist"})
        except Exception as e:
            print(e)
        return Response({"status": 404, "error": "something went wrong"})


class BookShelflist(APIView):
    """Book Shelf Api class"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        """Add or remove book from shelf"""
        user = request.user
        data = request.data
        try:

            book_obj = Book.objects.filter(unique_book_id=data.get("book_id")).first()
            if not book_obj:
                return Response({"status": 404, "error": "Book not found"})
            shelflist_obj = Shelflist.objects.filter(book=book_obj, user=user).first()
            if shelflist_obj:
                shelflist_obj.status = bool(data.get("status"))
                shelflist_obj.save()
            else:
                shelflist_obj = Shelflist.objects.create(book=book_obj, user=user, status=True)
            if bool(data.get("status")):
                return Response({"status": True, "message": "Book added to shelflist"})
            else:
                return Response({"status": False, "message": "Book removed from shelflist"})
        except Exception as e:
            print(e)
        return Response({"status": 404, "error": "something went wrong"})
