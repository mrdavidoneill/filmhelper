from .base import *

if config("DEVELOPMENT", default=False, cast=bool):
    from .development import *
else:
    from .production import *
