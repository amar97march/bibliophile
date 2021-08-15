from django.db import models

class Book(models.Model):

    title = models.CharField(max_length=200)
    unique_book_id = models.CharField(max_length=50, unique = True)
    author = models.CharField(max_length=200, blank=True, null= True)
    published_date = models.DateField(null = True, blank = True)
    descripiton = models.CharField(max_length=1000, null = True, blank = True)
    # page_count = models.IntegerField(null=True, blank = True)
    # book_image_link = models.CharField(max_length=1000)