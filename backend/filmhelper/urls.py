from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from films import views
from rest_framework.authtoken.views import obtain_auth_token


router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"filmwatchlist", views.FilmWatchListViewSet, basename="filmwatchlist")
router.register(r"filmratings", views.FilmRatingViewSet, basename="filmratings")


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
    path("api-token-auth/", obtain_auth_token, name="api-token-auth"),
    path("password_reset/", views.PasswordResetView.as_view(), name="password_reset"),
    path(
        "password_reset_confirm/<str:uidb64>/<str:token>/",
        views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
]

admin.site.site_header = "Filmhelper administration"
admin.site.index_title = "Filmhelper administration"
admin.site.site_title = "Filmhelper administration"
