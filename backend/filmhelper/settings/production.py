from decouple import config, Csv

DEBUG = False

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": config("DEV_MARIADB_DATABASE"),
        "USER": config("DEV_MARIADB_USER"),
        "PASSWORD": config("DEV_MARIADB_PASSWORD"),
        "HOST": config("DEV_MARIADB_HOST"),
        "PORT": config("DB_PORT"),
        "TEST": {
            "NAME": config("MARIADB_DATABASE") + "_test",
        },
    }
}
