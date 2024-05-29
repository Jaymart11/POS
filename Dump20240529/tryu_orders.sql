-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: tryu
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `total_items` int NOT NULL DEFAULT '0',
  `order_type_id` int DEFAULT NULL,
  `discount` int DEFAULT '0',
  `amount` int DEFAULT NULL,
  `payment_method_id` int NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `order_type_id` (`order_type_id`) /*!80000 INVISIBLE */,
  KEY `orders_ibfk_2_idx` (`payment_method_id`) /*!80000 INVISIBLE */,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`order_type_id`) REFERENCES `order_type` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (2,1,100.00,3,1,0,NULL,1,'2024-05-21 17:57:34'),(3,1,100.00,0,1,0,NULL,1,'2024-05-21 19:03:42'),(4,1,100.00,0,1,0,NULL,1,'2024-05-21 19:04:17'),(5,1,100.00,0,1,0,NULL,1,'2024-05-21 19:06:50'),(6,1,100.00,0,1,0,NULL,1,'2024-05-21 19:12:10'),(7,1,100.00,0,1,0,NULL,1,'2024-05-21 19:12:28'),(8,1,100.00,0,1,0,NULL,1,'2024-05-21 19:12:45'),(9,1,100.00,0,1,0,NULL,1,'2024-05-21 19:13:50'),(10,1,100.00,0,1,0,NULL,1,'2024-05-21 19:15:16'),(11,1,100.00,0,1,0,NULL,1,'2024-05-21 19:15:26'),(12,1,100.00,0,1,0,NULL,1,'2024-05-21 19:15:59'),(13,1,100.00,0,1,0,NULL,1,'2024-05-21 19:17:41'),(14,1,100.00,0,1,0,NULL,1,'2024-05-21 19:17:53'),(15,1,100.00,0,1,0,NULL,1,'2024-05-21 19:18:37'),(16,1,100.00,0,1,0,NULL,1,'2024-05-21 19:21:12'),(17,1,100.00,0,1,0,NULL,1,'2024-05-21 19:24:38'),(18,1,100.00,0,1,0,NULL,1,'2024-05-21 19:27:05'),(19,1,100.00,0,1,0,NULL,1,'2024-05-21 19:27:50'),(20,1,100.00,0,1,0,NULL,1,'2024-05-21 19:28:45'),(21,1,100.00,0,1,0,NULL,1,'2024-05-21 19:33:10'),(22,1,100.00,0,1,0,NULL,1,'2024-05-21 19:33:36'),(23,1,520.00,4,1,0,600,1,'2024-05-24 16:42:26'),(24,1,650.00,5,1,0,700,1,'2024-05-24 16:47:50'),(25,1,390.00,3,1,0,400,1,'2024-05-24 16:48:38'),(26,1,1170.00,9,1,0,1200,1,'2024-05-24 16:54:11'),(27,1,520.00,4,1,0,600,1,'2024-05-24 16:56:42'),(28,1,390.00,3,3,0,390,1,'2024-05-24 16:57:17'),(29,1,1560.00,12,1,NULL,1430,1,'2024-05-24 18:27:35'),(30,1,389.00,3,1,1,260,1,'2024-05-24 18:29:35'),(31,1,0.00,2,1,0,260,1,'2024-05-24 18:34:58'),(32,1,0.00,1,1,0,130,1,'2024-05-24 18:35:41'),(33,1,0.00,1,1,0,130,1,'2024-05-24 18:35:58'),(34,1,0.00,1,1,0,130,1,'2024-05-24 18:37:27'),(35,1,130.00,1,1,0,130,1,'2024-05-24 18:40:54'),(36,1,130.00,1,1,0,130,1,'2024-05-24 18:41:01'),(37,1,130.00,1,1,0,130,1,'2024-05-24 18:41:10'),(38,1,130.00,1,1,0,312,1,'2024-05-24 18:41:19'),(39,1,130.00,1,1,0,5234,1,'2024-05-24 18:41:24'),(40,1,0.00,0,1,0,5151512,1,'2024-05-24 18:41:30'),(41,1,0.00,0,1,0,5555,1,'2024-05-24 18:41:33'),(42,1,130.00,1,1,0,130,1,'2024-05-24 18:41:50'),(43,1,130.00,1,1,0,130,1,'2024-05-24 18:41:58'),(44,1,130.00,1,1,0,130,1,'2024-05-24 18:42:02'),(45,1,130.00,1,1,0,130,1,'2024-05-24 18:42:19'),(46,1,130.00,1,1,0,130,1,'2024-05-24 18:42:47'),(47,1,130.00,1,1,0,130,1,'2024-05-24 18:42:55'),(48,1,390.00,3,1,0,390,1,'2024-05-24 18:43:07'),(49,1,130.00,1,1,0,3,1,'2024-05-24 19:11:26'),(50,1,260.00,2,1,0,2,1,'2024-05-24 19:12:03'),(51,1,130.00,1,1,0,2,1,'2024-05-24 19:12:29'),(52,1,350.00,3,1,10,400,1,'2024-05-25 16:30:00'),(53,1,100.00,1,1,30,500,1,'2024-05-25 16:39:28'),(54,1,100.00,1,1,0,100,1,'2024-05-25 17:17:46'),(55,1,820.00,7,1,0,900,1,'2024-05-26 16:20:45'),(56,1,230.00,2,1,0,230,1,'2024-05-26 18:15:28'),(66,1,460.00,4,1,0,460,1,'2024-05-28 12:44:12'),(67,1,460.00,4,1,0,460,2,'2024-05-28 12:44:18'),(68,1,460.00,4,3,0,460,3,'2024-05-28 12:44:28'),(69,1,460.00,4,3,0,460,4,'2024-05-28 12:44:40'),(70,1,460.00,4,3,0,469,4,'2024-05-28 15:02:30'),(71,1,460.00,4,1,0,500,1,'2024-05-28 15:20:26'),(72,1,460.00,4,1,0,460,1,'2024-05-29 03:35:22'),(73,1,260.00,2,1,0,460,2,'2024-05-29 03:35:30'),(74,1,260.00,2,3,0,300,3,'2024-05-29 03:35:43'),(75,1,360.00,3,3,0,360,4,'2024-05-29 03:35:58');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-29 12:45:52
