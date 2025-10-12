-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: bookstore
-- ------------------------------------------------------
-- Server version	8.4.6

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
INSERT INTO `auth_group` VALUES (1,'Nhân Viên Bán Hàng');
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
INSERT INTO `auth_group_permissions` VALUES (1,1,25),(2,1,26),(3,1,28);
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add Khách Hàng',7,'add_customer'),(26,'Can change Khách Hàng',7,'change_customer'),(27,'Can delete Khách Hàng',7,'delete_customer'),(28,'Can view Khách Hàng',7,'view_customer'),(29,'Can add book',8,'add_book'),(30,'Can change book',8,'change_book'),(31,'Can delete book',8,'delete_book'),(32,'Can view book',8,'view_book'),(33,'Can add category',9,'add_category'),(34,'Can change category',9,'change_category'),(35,'Can delete category',9,'delete_category'),(36,'Can view category',9,'view_category'),(37,'Can add book image',10,'add_bookimage'),(38,'Can change book image',10,'change_bookimage'),(39,'Can delete book image',10,'delete_bookimage'),(40,'Can view book image',10,'view_bookimage');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$1000000$6fwGe86EoJ0jxZgpy3kIsi$anKWRRkfj06d9CdD+KAxPv540Rem8raCefNMBxiOCJY=','2025-10-12 06:34:42.072723',1,'maiviet283','Việt','Mai Quốc','maiviet283@gmail.com',1,1,'2025-10-10 07:55:07.000000');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(100) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext,
  `slug` varchar(255) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `published_date` date DEFAULT NULL,
  `language` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int unsigned NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `book_book_category_id_616006cd_fk_book_category_id` (`category_id`),
  CONSTRAINT `book_book_category_id_616006cd_fk_book_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `book_chk_1` CHECK ((`stock` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (1,'books/main/2025/10/nha-gia-kim-1.jpg','Nhà Giả Kim','“Nhà giả kim” là tiểu thuyết nổi tiếng của Paulo Coelho, kể về hành trình theo đuổi ước mơ của chàng chăn cừu Santiago trên con đường tìm kiếm kho báu - một ẩn dụ về hành trình tìm ra ý nghĩa của cuộc sống','nha-gia-kim','Paulo Coelho','NXB Văn Học','1988-04-15','Tiếng Việt',89000.00,120,'2025-10-12 05:53:13.558831','2025-10-12 06:22:51.770522',0,5);
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_image`
--

DROP TABLE IF EXISTS `book_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(100) NOT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `book_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `book_bookimage_book_id_28d4b120_fk_book_book_id` (`book_id`),
  CONSTRAINT `book_bookimage_book_id_28d4b120_fk_book_book_id` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_image`
--

LOCK TABLES `book_image` WRITE;
/*!40000 ALTER TABLE `book_image` DISABLE KEYS */;
INSERT INTO `book_image` VALUES (1,'books/gallery/2025/10/images_1.jpg','Ảnh của sách Nhà Giả Kim',1),(2,'books/gallery/2025/10/Nhà_giả_kim_sách.jpg','Ảnh của sách Nhà Giả Kim',1),(3,'books/gallery/2025/10/images.jpg','Ảnh của sách Nhà Giả Kim',1),(4,'books/gallery/2025/10/nha_0.jpg','Ảnh của sách Nhà Giả Kim',1);
/*!40000 ALTER TABLE `book_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext,
  `slug` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Văn học Việt Nam','Tác phẩm kinh điển và hiện đại của các tác giả Việt Nam, phản ánh đời sống, con người và văn hóa dân tộc','van-hoc-viet-nam'),(2,'Văn học nước ngoài','Tuyển tập tiểu thuyết, truyện ngắn, và tác phẩm nổi tiếng từ các nền văn học thế giới','van-hoc-nuoc-ngoai'),(3,'Sách thiếu nhi','Những câu chuyện, truyện tranh và sách học tập phù hợp cho trẻ em từ 3 đến 12 tuổi','sach-thieu-nhi'),(4,'Kinh tế & Quản trị','Sách về tài chính, khởi nghiệp, marketing và kỹ năng quản lý dành cho doanh nhân và sinh viên kinh tế','kinh-te-quan-tri'),(5,'Tâm lý & Phát triển bản thân','Giúp bạn hiểu rõ bản thân, phát triển kỹ năng sống, và đạt được sự cân bằng trong công việc và cuộc sống','tam-ly-phat-trien-ban-than'),(6,'Khoa học & Công nghệ','Cập nhật tri thức về khoa học tự nhiên, công nghệ, AI, vũ trụ và đổi mới sáng tạo','khoa-hoc-cong-nghe'),(7,'Lịch sử & Chính trị','Tư liệu và nghiên cứu về các giai đoạn lịch sử, sự kiện, nhân vật và tư tưởng chính trị','lich-su-chinh-tri'),(8,'Ngoại ngữ & Học thuật','Tài liệu học tiếng Anh, tiếng Nhật, tiếng Hàn... và sách phục vụ học tập, nghiên cứu','ngoai-ngu-hoc-thuat'),(9,'Tôn giáo & Triết học','Sách về đạo đức, triết học, tôn giáo và tư tưởng nhân sinh','ton-giao-triet-hoc'),(10,'Truyện tranh & Manga','Tổng hợp truyện tranh nổi tiếng, manga Nhật Bản và comic phương Tây dành cho mọi lứa tuổi','truyen-tranh-manga');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `avatar` varchar(100) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(254) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` longtext,
  `username` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `loyalty_points` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `is_delete` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (2,'','Bà Hải Đặng','M','1978-10-14','ba-hai-ang@hotmail.com','0780673011','9 Jane Khu, Quận JaneThị xã, 814646','ba-hai-ang','pbkdf2_sha256$1000000$LwtSoBIRIv1PNFIGi0J5Br$MlqW4JpxiRYrinL/z9pfX8jL2dLiKQcGMW6J/0Gc4Rk=',196,1,'2025-10-10 09:54:03.157577','2025-10-10 09:54:03.158144',0),(3,'','Quý cô Nhật Nguyễn','M','1985-05-16','quy-co-nhat-nguyen@hotmail.com','0809402232','727 John Dãy, Quận JaneQuận, 486976','quy-co-nhat-nguyen','pbkdf2_sha256$1000000$fczS8fgrKfOlkpbBCJyl7t$z9c1nueMuVL5MYlUG4DvLKP7oIsXDskIIcVnfURwvpc=',280,1,'2025-10-10 09:54:03.493167','2025-10-10 09:54:03.493888',0),(4,'','Cô Nhật Vũ','F','1996-11-01','co-nhat-vu@gmail.com','0923016981','88 Jane Hẻm, Huyện JohnPhường, 195220','co-nhat-vu','pbkdf2_sha256$1000000$sSZNqqcPbhCQuwjmeWltWP$XbXDMwaWQYcOC8cmBfA4yO5tHObb7TK3uEtan3PZYhg=',487,1,'2025-10-10 09:54:03.817908','2025-10-10 09:54:03.818540',0),(5,'','Nhật Hữu Đặng','F','1996-08-05','nhat-huu-ang@outlook.com','0743831675','51 Mai Số, JohnThành phố, 968129','nhat-huu-ang','pbkdf2_sha256$1000000$6QrYIHhXjW7N8eWF7LA12l$HEN3kRKEMHWCKIcLQPyynXXd5wxsNunQ6d2H9/yXaDw=',365,1,'2025-10-10 09:54:04.151904','2025-10-10 09:54:04.152572',0),(6,'','Cô Nhật Trần','F','1982-06-08','co-nhat-tran@gmail.com','0562032603','62 Bùi Hẻm, JanePhường, 772234','co-nhat-tran','pbkdf2_sha256$1000000$aRDCq9NTDXLceCYRwrTKop$QLRbwSiiN1NUbevsmqTa+ZOeStb4Hcho7l4/Tv7fYY0=',228,1,'2025-10-10 09:54:04.477147','2025-10-10 09:54:04.477710',0),(7,'','Quý cô Bảo Mai','F','1969-09-30','quy-co-bao-mai@hotmail.com','0526446012','063 Đặng Số, JaneQuận, 892596','quy-co-bao-mai','pbkdf2_sha256$1000000$HEh7pwuquoMHr7upTu2T69$kzlz3Msg6//KN4sLIseEGbe4lC+wWex4DzFowK/MJa0=',203,1,'2025-10-10 09:54:04.829909','2025-10-10 09:54:04.830385',0),(8,'','Hoàng Phạm','F','1961-10-03','hoang-pham@outlook.com','0819547183','18 Lê Khu, JohnXã, 778523','hoang-pham','pbkdf2_sha256$1000000$M3FbUYQOmZbxp9ZkV7y0xV$Uff9JJB/bZb1N96a1zQhTSztmjt4MSa1eUKhEsnBBUs=',478,1,'2025-10-10 09:54:05.183102','2025-10-10 09:54:05.183606',0),(9,'','Quang Tấn Trần','O','2006-03-05','quang-tan-tran@yahoo.com','0904765410','7 Trần Hẻm, JaneHuyện, 318988','quang-tan-tran','pbkdf2_sha256$1000000$LbI7vUiWRAtQCFybYKk2sY$HEYNWowxEa49dnQG3dUjPi6xTkdX0PJ3+8tS+238XSA=',419,1,'2025-10-10 09:54:05.505622','2025-10-10 09:54:05.506082',0),(10,'','Chị Hương Hoàng','M','1998-11-18','chi-huong-hoang@outlook.com','0570190554','50 Hoàng Ngõ, JanePhường, 548253','chi-huong-hoang','pbkdf2_sha256$1000000$JLr4dOBaHDofF8QteqHJU7$BzemLqTp63zJeUXcoqq6ODMpr7FSt8POAvFXQIBzMU8=',500,1,'2025-10-10 09:54:05.865474','2025-10-10 09:54:05.866060',0),(11,'','Trung Trí Mai','M','1974-12-07','trung-tri-mai@hotmail.com','0910257822','593 Jane Tổ, Thành phố JohnThành phố, 405442','trung-tri-mai','pbkdf2_sha256$1000000$TiDq7w6qgG6NRBr6djDKBl$uHNUQTlJWFtBvc2oD4qmwR0PfvIkJ6gfzSP1vgpTADI=',229,1,'2025-10-10 09:54:06.232462','2025-10-10 09:54:06.233115',0),(12,'','Khoa Hoàng','F','1992-10-05','khoa-hoang@hotmail.com','0795033558','2 John Dãy, Quận JaneThành phố, 387628','khoa-hoang','pbkdf2_sha256$1000000$IKCZF8FKi1hdh4dFONLVUQ$d77fAsQIK3vzvOx67Hy91MQVvZAxEENVoX48yumAmTM=',464,1,'2025-10-10 09:54:06.554033','2025-10-10 09:54:06.554800',0),(13,'','Quý cô Hà Dương','F','1984-08-19','quy-co-ha-duong@gmail.com','0913897996','44 John Đường, JohnXã, 184087','quy-co-ha-duong','pbkdf2_sha256$1000000$9ARTwTX17zghU3iuvDyIRg$ckGANfZ+9HZQ38eOmcm+p66m1vmgwxx0HQE/9l8C+/0=',221,1,'2025-10-10 09:54:06.875451','2025-10-10 09:54:06.876009',0),(14,'','Quý cô Thành Trần','M','1979-03-23','quy-co-thanh-tran@hotmail.com','0916311237','6 John Đường, JohnThị xã, 930008','quy-co-thanh-tran','pbkdf2_sha256$1000000$FpPC8gCIA1BAi5UVw4BKzT$t088/6KENQ0zwnOLQVvz2hcjOHYpBDJqxnEDF41ygGc=',290,1,'2025-10-10 09:54:07.240903','2025-10-10 09:54:07.241567',0),(15,'','Yến Trần','F','1961-02-10','yen-tran@yahoo.com','0522374970','644 Jane Ngõ, JaneQuận, 463763','yen-tran','pbkdf2_sha256$1000000$UYyuSiqaC3yjqAA5gVFL6x$Z771xBooFn/D/Q+CY5YDFOGJAaAyccoe2vANvD4SlOg=',485,1,'2025-10-10 09:54:07.596687','2025-10-10 09:54:07.597220',0),(16,'','Châu Đặng','M','1959-03-31','chau-ang@gmail.com','0759225434','73 Jane Số, JaneThành phố, 279740','chau-ang','pbkdf2_sha256$1000000$rcKe1muE5cbhFQqxduVM7B$EG1tcg3Teht0VOtqOG9aQcvFMF0TLmbDSb4M5SIVJX0=',325,1,'2025-10-10 09:54:07.965137','2025-10-10 09:54:07.965868',0),(17,'','Phúc Vũ','F','1976-02-06','phuc-vu@gmail.com','0845745238','848 John Ngõ, Quận JohnXã, 581382','phuc-vu','pbkdf2_sha256$1000000$0KYaMKPJW52nsjohzudtmO$/mlRQ4nnOT1uhqjpwXXJXG+Llh/bMtal62VxqzXilmY=',111,1,'2025-10-10 09:54:08.332974','2025-10-10 09:54:08.333380',0),(18,'','Thảo Bùi','M','1988-04-06','thao-bui@hotmail.com','0787192613','406 Jane Tổ, JaneQuận, 745086','thao-bui','pbkdf2_sha256$1000000$dB1x58DZFIhBGKIcuz8xZK$0h3B3QLBWsid+ALA7+XFFU2xbpfhaSPisdZqreTg1XQ=',478,1,'2025-10-10 09:54:08.698847','2025-10-10 09:54:08.699743',0),(19,'','Cô Thành Phạm','F','1970-05-20','co-thanh-pham@outlook.com','0342640446','JaneThành phố, 4 Jane Dãy, 958983','co-thanh-pham','pbkdf2_sha256$1000000$n7VIUvUMs5H45osqj9rph3$12yBxpYdLrvpcdJ9ux7OHWJu6l0vs+krskHczpPl0mc=',198,1,'2025-10-10 09:54:09.065307','2025-10-10 09:54:09.065899',0),(20,'','Cô Nhật Lê','F','1999-08-16','co-nhat-le@hotmail.com','0381146464','7 Đặng Số, Thành phố JaneThị xã, 175678','co-nhat-le','pbkdf2_sha256$1000000$PIllCbINC29Q0C0ciiwkDj$XVFZJLI08OPyEM5g2ZPakzR+VFmS8+tbvgjN4X/dOGQ=',211,1,'2025-10-10 09:54:09.434490','2025-10-10 09:54:09.435143',0),(21,'','Khoa Lê','F','1973-12-09','khoa-le@hotmail.com','0338874012','5 Phạm Tổ, JaneQuận, 986662','khoa-le','pbkdf2_sha256$1000000$lAOU6j0JzinsOKOpqXLQmY$MX5GBgsG63GQv0X++MTznkGYkvzy3vSnJwlXGMj32NY=',351,1,'2025-10-10 09:54:09.782369','2025-10-10 09:54:09.783014',0),(22,'','Hồng Bùi','F','1983-04-30','hong-bui@yahoo.com','0830828994','8 Jane Làng, Quận JaneThành phố, 354587','hong-bui','pbkdf2_sha256$1000000$oKSifqONuUikAvA2lHh61L$6LCv8FpBZyc4aZaLo+8HTHvMFzdMK78FMqX1iuQlVw8=',376,1,'2025-10-10 09:54:10.125143','2025-10-10 09:54:10.125916',0),(23,'','Nhật Đức Đặng','F','1962-11-23','nhat-uc-ang@gmail.com','0818577104','5 Jane Hẻm, Thành phố JohnQuận, 342422','nhat-uc-ang','pbkdf2_sha256$1000000$GPfo5ehwPbrkSiRJYufJUl$w0BwOYTX/iPBp0FFp82XPxSoL1t/Opp4DgJYeB4aZhk=',387,1,'2025-10-10 09:54:10.470670','2025-10-10 09:54:10.471204',0),(24,'','Hương Vũ','M','1995-10-22','huong-vu@yahoo.com','0393424925','525 Hoàng Khu, Thành phố JaneXã, 396073','huong-vu','pbkdf2_sha256$1000000$zRNN9pibjhHudocZNI72eg$aSfdD+OblnphWZakrRZYI0mRqu2pgCVjWIZN1f/tr/Y=',435,1,'2025-10-10 09:54:10.818936','2025-10-10 09:54:10.819816',0),(25,'','Cô Linh Mai','F','1963-04-28','co-linh-mai@hotmail.com','0846307179','9 John Đường, Thành phố JaneQuận, 851119','co-linh-mai','pbkdf2_sha256$1000000$qm52kzMoOsmquPp0uPUT0M$ECFGigeKpyMFOooQlPNjDj7/sj/1GeLf+QnUiYnDsFw=',340,1,'2025-10-10 09:54:11.138849','2025-10-10 09:54:11.139530',0),(26,'','Cô Chi Đặng','M','1960-09-06','co-chi-ang@yahoo.com','0793541235','4 Jane Ngõ, Huyện JohnHuyện, 707217','co-chi-ang','pbkdf2_sha256$1000000$NSh4BT6F0eKf70PPlRuF2h$u38xAJ3CGdbBhCAgujp7TwvfWjYqbQMAWuaTcSz1ang=',306,1,'2025-10-10 09:54:11.484738','2025-10-10 09:54:11.485590',0),(27,'','Thành Hữu Đặng','F','1982-10-15','thanh-huu-ang@gmail.com','0776497813','4 Jane Hẻm, JaneXã, 138244','thanh-huu-ang','pbkdf2_sha256$1000000$VKNrxsz1wVfWtI0kaQ1hkc$5WBZhirW2/jjAs5c4/12n2GWFzZXbDweq68+CvzL5Tw=',53,1,'2025-10-10 09:54:11.821117','2025-10-10 09:54:11.821716',0),(28,'','Quý cô Nhật Đặng','F','1962-06-13','quy-co-nhat-ang@hotmail.com','0726549732','01 Jane Đường, Quận JanePhường, 519028','quy-co-nhat-ang','pbkdf2_sha256$1000000$C3GSyMK6pwWOrlGXnUOuVm$SNyMIfGGqjPzYtJyOgmsiZv1vbI8f3n4NkBtLqrti/4=',91,1,'2025-10-10 09:54:12.146600','2025-10-10 09:54:12.147316',0),(29,'','Nam Đức Vũ','F','1964-06-06','nam-uc-vu@gmail.com','0318786068','49 Jane Số, Quận JaneXã, 173157','nam-uc-vu','pbkdf2_sha256$1000000$f0CLJY6SCia2TVVjZrmy88$pgZZm4mafoTePw7HQCELLtOPZJSxfy9mbw0JH9e74iQ=',261,0,'2025-10-10 09:54:12.492402','2025-10-10 09:59:21.422474',0),(30,'','Cô Bảo Phạm','M','1975-10-10','co-bao-pham@gmail.com','0535443177','91 Mai Đường, JaneXã, 326055','co-bao-pham','pbkdf2_sha256$1000000$GJVIfMxfDyzZO4e7KsWGWq$+G+ZsxpFc4IlJyoB8HpCQGw6xPSdz5B7sXYXSA94v1U=',96,1,'2025-10-10 09:54:12.840149','2025-10-10 09:54:12.840702',0),(31,'','Cô An Phạm','F','1996-02-13','co-an-pham@gmail.com','0338296854','1 John Số, Thành phố JohnXã, 736935','co-an-pham','pbkdf2_sha256$1000000$tcMXTSZV7oDw7fhuNbtdvQ$izcALSVTbwa1KnFr5ydQem1ospjrSHNZVLf4Ilt7ws0=',268,1,'2025-10-10 09:54:13.193381','2025-10-10 09:54:13.194120',0),(32,'','Hồng Phạm','M','1967-07-06','hong-pham@yahoo.com','0886458727','823 Dương Dãy, Huyện JanePhường, 657991','hong-pham','pbkdf2_sha256$1000000$8vI4kwCPmfFEZq1sgSQqMQ$Aa1mlvjecREp1pUdL2Wy51mFGvV5rZI0JEaRnLcPseY=',257,1,'2025-10-10 09:54:13.541235','2025-10-10 09:59:12.043592',1),(33,'','Quý ông Dũng Bùi','M','1963-10-27','quy-ong-dung-bui@gmail.com','0702572499','95 Jane Ngõ, JohnPhường, 769512','quy-ong-dung-bui','pbkdf2_sha256$1000000$YTdVbNBS5yAdwzVnCuOonJ$SKCdKaLZrQOCx2GWXahv6WlbNsBmoJZGYRl0DPsUcic=',272,1,'2025-10-10 09:54:13.900969','2025-10-10 09:54:13.901472',0),(34,'','Hà Dương','F','1961-11-06','ha-duong@hotmail.com','0964567315','5 Jane Hẻm, JohnXã, 405980','ha-duong','pbkdf2_sha256$1000000$0dQtQx180Rlf1BdeYqyt3i$mg2Al0yvyp7xZCMDoUE9cMVNzWR/IxiPgflMWGmsA1w=',38,1,'2025-10-10 09:54:14.236602','2025-10-10 09:54:14.237908',0),(35,'','Quý ông Châu Mai','M','1987-03-11','quy-ong-chau-mai@yahoo.com','0947044534','2 Mai Làng, Quận JohnThành phố, 471039','quy-ong-chau-mai','pbkdf2_sha256$1000000$8Az4evG5NHs5SEEFkGv69q$4cwfpvxUE9aryz2egWjbXJ9YD143cRZZyeN1sDt2M64=',486,1,'2025-10-10 09:54:14.568791','2025-10-10 09:54:14.569441',0),(36,'','Cô Yến Vũ','M','1991-11-20','co-yen-vu@gmail.com','0996248392','63 Trần Làng, Thành phố JaneHuyện, 718657','co-yen-vu','pbkdf2_sha256$1000000$hHlbwqDyspmXm8NQhr7ClP$hOqPMVVcPR4o4DLS8zNw398JGiNu11sRDK3QS8fiMTk=',129,1,'2025-10-10 09:54:14.904233','2025-10-10 09:54:14.904742',0),(37,'','Quý cô Lan Mai','O','1985-02-24','quy-co-lan-mai@yahoo.com','0384529859','75 Vũ Tổ, JaneHuyện, 489255','quy-co-lan-mai','pbkdf2_sha256$1000000$nsbyqGUtQwoT48JIcyRrjm$m7dUdnl/X/WdXtKEurhxkqpoRSD/0LoEO1ho+15yG70=',143,1,'2025-10-10 09:54:15.250908','2025-10-10 09:54:15.251458',0),(38,'','Nam Trần','M','1979-11-20','nam-tran@outlook.com','0587655875','63 Jane Tổ, JohnXã, 368373','nam-tran','pbkdf2_sha256$1000000$STjFvUlIbjnuxxRjdXXBts$Wr3TJ2w/f64n3PJ7x+A66uFXgAjH5OsPAbApXnKQzuU=',385,1,'2025-10-10 09:54:15.599814','2025-10-10 09:54:15.600444',0),(39,'','Hương Đặng','F','1957-01-31','huong-ang@yahoo.com','0725930177','3 Jane Số, JohnThị xã, 868123','huong-ang','pbkdf2_sha256$1000000$rE8dWI6Cx8UErRL3wWu5fX$92tAJMWYw04rNCbcg+70OccUeeMnwWdOaxpL0KymM4M=',27,1,'2025-10-10 09:54:15.937625','2025-10-10 09:54:15.938333',0),(40,'','Hải Dương','O','1960-06-29','hai-duong@gmail.com','0351969872','17 Vũ Hẻm, JaneQuận, 494372','hai-duong','pbkdf2_sha256$1000000$EgdJbLSMYDxp6nzW5oOLV9$C74Bue8bMCHBii0ik021DIs+QJrAP42v4MK2SmKL7VI=',333,1,'2025-10-10 09:54:16.288928','2025-10-10 09:54:16.289442',0),(41,'','Thành Trí Trần','M','1978-10-30','thanh-tri-tran@gmail.com','0559981252','71 Dương Khu, Thành phố JaneHuyện, 572700','thanh-tri-tran','pbkdf2_sha256$1000000$ZDw32aSnt2HgC9Q1jmiTDK$cWJiFUaDguF3+5DgnSqnU9s7uDTM6XxqJa1c73zsimg=',324,1,'2025-10-10 09:54:16.651538','2025-10-10 09:54:16.652203',0),(42,'','Trung Văn Phạm','O','1974-09-21','trung-van-pham@yahoo.com','0517008684','6 Vũ Hẻm, JaneHuyện, 117756','trung-van-pham','pbkdf2_sha256$1000000$JwmjsWzlX5bwitXqa3G9S8$Dc/D7URMBcCf3hktAzNMOQtzhq4sy2j8+V5MdUkrPWM=',28,1,'2025-10-10 09:54:16.999262','2025-10-10 09:54:17.000086',0),(43,'','Minh Vũ','M','1976-01-08','minh-vu@hotmail.com','0738543707','Quận JaneThị xã, 423 Trần Làng, 789136','minh-vu','pbkdf2_sha256$1000000$CTN0F7e1LKlm17F2Uupmbe$E/qJd0u/tNGsxlaWVN+TDwREeCIT/l7VYzzKriY1NN4=',227,1,'2025-10-10 09:54:17.400977','2025-10-10 09:54:17.401428',0),(44,'','Thành Vũ','M','1960-07-11','thanh-vu@outlook.com','0938204180','13 John Đường, Huyện JaneQuận, 333173','thanh-vu','pbkdf2_sha256$1000000$xVH9AZl8zJXKSdrRyfM1l6$xLk3GAheWsCYy/naAiWz2s+Xb1yrzdTzj1FciV5EfSc=',369,1,'2025-10-10 09:54:17.766299','2025-10-10 09:54:17.766719',0),(45,'','Nhật Xuân Bùi','F','1961-03-29','nhat-xuan-bui@hotmail.com','0703001110','292 John Số, JanePhường, 737024','nhat-xuan-bui','pbkdf2_sha256$1000000$VhcuzTkopqxfmXZnwJ6fbN$7zEYyKMXmqUp4N102oyWt6KtCNmlmdjWJonnVHMzCG0=',281,1,'2025-10-10 09:54:18.151127','2025-10-10 09:54:18.151662',0),(46,'','Tùng Hải Mai','O','2000-06-06','tung-hai-mai@gmail.com','0388321164','64 Jane Hẻm, JaneThị xã, 997786','tung-hai-mai','pbkdf2_sha256$1000000$DBQDHza58nyzOCLyT7gfwL$AppeTzHUbhHv1cEw/JS6DAkkobROOwp3IlCxo2DXU30=',344,1,'2025-10-10 09:54:18.533632','2025-10-10 09:54:18.534157',0),(47,'','Trung Mai','M','1958-11-07','trung-mai@outlook.com','0831082787','45 Mai Tổ, Thành phố JaneQuận, 487074','trung-mai','pbkdf2_sha256$1000000$hm89QvawCyz9weqTTi513h$je2duMOeI08YwLPIDUOnJ80+Txomuqx9nDfbzSe9qOY=',322,1,'2025-10-10 09:54:18.923902','2025-10-10 09:54:18.924383',0),(48,'','Duyên Đặng','F','1955-12-03','duyen-ang@hotmail.com','0963732918','435 Mai Khu, Quận JohnThành phố, 692876','duyen-ang','pbkdf2_sha256$1000000$d80Q0XOQ3BjLAIRoKLYT31$eJNXXYIfdf7AXZKilWXN1PhiYa1LvvoVzrAWck2CWyE=',474,1,'2025-10-10 09:54:19.293799','2025-10-10 09:54:19.295662',0),(49,'','Ông Hưng Lê','M','1978-06-30','ong-hung-le@hotmail.com','0840171033','7 John Đường, JohnPhường, 280812','ong-hung-le','pbkdf2_sha256$1000000$gKRXkwUd2dbCTN3W63jNxk$B6rfIWYor3x49bRN7KkyWo8yNByPAckgW4DrqJ6Jvi8=',132,1,'2025-10-10 09:54:19.674025','2025-10-10 09:54:19.674655',0),(50,'avatars/2025/10/Screenshot_2025-10-06_171217.png','Vân Trần','M','1975-09-06','van-tran@outlook.com','0586870472','2 Jane Ngõ, Quận JanePhường, 316096','van-tran','pbkdf2_sha256$1000000$WPpWpAkf2UeEcXvyqQXE2f$X5rC5k21wGKY2jSEGrqJYt8BeSnJ5Vd1BzN/rOgl24g=',153,1,'2025-10-10 09:54:20.043638','2025-10-10 09:58:34.926977',0),(51,'avatars/2025/10/avatar.jpg','Bà Thành Đặng','O','1975-10-11','ba-thanh-ang@outlook.com','0808256108','75 Vũ Hẻm, Thị xã JaneHuyện, 230890','ba-thanh-ang','pbkdf2_sha256$1000000$paIVpCqjZu5c3iBald3EbO$GdbovWHl7DisVTcl+jdsQws5C8RMV93PlGqAMbWxcLk=',361,1,'2025-10-10 09:54:20.416080','2025-10-10 09:58:21.907034',0),(52,'avatars/2025/10/img_68d6a6e6a5552.jpg','MAI QUOC VIET','M','2003-08-02','duvimuahe123@gmail.com','0705975416','19 Huỳnh Bá Chánh\r\nNhà Trọ','tfboys2016','pbkdf2_sha256$1000000$SzwAfCVCvKggCWx7iiy38v$crP6k0Eo+eroLmJc4l3ZUPCj5/HzryB5XttzVZ+EAO0=',100,1,'2025-10-10 09:57:58.894030','2025-10-10 09:58:00.036137',0);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-10-10 08:13:55.220431','1','maiviet283',2,'[{\"changed\": {\"fields\": [\"First name\", \"Last name\"]}}]',4,1),(2,'2025-10-10 09:06:20.795796','1','viet',1,'[{\"added\": {}}]',7,1),(3,'2025-10-10 09:15:53.708620','1','viet',2,'[{\"changed\": {\"fields\": [\"Avatar\"]}}]',7,1),(4,'2025-10-10 09:21:04.632981','1','Trần Đức Bo',2,'[{\"changed\": {\"fields\": [\"Username\", \"Email\", \"Full name\", \"Date of birth\", \"Address\", \"Loyalty points\"]}}]',7,1),(5,'2025-10-10 09:23:12.766019','1','Trần Đức Bo',2,'[{\"changed\": {\"fields\": [\"Avatar\"]}}]',7,1),(6,'2025-10-10 09:38:10.108059','1','Trần Đức Bo',2,'[]',7,1),(7,'2025-10-10 09:38:20.692003','1','Trần Đức Bo',2,'[]',7,1),(8,'2025-10-10 09:38:28.343624','1','Trần Đức Bo',2,'[]',7,1),(9,'2025-10-10 09:39:58.832717','1','Trần Đức Bo',2,'[]',7,1),(10,'2025-10-10 09:42:17.199317','1','Trần Đức Bo',2,'[{\"changed\": {\"fields\": [\"password\"]}}]',7,1),(11,'2025-10-10 09:49:36.419674','1','Trần Đức Bo',2,'[{\"changed\": {\"fields\": [\"password\"]}}]',7,1),(12,'2025-10-10 09:49:40.361361','1','Trần Đức Bo',2,'[]',7,1),(13,'2025-10-10 09:49:47.313298','1','Trần Đức Bo',2,'[{\"changed\": {\"fields\": [\"password\"]}}]',7,1),(14,'2025-10-10 09:56:24.082367','1','Trần Đức Bo',3,'',7,1),(15,'2025-10-10 09:58:00.038035','52','MAI QUOC VIET',1,'[{\"added\": {}}]',7,1),(16,'2025-10-10 09:58:21.907923','51','Bà Thành Đặng',2,'[{\"changed\": {\"fields\": [\"Avatar\"]}}]',7,1),(17,'2025-10-10 09:58:34.927788','50','Vân Trần',2,'[{\"changed\": {\"fields\": [\"Avatar\"]}}]',7,1),(18,'2025-10-10 09:59:12.044466','32','Hồng Phạm',2,'[{\"changed\": {\"fields\": [\"Is delete\"]}}]',7,1),(19,'2025-10-10 09:59:21.423447','29','Nam Đức Vũ',2,'[{\"changed\": {\"fields\": [\"Is active\"]}}]',7,1),(20,'2025-10-12 04:34:20.153403','1','Nhân Viên Bán Hàng',1,'[{\"added\": {}}]',3,1),(21,'2025-10-12 05:44:48.939170','1','Văn học Việt Nam',1,'[{\"added\": {}}]',9,1),(22,'2025-10-12 05:45:40.277671','2','Văn học nước ngoài',1,'[{\"added\": {}}]',9,1),(23,'2025-10-12 05:45:58.071479','3','Sách thiếu nhi',1,'[{\"added\": {}}]',9,1),(24,'2025-10-12 05:46:21.747086','4','Kinh tế & Quản trị',1,'[{\"added\": {}}]',9,1),(25,'2025-10-12 05:46:43.177457','5','Tâm lý & Phát triển bản thân',1,'[{\"added\": {}}]',9,1),(26,'2025-10-12 05:47:01.851167','6','Khoa học & Công nghệ',1,'[{\"added\": {}}]',9,1),(27,'2025-10-12 05:47:27.241168','7','Lịch sử & Chính trị',1,'[{\"added\": {}}]',9,1),(28,'2025-10-12 05:47:50.397524','8','Ngoại ngữ & Học thuật',1,'[{\"added\": {}}]',9,1),(29,'2025-10-12 05:48:05.145763','9','Tôn giáo & Triết học',1,'[{\"added\": {}}]',9,1),(30,'2025-10-12 05:48:27.594934','10','Truyện tranh & Manga',1,'[{\"added\": {}}]',9,1),(31,'2025-10-12 05:48:40.117626','1','Văn học Việt Nam',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',9,1),(32,'2025-10-12 05:48:45.434600','9','Tôn giáo & Triết học',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',9,1),(33,'2025-10-12 05:53:14.047079','1','Nhà Giả Kim',1,'[{\"added\": {}}, {\"added\": {\"name\": \"book image\", \"object\": \"\\u1ea2nh c\\u1ee7a S\\u00e1ch Nh\\u00e0 Gi\\u1ea3 Kim\"}}]',8,1),(34,'2025-10-12 05:53:44.851014','1','Nhà Giả Kim',2,'[{\"added\": {\"name\": \"book image\", \"object\": \"\\u1ea2nh c\\u1ee7a S\\u00e1ch Nh\\u00e0 Gi\\u1ea3 Kim\"}}, {\"added\": {\"name\": \"book image\", \"object\": \"\\u1ea2nh c\\u1ee7a S\\u00e1ch Nh\\u00e0 Gi\\u1ea3 Kim\"}}]',8,1),(35,'2025-10-12 05:54:12.186068','1','Nhà Giả Kim',2,'[{\"added\": {\"name\": \"book image\", \"object\": \"\\u1ea2nh c\\u1ee7a S\\u00e1ch Nh\\u00e0 Gi\\u1ea3 Kim\"}}]',8,1),(36,'2025-10-12 06:21:06.952103','1','Nhà Giả Kim',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',8,1),(37,'2025-10-12 06:21:21.323011','1','Nhà Giả Kim',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',8,1),(38,'2025-10-12 06:21:44.117355','1','Nhà Giả Kim',2,'[{\"added\": {\"name\": \"H\\u00ecnh \\u1ea2nh S\\u00e1ch\", \"object\": \"\\u1ea2nh c\\u1ee7a S\\u00e1ch Nh\\u00e0 Gi\\u1ea3 Kim\"}}]',8,1),(39,'2025-10-12 06:22:05.729563','1','Nhà Giả Kim',2,'[{\"added\": {\"name\": \"H\\u00ecnh \\u1ea2nh S\\u00e1ch\", \"object\": \"\\u1ea2nh c\\u1ee7a S\\u00e1ch Nh\\u00e0 Gi\\u1ea3 Kim\"}}]',8,1),(40,'2025-10-12 06:22:30.861217','1','Nhà Giả Kim',2,'[{\"changed\": {\"name\": \"H\\u00ecnh \\u1ea2nh S\\u00e1ch\", \"object\": \"\\u1ea2nh c\\u1ee7a S\\u00e1ch Nh\\u00e0 Gi\\u1ea3 Kim\", \"fields\": [\"Image\"]}}]',8,1),(41,'2025-10-12 06:22:51.778398','1','Nhà Giả Kim',2,'[{\"deleted\": {\"name\": \"H\\u00ecnh \\u1ea2nh S\\u00e1ch\", \"object\": \"\\u1ea2nh c\\u1ee7a S\\u00e1ch Nh\\u00e0 Gi\\u1ea3 Kim\"}}, {\"deleted\": {\"name\": \"H\\u00ecnh \\u1ea2nh S\\u00e1ch\", \"object\": \"\\u1ea2nh c\\u1ee7a S\\u00e1ch Nh\\u00e0 Gi\\u1ea3 Kim\"}}]',8,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(8,'book','book'),(10,'book','bookimage'),(9,'book','category'),(5,'contenttypes','contenttype'),(7,'customer','customer'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-10-10 07:52:12.207633'),(2,'auth','0001_initial','2025-10-10 07:52:12.596434'),(3,'admin','0001_initial','2025-10-10 07:52:12.692557'),(4,'admin','0002_logentry_remove_auto_add','2025-10-10 07:52:12.697023'),(5,'admin','0003_logentry_add_action_flag_choices','2025-10-10 07:52:12.703341'),(6,'contenttypes','0002_remove_content_type_name','2025-10-10 07:52:12.782428'),(7,'auth','0002_alter_permission_name_max_length','2025-10-10 07:52:12.823446'),(8,'auth','0003_alter_user_email_max_length','2025-10-10 07:52:12.839527'),(9,'auth','0004_alter_user_username_opts','2025-10-10 07:52:12.843870'),(10,'auth','0005_alter_user_last_login_null','2025-10-10 07:52:12.879397'),(11,'auth','0006_require_contenttypes_0002','2025-10-10 07:52:12.880708'),(12,'auth','0007_alter_validators_add_error_messages','2025-10-10 07:52:12.885276'),(13,'auth','0008_alter_user_username_max_length','2025-10-10 07:52:12.929189'),(14,'auth','0009_alter_user_last_name_max_length','2025-10-10 07:52:13.002258'),(15,'auth','0010_alter_group_name_max_length','2025-10-10 07:52:13.013821'),(16,'auth','0011_update_proxy_permissions','2025-10-10 07:52:13.023117'),(17,'auth','0012_alter_user_first_name_max_length','2025-10-10 07:52:13.073396'),(18,'sessions','0001_initial','2025-10-10 07:52:13.103501'),(19,'customer','0001_initial','2025-10-10 09:03:03.346388'),(20,'book','0001_initial','2025-10-12 05:42:30.699223'),(21,'customer','0002_alter_customer_options_alter_customer_gender_and_more','2025-10-12 05:42:30.707422'),(22,'book','0002_alter_book_options_alter_bookimage_options_and_more','2025-10-12 06:13:43.159188');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('7wpr5kp4js6l37em42137gk8kkmjpc2e','.eJxVjMsOwiAQRf-FtSG8Cy7d-w1kYAapGkhKuzL-uzbpQrf3nHNfLMK21rgNWuKM7MwkO_1uCfKD2g7wDu3Wee5tXebEd4UfdPBrR3peDvfvoMKo3xq0cBPZgFmmkr1AWVywRlhEUgqUJotOGMCJgvIhoZBKhwxgwRdhNHt_AOqIN_U:1v7pfG:1WWhM8YrAR2uFZBmQAXpQeGV3ZyDGtdZxRPh-DAHiKc','2025-10-26 06:34:42.076971'),('h6pwulgac659xhmib0sysu2n0qbbzgxq','.eJxVjMsOwiAQRf-FtSG8Cy7d-w1kYAapGkhKuzL-uzbpQrf3nHNfLMK21rgNWuKM7MwkO_1uCfKD2g7wDu3Wee5tXebEd4UfdPBrR3peDvfvoMKo3xq0cBPZgFmmkr1AWVywRlhEUgqUJotOGMCJgvIhoZBKhwxgwRdhNHt_AOqIN_U:1v7mRd:ouYgvbxZe_1uB5bkHLW-sWl2F9m7xpjykQa3Az_uggs','2025-10-26 03:08:25.748886');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'bookstore'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-12 13:51:16
