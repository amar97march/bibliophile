"""Book Models """
from users.models import User
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Book(models.Model):
    """Class for Book information"""
    title = models.CharField(max_length=200)
    unique_book_id = models.CharField(max_length=50, unique=True)
    author = models.CharField(max_length=200, blank=True, null=True)
    published_date = models.DateField(null=True, blank=True)
    descripiton = models.CharField(max_length=10000, null=True, blank=True)
    image_link = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.title


class BookReview(models.Model):
    """Class for Book Reviews"""
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    comment = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.book.title + " " + self.user.email


class Wishlist(models.Model):
    """Class for Wishlist information"""
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.book.title + " " + self.user.email


class Readlist(models.Model):
    """Class for Book readlist"""
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.book.title + " " + self.user.email


class Shelflist(models.Model):
    """Class for shelf information"""
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.book.title + " " + self.user.email
