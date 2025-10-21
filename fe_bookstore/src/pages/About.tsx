import { BookOpen, Users, MapPin } from "lucide-react";
import image from "../assets/book-about.jpg"
import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <section className="bg-indigo-600 text-white py-20">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Chào mừng đến với BookStore</h1>
                    <p className="text-lg md:text-xl text-indigo-100">
                        Nơi mang đến cho bạn những cuốn sách hay nhất, phục vụ mọi sở thích và độ tuổi.
                    </p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Về Chúng Tôi</h2>
                        <p className="text-gray-600 mb-4">
                            BookStore được thành lập với mục tiêu mang tri thức và niềm vui đọc sách đến tất cả mọi người.
                            Chúng tôi cung cấp đa dạng thể loại sách: từ văn học, kỹ năng, học tập đến truyện thiếu nhi.
                        </p>
                        <p className="text-gray-600">
                            Đội ngũ nhân viên thân thiện, am hiểu sách và luôn sẵn sàng tư vấn giúp bạn chọn được cuốn sách ưng ý nhất.
                        </p>
                    </div>
                    <div>
                        <img
                            src={image}
                            alt="Bookstore"
                            className="rounded-2xl shadow-lg object-cover w-full h-72 md:h-96"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
                    <div className="bg-indigo-50 rounded-xl p-8 shadow-md">
                        <BookOpen className="mx-auto mb-4 w-12 h-12 text-indigo-600" />
                        <h3 className="text-2xl font-bold text-gray-800">10,000+</h3>
                        <p className="text-gray-600 mt-2">Cuốn sách chất lượng</p>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-8 shadow-md">
                        <Users className="mx-auto mb-4 w-12 h-12 text-indigo-600" />
                        <h3 className="text-2xl font-bold text-gray-800">5,000+</h3>
                        <p className="text-gray-600 mt-2">Khách hàng hài lòng</p>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-8 shadow-md">
                        <MapPin className="mx-auto mb-4 w-12 h-12 text-indigo-600" />
                        <h3 className="text-2xl font-bold text-gray-800">Đà Nẵng</h3>
                        <p className="text-gray-600 mt-2">Cửa hàng chính</p>
                    </div>
                </div>
            </section>

            <section className="bg-indigo-600 text-white py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Khám phá thế giới sách ngay hôm nay!</h2>
                    <p className="text-indigo-100 mb-6">
                        Tham quan cửa hàng, chọn sách yêu thích hoặc đặt hàng online tiện lợi.
                    </p>
                    <Link
                        to="/"
                        className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-100 transition"
                    >
                        Mua Sắm Ngay
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;
