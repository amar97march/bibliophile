from django.db import models

class Book(models.Model):

    title = models.CharField(max_length=200)
    unique_book_id = models.CharField(max_length=50, unique = True)
    publisher = models.CharField(max_length=200)
    published_date = models.DateField(null = True, blank = True)
    Descripiton = models.CharField(max_length=1000)
    page_count = models.IntegerField(null=True, blank = True)
    book_image_link = models.CharField(max_length=1000)