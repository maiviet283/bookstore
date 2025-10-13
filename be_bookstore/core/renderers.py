from rest_framework.renderers import JSONRenderer


class CustomJSONRenderer(JSONRenderer):
    """
    Renderer chuẩn hóa trạng thái trả về cho toàn bộ API DRF.
    Chỉ thêm 'status': 'success' hoặc 'error' tùy theo HTTP code.
    
    View sẽ tự định nghĩa message, data, errors nếu cần.
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get("response", None)

        status_value = "error" if response and response.status_code >= 400 else "success"

        if data is None:
            data = {}

        if isinstance(data, dict) and "status" not in data:
            data = {"status": status_value, **data}
        else:
            data = {"status": status_value, "data": data}

        return super().render(data, accepted_media_type, renderer_context)
