from django.db import IntegrityError


def handle_integrity_error(error: IntegrityError) -> dict:
    """
    Trả về dict chứa 'message' và 'errors' tương ứng với lỗi IntegrityError.
    Dùng chung cho nhiều view khác nhau.
    """
    err_msg = str(error).lower()
    print("Lỗi DB Duyệt :", err_msg)

    if "username" in err_msg:
        return {
            "message": "Vui lòng chọn Tên Đăng Nhập khác",
            "errors": {"username": ["Tên Đăng Nhập đã tồn tại."]},
        }
    elif "phone" in err_msg:
        return {
            "message": "Vui lòng chọn Số Điện Thoại khác",
            "errors": {"phone": ["Số Điện Thoại đã được sử dụng."]},
        }
    elif "email" in err_msg:
        return {
            "message": "Vui lòng chọn Email khác",
            "errors": {"email": ["Email đã tồn tại."]},
        }
    else:
        return {
            "message": "Lỗi dữ liệu không hợp lệ.",
            "errors": {"non_field_errors": ["Lỗi dữ liệu không hợp lệ."]},
        }
