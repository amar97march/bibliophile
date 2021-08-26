from .models import *
from django.db.models import Q, Avg
from users.serializers import UserSerializer

def get_book_data(book_obj, user):
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
    return data