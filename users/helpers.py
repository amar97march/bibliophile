"""Helper functions"""
import random
import logging
from django.core.mail import send_mail
import uuid
from django.conf import settings
from books.models import *
from .models import *
from .serializers import UserSerializer
from django.db.models import Q, Count, Avg


def send_otp_to_mobile(mobile, user_obj):
    try:
        otp_to_sent = random.randint(1000, 9999)
        user_obj.otp = otp_to_sent
        user_obj.save()
        return True, 0
    except Exception as e:
        logging.error(e)

def user_profile_pic_update(user_obj, profile_image):
    user_obj.profile_image = profile_image
    user_obj.save()

def send_email_token(user_obj):
    email_token = uuid.uuid4()
    subject = "Your email needs to be verifed"
    message = f"Hi, Your OTP is {user_obj.otp}, Or click on the link to verify email https://" \
                f"bibliophile-react-django.herokuapp.com/verify_email/{user_obj.email}/{email_token}/"
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [user_obj.email]
    send_mail(subject, message, email_from, recipient_list)
    return email_token

def friend_profile_data(user_data, data, request):
        shelflist_list = [{"title": inst.book.title, "unique_book_id": inst.book.unique_book_id,
                           "image_link": inst.book.image_link} for inst in
                          Shelflist.objects.filter(user=user_data, status=True)]
        wishlist_list = [{"title": inst.book.title, "unique_book_id": inst.book.unique_book_id,
                          "image_link": inst.book.image_link} for inst in
                         Wishlist.objects.filter(user=user_data, status=True)]
        readlist_list = [{"title": inst.book.title, "unique_book_id": inst.book.unique_book_id,
                          "image_link": inst.book.image_link} for inst in
                         Readlist.objects.filter(user=user_data, status=True)]
        friends_list = [{"id": obj.id, "user": UserSerializer(obj.sender).data} for obj in
                        Friends.objects.filter(receiver=user_data, accepted=True, status=True)]
        friends_list_send = [{"id": obj.id, "user": UserSerializer(obj.receiver).data} for obj in
                             Friends.objects.filter(sender=user_data, accepted=True, status=True)]
        friends_list.extend(friends_list_send)
        request_obj = Friends.objects.filter(Q(
            sender=request.user, receiver=user_data, status=True)|Q(receiver=request.user, sender=user_data, status=True)).first()
        if request_obj and request_obj.accepted:
            request_status = 2
        elif request_obj and not request_obj.accepted:
            request_status = 1
        elif int(user_data.id) == request.user.id:
            request_status = 4
        else:
            request_status = 0
        data["request_status"] = request_status
        data["shelflist_list"] = shelflist_list
        data["wishlist_list"] = wishlist_list
        data["readlist_list"] = readlist_list
        data["friends"] = friends_list
        data["profile_image"] = user_data.profile_image.url if user_data.profile_image else None
        return data

def user_profile_data(user_data, data,request):
        shelflist_list = [{"title": inst.book.title, "unique_book_id": inst.book.unique_book_id,
                           "image_link": inst.book.image_link} for inst in
                          Shelflist.objects.filter(user=user_data, status=True)]
        wishlist_list = [{"title": inst.book.title, "unique_book_id": inst.book.unique_book_id,
                          "image_link": inst.book.image_link} for inst in
                         Wishlist.objects.filter(user=user_data, status=True)]
        readlist_list = [{"title": inst.book.title, "unique_book_id": inst.book.unique_book_id,
                          "image_link": inst.book.image_link} for inst in
                         Readlist.objects.filter(user=user_data, status=True)]
        friends_list = [{"id": obj.id, "user": UserSerializer(obj.sender).data} for
                        obj in Friends.objects.filter(receiver=request.user, accepted=True, status=True)]
        friends_list_send = [{"id": obj.id, "user": UserSerializer(obj.receiver).data} for obj in
                             Friends.objects.filter(sender=request.user, accepted=True, status=True)]
        friends_list.extend(friends_list_send)
        data["shelflist_list"] = shelflist_list
        data["wishlist_list"] = wishlist_list
        data["readlist_list"] = readlist_list
        data["friends"] = friends_list
        data["profile_image"] = user_data.profile_image.url if user_data.profile_image else None
        return data

def get_homepage_data(user):
    friend_request_count = Friends.objects.filter(
            receiver=user, accepted=False).count()
    top_rating_books_query = [x["book"] for x in BookReview.objects.all().values(
        "book").annotate(total=Avg('rating')).order_by('-total')[:10]]
    top_rating_books = []
    for book_id in top_rating_books_query:
        inst = Book.objects.get(id=book_id)
        top_rating_books.append(
            {"title": inst.title, "unique_book_id": inst.unique_book_id, "image_link": inst.image_link})

    top_popular_books_query = [x["book"] for x in Readlist.objects.all().values(
        "book").annotate(total=Count('book')).order_by('-total')][:10]
    top_popular_books = []
    for book_id in top_popular_books_query:
        inst = Book.objects.get(id=book_id)
        top_popular_books.append(
            {"title": inst.title, "unique_book_id": inst.unique_book_id, "image_link": inst.image_link})
    recommended_books = Readlist.objects.filter(user = user, status = True)
    readlist_authors = [obj.book.author for obj in recommended_books]
    readlist_languages = [obj.book.language for obj in recommended_books]
    recommended_books_list = [{"title": inst.title, "unique_book_id": inst.unique_book_id, "image_link": inst.image_link} for
                                 inst in Book.objects.filter(Q(language__in = readlist_languages) |  Q(author__in =readlist_authors))]

    
    data = {"friend_request_count": friend_request_count,
            "top_rating_books": top_rating_books,
            "top_popular_books": top_popular_books,
            "recommended_books":recommended_books_list
            }
    return data