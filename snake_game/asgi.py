"""
ASGI config for snake_game project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import django
from django.core.exceptions import ImproperlyConfigured

try:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'snake_game.settings')
    django.setup()
except ImproperlyConfigured as e:
    print("Django configuration error:", e)

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import detail_game.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'snake_game.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            detail_game.routing.websocket_urlpatterns
        )
    ),
})
