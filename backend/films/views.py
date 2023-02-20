from rest_framework.permissions import AllowAny

from rest_framework.fields import CurrentUserDefault
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import generics
from films.models import FilmRating, FilmWatchlist
from films.serializers import (
    FilmRatingSerializer,
    FilmWatchlistSerializer,
    UserSerializer,
)

from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.template import loader
from django.core.mail import EmailMessage
from rest_framework.response import Response
from .serializers import PasswordResetSerializer, PasswordResetConfirmSerializer


from rest_framework import mixins


class CreateListRetrieveDeleteViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    A viewset that provides `retrieve`, `create`, `delete` and `list` actions.
    ie. update is not allowed

    To use it, override the class and set the `.queryset` and
    `.serializer_class` attributes.
    """


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing users.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer


class FilmWatchListViewSet(CreateListRetrieveDeleteViewSet):
    """
    API endpoint for managing the films in a user's watchlist.
    """

    serializer_class = FilmWatchlistSerializer

    def get_queryset(self):
        """
        Return a queryset of the films in the authenticated user's watchlist, ordered by date added in descending order.
        """
        return FilmWatchlist.objects.filter(user=self.request.user).order_by(
            "-date_added"
        )

    def perform_create(self, serializer):
        """
        Custom create action to associate the created film watchlist entry with the authenticated user.
        """
        serializer.save(user=self.request.user)


class FilmRatingViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing the film ratings for a user.
    """

    serializer_class = FilmRatingSerializer

    def get_queryset(self):
        """
        Return a queryset of the film ratings for the authenticated user, ordered by date added in descending order.
        """
        return FilmRating.objects.filter(user=self.request.user).order_by("-date_added")

    def perform_create(self, serializer):
        """
        Custom create action to associate the created film rating with the authenticated user.
        """
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """
        Custom update action to associate the created film rating with the authenticated user.
        """
        serializer.save(user=self.request.user)


class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = (AllowAny,)
    template_name = "email/password_reset.html"

    def post(self, request, *args, **kwargs):
        # Get user email from the serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        # Get user by email
        user = User.objects.get(email=email)

        # Generate password reset token and send email
        subject = "Password reset on Filmhelper"
        context = {
            "email": user.email,
            "domain": request.META.get("HTTP_HOST", "localhost"),
            "site_name": "Filmhelper",
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "user": user,
            "token": default_token_generator.make_token(user),
        }
        email_template_name = "email/password_reset.html"
        email = loader.render_to_string(email_template_name, context)
        msg = EmailMessage(subject, email, to=[user.email])
        msg.content_subtype = "html"
        msg.send()

        return Response({"message": "Password reset email sent"})


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = (AllowAny,)
    template_name = "email/password_reset_confirm.html"

    def post(self, request, *args, **kwargs):
        # Get the reset password token and user's id from the serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]

        # Decode the user's id
        try:
            uid = urlsafe_base64_decode(uid)
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        # Check if the password reset token is valid and the user exists
        if user is not None and default_token_generator.check_token(user, token):
            # Set a new password for the user
            new_password = User.objects.make_random_password()
            user.set_password(new_password)
            user.save()

            # Send the new password to the user
            subject = "New password for Filmhelper"
            context = {
                "email": user.email,
                "new_password": new_password,
                "site_name": "Filmhelper",
            }
            email_template_name = "email/password_reset_confirm.html"
            email = loader.render_to_string(email_template_name, context)
            msg = EmailMessage(subject, email, to=[user.email])
            msg.content_subtype = "html"
            msg.send()

            return Response({"message": "New password sent"})

        return Response({"message": "Invalid password reset token"}, status=400)
