import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
LOG_DIR = BASE_DIR.parent / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,

    "formatters": {
        "verbose": {
            "format": "[{asctime}] {levelname} {name} ({lineno}) — {message}",
            "style": "{",
        },
        "simple": {"format": "{levelname} — {message}", "style": "{"},
    },

    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
        "file": {
            "class": "logging.FileHandler",
            "formatter": "verbose",
            "filename": LOG_DIR / "django_errors.log",
            "encoding": "utf-8",
        },
        "security": {
            "class": "logging.FileHandler",
            "formatter": "verbose",
            "filename": LOG_DIR / "security.log",
            "encoding": "utf-8",
        },
    },

    "loggers": {
        "django": {
            "handlers": ["console", "file"],
            "level": "WARNING",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["console", "file"],
            "level": "ERROR",
            "propagate": False,
        },
        "django.security": {
            "handlers": ["security"],
            "level": "WARNING",
            "propagate": False,
        },
        "bookstore": {
            "handlers": ["console", "file"],
            "level": "INFO",
        },
    },
}
