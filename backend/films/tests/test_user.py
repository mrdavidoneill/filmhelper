from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIRequestFactory, APIClient


class UsersTestCase(TestCase):
    """
    Test case for the Users endpoint
    """

    def setUp(self):
        """
        Set up test data
        """
        self.factory = APIRequestFactory()
        self.client = APIClient()
        self.authorized_user = User.objects.create_user(
            username="test_user", password="test_password"
        )
        self.another_authorized_user = User.objects.create_user(
            username="test_user2", password="test_password"
        )

    def test_authorized_user_can_see_list_of_users(self):
        """
        Test that an authorized user (in this case, a user who is logged in)
        can see the list of users by making a GET request to the "/users/" endpoint
        """
        self.client.force_authenticate(user=self.authorized_user)
        response = self.client.get("/users/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["results"]),
            2,
            "Expected 2 users visible to logged in user",
        )

    def test_unauthorized_user_cant_see_list_of_users(self):
        """
        Test that an unauthorized user (in this case, a user who is not logged in)
        can't see the list of users by making a GET request to the "/users/" endpoint
        """
        response = self.client.get("/users/")
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
            "Expected 401 for no credentials at all",
        )
