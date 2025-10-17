import os

BANK_INFO = {
    "code": os.getenv("BANK_CODE"),
    "account": os.getenv("BANK_ACCOUNT"),
    "name": os.getenv("BANK_NAME"),
    "account_name": os.getenv("ACCOUNT_NAME"),
}