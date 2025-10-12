from django.utils.translation import gettext_lazy as _
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

LANGUAGE_CODE = 'vi'

LANGUAGES = [
    ('en', _('English')),
    ('vi', _('Tiếng Việt')),
]

USE_I18N = True

LOCALE_PATHS = [BASE_DIR / 'locale']
