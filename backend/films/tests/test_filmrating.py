from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIRequestFactory, APIClient
from films.models import FilmRating


class FilmRatingModelTestCase(TestCase):
    """
    Test case for the Film Rating endpoint
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
        self.film_rating = FilmRating.objects.create(
            rating=75,
            imdb_id="tt0111161",
            user=self.authorized_user,
        )

    def test_authorized_user_can_create_rating(self):
        self.client.force_authenticate(user=self.authorized_user)
        data = {"imdb_id": "tt123456", "rating": 50}

        response = self.client.post("/filmratings/", data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.get("/filmratings/")
        self.assertEqual(
            len(response.data["results"]),
            2,
            "Expected two items in the response data. Initial, plus newly created one",
        )

    def test_authorized_user_can_update_rating(self):
        self.client.force_authenticate(user=self.authorized_user)
        updated_data = {"rating": 80, "imdb_id": self.film_rating.imdb_id}
        response = self.client.put(
            f"/filmratings/{self.film_rating.id}/", data=updated_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.film_rating.refresh_from_db()
        self.assertEqual(self.film_rating.rating, 80)

    def test_unauthorized_user_cannot_create_rating(self):
        data = {"imdb_id": "tt123456", "rating": 50}
        response = self.client.post("/filmratings/", data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authorized_user_cannot_see_others_ratings(self):
        self.client.force_authenticate(user=self.non_authorized_user)
        response = self.client.get("/filmratings/")
        self.assertEqual(
            len(response.data["results"]),
            0,
            "Expected no items to be visible to logged in user.",
        )

    def test_authorized_user_cannot_update_another_user_rating(self):
        self.client.force_authenticate(user=self.non_authorized_user)
        updated_data = {"rating": 80, "imdb_id": self.film_rating.imdb_id}
        response = self.client.put(
            f"/filmratings/{self.film_rating.id}/", data=updated_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_authorized_user_can_delete_film_rating(self):
        """
        Test that an authorized user (in this case, a user who is logged in)
        can delete a film rating they own by making a DELETE request to the "/filmratings/{id}/" endpoint
        """
        self.client.force_authenticate(user=self.authorized_user)
        film_rating = FilmRating.objects.create(
            rating=75,
            imdb_id="tt123456",
            user=self.authorized_user,
        )
        self.assertEqual(
            FilmRating.objects.filter(user=self.authorized_user).count(),
            2,
            "Expected 2 items in the FilmRating model",
        )
        response = self.client.delete(f"/filmratings/{film_rating.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            FilmRating.objects.filter(user=self.authorized_user).count(),
            1,
            "Expected 1 item in the FilmRating model",
        )

    def test_unauthorized_user_cant_delete_film_rating(self):
        """
        Test that an unauthorized user (in this case, a user who is not logged in)
        can't delete a film rating by making a DELETE request to the "/filmratings/{id}/" endpoint
        """
        film_rating = FilmRating.objects.create(
            rating=75,
            imdb_id="tt123456",
            user=self.authorized_user,
        )
        response = self.client.delete(f"/filmratings/{film_rating.id}/")
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
            "Expected 401 for no credentials at all",
        )

    def test_authorized_user_cant_delete_other_user_film_rating(self):
        """
        Test that an authorized user (in this case, a user who is logged in)
        can't delete a film rating that belongs to another user by making a DELETE request to the "/filmratings/{id}/" endpoint
        """
        self.client.force_authenticate(user=self.authorized_user)
        film_rating = FilmRating.objects.create(
            rating=75,
            imdb_id="tt123456",
            user=self.non_authorized_user,
        )
        response = self.client.delete(f"/filmratings/{film_rating.id}/")
        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
            "Expected 404 not found as the user is not allowed to view or delete this film rating",
        )
