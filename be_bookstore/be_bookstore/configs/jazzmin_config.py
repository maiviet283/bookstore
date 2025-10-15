JAZZMIN_SETTINGS = {
    "site_title": "Cửa Hàng Sách",
    "site_header": "Quản Lý Cửa Hàng Sách",
    "site_brand": "Book Store",
    "welcome_sign": "Chào Mừng Đến Với Trang Quản Trị Cửa Hàng Sách",
    "copyright": "© 2025 Book Store",

    "site_logo": "core/images/book.png",
    "login_logo": "core/images/bookstore.png",
    "site_logo_classes": "img-circle",
    
    "logo_icon": "core/images/icon.png", 

    "site_icon": "core/images/icon.png",

    "topmenu_links": [
        {"name": "Trang Chủ", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Website", "url": "/", "new_window": True},
    ],

    "usermenu_links": [
        {"name": "Xem Website", "url": "/", "new_window": True},
        {"name": "Mai Quốc Việt", "url": "https://maiviet.id.vn", "new_window": True}
    ],
    
    "order_with_respect_to": [ 
        "auth", 
        "customer", 
        "book", 
        'review', 
        'cart', 
        'order', 
        'core', 
        "rest_framework_simplejwt.token_blacklist", ],
}
