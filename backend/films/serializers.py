from django.contrib.auth.models import User
from films.models import FilmRating, FilmWatchlist
from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault
from rest_framework.validators import UniqueTogetherValidator


class UserSerializer(serializers.ModelSerializer):
    filmwatchlist = serializers.PrimaryKeyRelatedField(
        many=True, queryset=FilmWatchlist.objects.all()
    )

    class Meta:
        model = User
        fields = ["username", "email", "filmwatchlist"]


class FilmWatchlistSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = FilmWatchlist
        fields = ["id", "user", "imdb_id", "date_added"]

        validators = [
            UniqueTogetherValidator(
                queryset=FilmWatchlist.objects.all(), fields=["user", "imdb_id"]
            )
        ]


class FilmRatingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = FilmRating
        fields = ["id", "rating", "imdb_id", "user", "date_added"]

        validators = [
            UniqueTogetherValidator(
                queryset=FilmRating.objects.all(), fields=["user", "imdb_id"]
            )
        ]


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)
