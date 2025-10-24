from django.contrib import admin
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.token_blacklist.admin import OutstandingTokenAdmin as BaseOutstandingTokenAdmin, BlacklistedTokenAdmin as BaseBlacklistedTokenAdmin

admin.site.unregister(OutstandingToken)
admin.site.unregister(BlacklistedToken)

@admin.register(OutstandingToken)
class OutstandingTokenAdmin(BaseOutstandingTokenAdmin):
    list_per_page = 15

@admin.register(BlacklistedToken)
class BlacklistedTokenAdmin(BaseBlacklistedTokenAdmin):
    list_per_page = 15