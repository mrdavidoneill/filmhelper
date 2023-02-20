from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator


class FilmWatchlist(models.Model):
    """
    A model representing a film watchlist.

    Fields:
        user (models.ForeignKey): A foreign key to the user who created the watchlist.
        imdb_id (models.CharField): The IMDb ID number of the film being added to the watchlist.
        date_added (models.DateTimeField): The date and time the film was added to the watchlist.

    """

    user = models.ForeignKey(
        User, related_name="filmwatchlist", on_delete=models.CASCADE
    )
    imdb_id = models.CharField(max_length=10)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.imdb_id


class FilmRating(models.Model):
    """
    A model representing a film rating.

    Fields:
        rating (models.PositiveSmallIntegerField): The rating of the film given by the user, as a percentage.
        imdb_id (models.CharField): The IMDb ID number of the film being added to the watchlist.
        user (models.ForeignKey): A foreign key to the user who created the rating.
        date_added (models.DateTimeField): The date and time the rating was added.

    """

    rating = models.PositiveSmallIntegerField(validators=[MaxValueValidator(100)])
    imdb_id = models.CharField(max_length=10)
    user = models.ForeignKey(User, related_name="filmratings", on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.imdb_id} - {self.rating}%"
