from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIRequestFactory, APIClient
from films.models import FilmWatchlist


class FilmWatchlistTestCase(TestCase):
    """
    Test case for the Film Watchlist endpoint
    """

    def setUp(self):
        """
        Set up test data
        """
        self.client = APIClient()
        self.authorized_user = User.objects.create_user(
            username="test_user", password="test_password"
        )
        self.non_authorized_user = User.objects.create_user(
            username="non_owner", password="test_password"
        )

    def test_authorized_user_can_see_film_watchlist(self):
        """
        Test that an authorized user (in this case, a user who is logged in)
        can see their film watchlist by making a GET request to the "/filmwatchlist/" endpoint
        """
        self.client.force_authenticate(user=self.authorized_user)
        FilmWatchlist.objects.create(
            user=self.authorized_user, imdb_id="tt123456", date_added="2023-02-02"
        )
        response = self.client.get("/filmwatchlist/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["results"]), 1, "Expected one item in the response data"
        )

    def test_unauthorized_user_cant_see_film_watchlist(self):
        """
        Test that an unauthorized user (in this case, a user who is not logged in)
        can't see the film watchlist by making a GET request to the "/filmwatchlist/" endpoint
        """
        self.client.force_authenticate(user=self.non_authorized_user)
        response = self.client.get("/filmwatchlist/")
        self.assertEqual(
            len(response.data["results"]),
            0,
            "Expected no items in the response data, as this user has not created any",
        )

    def test_unauthorized_user_cant_see_film_watchlist(self):
        """
        Test that an unauthorized user (in this case, a user who is not logged in)
        can't see the film watchlist by making a GET request to the "/filmwatchlist/" endpoint
        """
        response = self.client.get("/filmwatchlist/")
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
            "Expected 401 for no credentials at all",
        )

    def test_authorized_user_can_create_film_watchlist(self):
        """
        Test that an authorized user (in this case, a user who is logged in)
        can create a film watchlist by making a POST request to the "/filmwatchlist/" endpoint
        """
        self.client.force_authenticate(user=self.authorized_user)
        film_watchlist_data = {"imdb_id": "tt123456"}
        response = self.client.post(
            "/filmwatchlist/", data=film_watchlist_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            FilmWatchlist.objects.filter(user=self.authorized_user).count(),
            1,
            "Expected one item in the FilmWatchlist model",
        )
        self.assertEqual(
            response.data["user"],
            self.authorized_user.id,
            "Expected the returned film watchlist user to match the authenticated user",
        )

    def test_unauthorized_user_cant_create_film_watchlist(self):
        """
        Test that an unauthorized user (in this case, a user who is not logged in)
        can't create a film watchlist by making a POST request to the "/filmwatchlist/" endpoint
        """
        film_watchlist_data = {"imdb_id": "tt123456"}
        response = self.client.post(
            "/filmwatchlist/", data=film_watchlist_data, format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
            "Expected 401 for no credentials at all",
        )

    def test_authorized_user_cant_create_same_film_twice(self):
        """
        Test that an authorized user (in this case, a user who is logged in)
        can't add the same film twice to their film watchlist by making
        two POST requests to the "/filmwatchlist/" endpoint
        """
        self.client.force_authenticate(user=self.authorized_user)
        film_watchlist_data = {"imdb_id": "tt123456"}
        response = self.client.post(
            "/filmwatchlist/", data=film_watchlist_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post(
            "/filmwatchlist/", data=film_watchlist_data, format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            "Expected 400 as the same film can't be added twice",
        )

    def test_authorized_user_can_delete_film_watchlist(self):
        """
        Test that an authorized user (in this case, a user who is logged in)
        can delete a film watchlist they own by making a DELETE request to the "/filmwatchlist/{id}/" endpoint
        """
        self.client.force_authenticate(user=self.authorized_user)
        film_watchlist = FilmWatchlist.objects.create(
            imdb_id="tt123456", user=self.authorized_user
        )
        response = self.client.delete(f"/filmwatchlist/{film_watchlist.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            FilmWatchlist.objects.filter(user=self.authorized_user).count(),
            0,
            "Expected no items in the FilmWatchlist model",
        )

    def test_unauthorized_user_cant_delete_film_watchlist(self):
        """
        Test that an unauthorized user (in this case, a user who is not logged in)
        can't delete a film watchlist by making a DELETE request to the "/filmwatchlist/{id}/" endpoint
        """
        film_watchlist = FilmWatchlist.objects.create(
            imdb_id="tt123456", user=self.authorized_user
        )
        response = self.client.delete(f"/filmwatchlist/{film_watchlist.id}/")
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
            "Expected 401 for no credentials at all",
        )

    def test_authorized_user_cant_delete_other_user_film_watchlist(self):
        """
        Test that an authorized user (in this case, a user who is logged in)
        can't delete a film watchlist that belongs to another user by making a DELETE request to the "/filmwatchlist/{id}/" endpoint
        """
        self.client.force_authenticate(user=self.authorized_user)
        film_watchlist = FilmWatchlist.objects.create(
            imdb_id="tt123456", user=self.non_authorized_user
        )
        response = self.client.delete(f"/filmwatchlist/{film_watchlist.id}/")
        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
            "Expected 404 not found as the user is not allowed to view or delete this film watchlist",
        )

    def test_authorized_user_cant_update_film_watchlist(self):
        """
        Test that an authorized user cannot update their created FilmWatchList.
        """
        self.client.force_authenticate(user=self.authorized_user)
        film_watchlist = FilmWatchlist.objects.create(
            imdb_id="tt123456", user=self.authorized_user
        )
        updated_data = {"imdb_id": "tt654321"}
        response = self.client.patch(
            f"/filmwatchlist/{film_watchlist.id}/", data=updated_data, format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
            "Expected the PATCH request to be disallowed for the authorized user",
        )
        response = self.client.put(
            f"/filmwatchlist/{film_watchlist.id}/", data=updated_data, format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
            "Expected the PUT request to be disallowed for the authorized user",
        )













