"""Urls view for Book APIs"""
from rest_framework.response import Response
from .models import *
import requests
from rest_framework.views import APIView
import logging
from rest_framework.permissions import IsAuthenticated, AllowAny
from .tasks import send_email_notification
from .helpers import get_book_data


class BookInfo(APIView):
    """Info information class"""
    permission_classes = [IsAuthenticated]

    def get(self, request, book_id):
        """fetch api fot books"""
        user = request.user

        try:
            book_obj = Book.objects.filter(unique_book_id=book_id).first()
            if not book_obj:
                res = requests.get('https://www.googleapis.com/books/v1/volumes/'+book_id+"/")
                if "thumbnail" in res.json()["volumeInfo"]["imageLinks"]:
                    image_link = res.json()["volumeInfo"]["imageLinks"]["thumbnail"]
                else:
                    image_link = None
                book_obj = Book.objects.create(
                    unique_book_id=book_id, title=res.json()["volumeInfo"]["title"],
                    image_link=image_link,
                    descripiton=res.json()["volumeInfo"]["description"]if ("description" in res.json()["volumeInfo"]) \
                    else None,
                    author=res.json()["volumeInfo"]["authors"][0] if res.json()["volumeInfo"]["authors"] else None,
                    language=res.json()["volumeInfo"]["language"] if res.json()["volumeInfo"]["language"] else None
                )
            data = get_book_data(book_obj, user)

            return Response({"status": 200, "data": data})
        except Exception as e:
            logging.error(e)
        return Response({"status": 404, "error": "something went wrong"})


class BookReviews(APIView):
    """Class for book reviews"""
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
            review_obj = BookReview.objects.create(book=book_obj, user=user, comment=data.get("comment"),
                                                   rating=data.get("rating"))
            
            return Response({"status": 200, "message": "Review added successfully"})
        except Exception as e:
            logging.error(e)
        return Response({"status": 404, "error": "something went wrong"})


class BookWishlist(APIView):
    """Wishlist API class"""
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
            logging.error(e)
        return Response({"status": 404, "error": "something went wrong"})


class BookReadlist(APIView):
    """Add book to read section api"""
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
            logging.error(e)
        return Response({"status": 404, "error": "something went wrong"})


class BookShelflist(APIView):
    """Book Shelf Api class"""
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
                send_email_notification.delay(user.email, f"Book {book_obj.title} added to shelf")
                return Response({"status": True, "message": "Book added to shelflist"})
            else:
                send_email_notification.delay(user.email, f"Book {book_obj.title} removed from shelf")
                return Response({"status": False, "message": "Book removed from shelflist"})
        except Exception as e:
            logging.error(e)
        return Response({"status": 404, "error": "something went wrong"})
