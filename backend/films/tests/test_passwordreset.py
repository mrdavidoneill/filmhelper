from django.contrib.auth.models import User
from django.urls import reverse
from django.core import mail
from rest_framework.test import APITestCase


class PasswordResetTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="testuser@example.com", password="testpassword"
        )

    def test_password_reset(self):
        # Initiate password reset
        response = self.client.post(
            reverse("password_reset"), data={"email": self.user.email}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "Password reset email sent"})

        # Check if the email was sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertEqual(mail.outbox[0].subject, "Password reset on Filmhelper")


# class PasswordResetTestCase(APITestCase):
#     def setUp(self):
#         self.user = User.objects.create_user(
#             username="testuser", email="testuser@example.com", password="testpassword"
#         )

#     def test_password_reset(self):
#         # Initiate password reset
#         response = self.client.post(
#             reverse("password_reset"), data={"email": self.user.email}
#         )
#         self.assertEqual(response.status_code, 200)

#         # Get the password reset token from the response data
#         reset_token = response.data["reset_token"]

#         # Update the user's password with the new reset password
#         response = self.client.patch(
#             reverse("password_reset_confirm"),
#             data={"reset_token": reset_token, "new_password": "newpassword"},
#         )
#         self.assertEqual(response.status_code, 200)

#         # Check that the password has been updated successfully
#         self.user.refresh_from_db()
#         self.assertTrue(self.user.check_password("newpassword"))
