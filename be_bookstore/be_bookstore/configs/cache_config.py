import os
import logging

logger = logging.getLogger(__name__)

REDIS_HOST = os.getenv("REDIS_HOST", "127.0.0.1")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))


def is_redis_available():
    """Ping Redis cực nhanh (timeout 0.2s)."""
    import redis
    try:
        r = redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            db=0,
            socket_connect_timeout=0.2,
            socket_timeout=0.2
        )
        r.ping()
        return True
    except Exception:
        return False


if is_redis_available():
    print("✅ Redis đang hoạt động")
    logger.info("✅ Redis cache connected successfully")

    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": f"redis://{REDIS_HOST}:{REDIS_PORT}/0",
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
                "SERIALIZER": "django_redis.serializers.json.JSONSerializer",
                "IGNORE_EXCEPTIONS": True,
                "SOCKET_CONNECT_TIMEOUT": 0.2,
                "SOCKET_TIMEOUT": 0.2,
            },
            "TIMEOUT": 300,
        },

        "data_book_cache": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": f"redis://{REDIS_HOST}:{REDIS_PORT}/1",
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
                "SERIALIZER": "django_redis.serializers.json.JSONSerializer",
                "IGNORE_EXCEPTIONS": True,
                "SOCKET_CONNECT_TIMEOUT": 0.2,
                "SOCKET_TIMEOUT": 0.2,
            },
            "TIMEOUT": 600,
        },
    }

    SESSION_ENGINE = "django.contrib.sessions.backends.cache"
    SESSION_CACHE_ALIAS = "default"

else:
    print("⚠️ Redis không phản hồi - fallback sang bộ nhớ RAM")
    logger.warning("⚠️ Redis unavailable, switching to LocMemCache")

    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "session-local",
        },
        "data_book_cache": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "data-local",
        },
    }

    SESSION_ENGINE = "django.contrib.sessions.backends.cache"
    SESSION_CACHE_ALIAS = "default"
