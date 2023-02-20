from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from rest_framework import status


class TokenAuthenticationTestCase(APITestCase):
    """
    Test class for the Token Authentication endpoint
    """

    def setUp(self):
        """
        Set up the test by creating a user and initializing the APIClient
        """
        self.client = APIClient()
        self.username = "testuser"
        self.email = "testuser@test.com"
        self.password = "testpassword"
        self.user = User.objects.create_user(
            username=self.username, email=self.email, password=self.password
        )

    def test_obtain_token(self):
        """
        Test that a token is returned for valid credentials
        """
        response = self.client.post(
            "/api-token-auth/",
            data={"username": self.username, "password": self.password},
        )

        self.assertEqual(
            response.status_code, status.HTTP_200_OK, "Expected 200 good credentials"
        )
        self.assertIn("token", response.data, "Expected a token in response")

        token = response.data["token"]
        user_token = Token.objects.get(user=self.user)
        self.assertEqual(token, user_token.key)

    def test_invalid_credentials(self):
        """
        Test that an error is returned for invalid credentials
        """
        response = self.client.post(
            "/api-token-auth/",
            data={"username": self.username, "password": "invalid"},
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            "Expected 400 invalid credentials",
        )
        self.assertNotIn("token", response.data, "Expected no token in response")
        self.assertIn("non_field_errors", response.data)
