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
-- Table structure for table `access_level`
--

DROP TABLE IF EXISTS `access_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_level` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_level`
--

LOCK TABLES `access_level` WRITE;
/*!40000 ALTER TABLE `access_level` DISABLE KEYS */;
INSERT INTO `access_level` VALUES (1,'admin'),(2,'cashier');
/*!40000 ALTER TABLE `access_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Pork Sisig'),(2,'Chicken Sisig'),(15,'Bangus Sisig'),(16,'Lumpia');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense`
--

DROP TABLE IF EXISTS `expense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `created_by` int NOT NULL,
  `expense_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense`
--

LOCK TABLES `expense` WRITE;
/*!40000 ALTER TABLE `expense` DISABLE KEYS */;
INSERT INTO `expense` VALUES (1,'Salary',500.00,1,'2024-06-21 15:26:09',NULL,'2024-06-21 23:26:09');
/*!40000 ALTER TABLE `expense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `packaging_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `price_at_order` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (1,1,1,1,1,130.00),(2,1,2,1,1,130.00),(3,1,9,1,1,100.00),(4,1,10,1,1,100.00),(5,2,10,1,1,100.00),(6,2,1,1,1,130.00),(7,3,2,1,1,130.00),(8,3,1,1,1,130.00),(9,4,1,1,1,130.00),(10,4,2,1,1,130.00),(11,4,9,1,1,100.00),(12,5,10,1,1,100.00),(13,5,1,1,1,130.00),(14,5,2,1,1,130.00),(15,5,9,1,2,100.00),(16,6,12,1,1,110.00),(17,6,10,1,1,100.00),(18,6,1,1,1,130.00),(19,6,2,1,1,130.00),(20,6,9,1,1,100.00),(21,7,12,1,9,110.00),(22,7,10,1,1,100.00),(23,8,10,1,1,100.00),(24,8,1,1,1,130.00),(25,8,2,1,1,130.00),(26,8,12,1,1,110.00),(27,8,9,1,1,100.00),(28,9,1,1,2,130.00),(29,9,10,1,2,100.00),(30,9,9,1,1,100.00),(31,9,2,1,1,130.00),(32,9,12,1,1,110.00),(33,9,13,8,2,200.00),(34,10,13,8,1,200.00),(35,10,9,1,1,100.00),(36,10,10,1,1,100.00),(37,10,1,1,1,130.00),(38,11,12,1,1,110.00),(39,12,13,8,1,200.00),(48,16,14,8,1,160.00),(49,16,12,1,1,110.00);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_type`
--

DROP TABLE IF EXISTS `order_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_type`
--

LOCK TABLES `order_type` WRITE;
/*!40000 ALTER TABLE `order_type` DISABLE KEYS */;
INSERT INTO `order_type` VALUES (1,'Dine In'),(2,'Take Out'),(3,'Delivery');
/*!40000 ALTER TABLE `order_type` ENABLE KEYS */;
UNLOCK TABLES;

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
  `status_id` int DEFAULT '1',
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `order_type_id` (`order_type_id`) /*!80000 INVISIBLE */,
  KEY `orders_ibfk_2_idx` (`payment_method_id`) /*!80000 INVISIBLE */,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`order_type_id`) REFERENCES `order_type` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,460.00,4,1,0,460,1,1,'2024-06-19 11:17:28'),(2,1,230.00,2,1,0,300,1,1,'2024-06-19 11:17:33'),(3,1,260.00,2,1,0,300,2,1,'2024-06-19 11:17:43'),(4,1,360.00,3,3,0,400,3,1,'2024-06-19 11:17:52'),(5,1,560.00,5,3,0,600,4,1,'2024-06-19 11:18:09'),(6,1,570.00,5,1,0,570,2,1,'2024-06-19 20:03:48'),(7,1,1090.00,10,1,0,1100,1,1,'2024-06-19 20:03:58'),(8,1,550.00,5,2,20,600,1,1,'2024-06-21 13:12:58'),(9,1,1200.00,9,2,0,1200,1,1,'2024-06-21 14:24:33'),(10,1,530.00,4,2,0,600,1,1,'2024-06-21 14:24:54'),(11,1,110.00,1,2,0,110,2,1,'2024-06-21 14:55:31'),(12,1,200.00,1,3,0,200,4,1,'2024-06-21 14:56:07'),(16,1,270.00,2,2,0,270,2,1,'2024-06-21 18:13:12');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packaging`
--

DROP TABLE IF EXISTS `packaging`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packaging` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `deleted_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packaging`
--

LOCK TABLES `packaging` WRITE;
/*!40000 ALTER TABLE `packaging` DISABLE KEYS */;
INSERT INTO `packaging` VALUES (1,'Meal',53,NULL,NULL),(7,'test',4,4,'2024-06-12 18:42:35'),(8,'Kasalo',20,NULL,NULL);
/*!40000 ALTER TABLE `packaging` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packaging_quantity_log`
--

DROP TABLE IF EXISTS `packaging_quantity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packaging_quantity_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packaging_id` int NOT NULL,
  `start_quantity` int DEFAULT '0',
  `end_quantity` int DEFAULT '0',
  `log_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_packaging_log` (`packaging_id`,`log_date`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packaging_quantity_log`
--

LOCK TABLES `packaging_quantity_log` WRITE;
/*!40000 ALTER TABLE `packaging_quantity_log` DISABLE KEYS */;
INSERT INTO `packaging_quantity_log` VALUES (1,1,20,24,'2024-06-18 16:00:00'),(2,7,4,4,'2024-06-18 16:00:00'),(3,8,20,15,'2024-06-18 16:00:00'),(40,1,24,70,'2024-06-19 16:00:00'),(41,8,15,10,'2024-06-19 16:00:00'),(42,1,54,54,'2024-06-20 16:00:00'),(43,8,10,10,'2024-06-20 16:00:00'),(50,1,54,54,'2024-06-21 16:00:00'),(51,8,10,10,'2024-06-21 16:00:00');
/*!40000 ALTER TABLE `packaging_quantity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_method`
--

DROP TABLE IF EXISTS `payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_method` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_method`
--

LOCK TABLES `payment_method` WRITE;
/*!40000 ALTER TABLE `payment_method` DISABLE KEYS */;
INSERT INTO `payment_method` VALUES (1,'Cash'),(2,'GCash'),(3,'Panda'),(4,'Grab');
/*!40000 ALTER TABLE `payment_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(45) DEFAULT NULL,
  `product_name` varchar(45) NOT NULL,
  `product_quantity` int NOT NULL DEFAULT '0',
  `price` decimal(10,2) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `category_id` int NOT NULL,
  `packaging_id` int NOT NULL,
  `deleted_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `category_id` (`category_id`),
  KEY `packaging_id` (`packaging_id`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`),
  CONSTRAINT `product_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `user` (`id`),
  CONSTRAINT `product_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `product_ibfk_4` FOREIGN KEY (`packaging_id`) REFERENCES `packaging` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'PM','Pork Meal',14,130.00,'2024-05-16 09:51:44',1,1,'2024-05-16 09:51:44','2024-06-21 18:03:42',1,1,NULL,NULL),(2,'CM','Chicken Meal',12,130.00,'2024-05-17 19:21:22',1,1,'2024-05-17 19:21:22','2024-06-21 18:04:37',2,1,NULL,NULL),(9,'BM','Bangus Meal',11,100.00,'2024-05-25 16:16:55',1,1,'2024-05-25 16:16:55','2024-06-21 14:24:54',15,1,NULL,NULL),(10,'BC','Chicken Budget',9,100.00,'2024-05-26 16:20:07',1,1,'2024-05-26 16:20:07','2024-06-21 17:53:57',2,1,NULL,NULL),(11,'test','test',4,44.00,'2024-06-12 18:31:27',4,NULL,'2024-06-12 18:31:27','2024-06-12 18:33:50',1,1,4,'2024-06-12 18:33:50'),(12,'LM','Lumpia Meal',5,110.00,'2024-06-19 11:25:28',1,NULL,'2024-06-19 11:25:28','2024-06-21 18:13:12',16,1,NULL,NULL),(13,'PK','Pork Kasalo',5,200.00,'2024-06-21 14:23:29',1,NULL,'2024-06-21 14:23:29','2024-06-21 18:04:37',1,8,NULL,NULL),(14,'BK','Bangus Kasalo',9,160.00,'2024-06-21 15:20:03',1,NULL,'2024-06-21 15:20:03','2024-06-21 18:13:12',15,8,NULL,NULL),(15,'CK','Chicken Kasalo',19,180.00,'2024-06-21 15:22:22',1,NULL,'2024-06-21 15:22:22','2024-06-21 17:53:57',2,8,NULL,NULL);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_quantity_log`
--

DROP TABLE IF EXISTS `product_quantity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_quantity_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `start_quantity` int DEFAULT '0',
  `end_quantity` int DEFAULT '0',
  `log_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_log` (`product_id`,`log_date`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_quantity_log`
--

LOCK TABLES `product_quantity_log` WRITE;
/*!40000 ALTER TABLE `product_quantity_log` DISABLE KEYS */;
INSERT INTO `product_quantity_log` VALUES (1,1,14,14,'2024-06-18 16:00:00'),(2,2,14,15,'2024-06-18 16:00:00'),(3,9,14,15,'2024-06-18 16:00:00'),(4,10,14,16,'2024-06-18 16:00:00'),(5,11,4,4,'2024-06-18 16:00:00'),(17,12,20,20,'2024-06-18 16:00:00'),(30,1,14,19,'2024-06-19 16:00:00'),(31,2,15,14,'2024-06-19 16:00:00'),(32,9,15,14,'2024-06-19 16:00:00'),(33,10,16,14,'2024-06-19 16:00:00'),(34,12,20,10,'2024-06-19 16:00:00'),(35,1,15,15,'2024-06-20 16:00:00'),(36,2,12,12,'2024-06-20 16:00:00'),(37,9,11,11,'2024-06-20 16:00:00'),(38,10,10,10,'2024-06-20 16:00:00'),(39,12,7,7,'2024-06-20 16:00:00'),(45,13,6,6,'2024-06-20 16:00:00'),(52,14,10,10,'2024-06-20 16:00:00'),(53,15,20,20,'2024-06-20 16:00:00'),(62,1,15,15,'2024-06-21 16:00:00'),(63,2,12,12,'2024-06-21 16:00:00'),(64,9,11,11,'2024-06-21 16:00:00'),(65,10,10,10,'2024-06-21 16:00:00'),(66,12,7,7,'2024-06-21 16:00:00'),(67,13,6,6,'2024-06-21 16:00:00'),(68,14,10,10,'2024-06-21 16:00:00'),(69,15,20,20,'2024-06-21 16:00:00');
/*!40000 ALTER TABLE `product_quantity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES (1,'Completed'),(2,'Voided');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_adjustments`
--

DROP TABLE IF EXISTS `stock_adjustments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_adjustments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packaging_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `prev_quantity` int DEFAULT NULL,
  `type` varchar(10) NOT NULL,
  `created_by` int NOT NULL,
  `transaction_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_type` CHECK ((`type` in (_utf8mb4'restock',_utf8mb4'damaged')))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_adjustments`
--

LOCK TABLES `stock_adjustments` WRITE;
/*!40000 ALTER TABLE `stock_adjustments` DISABLE KEYS */;
INSERT INTO `stock_adjustments` VALUES (1,NULL,1,5,NULL,'restock',1,'2024-06-19 19:18:53',NULL,'2024-06-19 19:18:53'),(2,NULL,9,5,NULL,'restock',1,'2024-06-19 19:19:04',NULL,'2024-06-19 19:19:04'),(3,NULL,10,5,NULL,'restock',1,'2024-06-19 19:19:16',NULL,'2024-06-19 19:19:16'),(4,NULL,2,5,NULL,'restock',1,'2024-06-19 19:19:30',NULL,'2024-06-19 19:19:30'),(5,8,NULL,5,NULL,'damaged',1,'2024-06-19 19:20:18',NULL,'2024-06-19 19:20:18'),(6,1,NULL,10,0,'restock',1,'2024-06-19 19:20:28',1,'2024-06-19 20:24:46'),(7,1,NULL,4,6,'restock',1,'2024-06-20 02:47:27',1,'2024-06-20 03:37:21'),(8,8,NULL,5,1,'damaged',1,'2024-06-20 03:33:04',1,'2024-06-20 03:37:58'),(9,NULL,1,6,4,'restock',1,'2024-06-20 03:39:28',1,'2024-06-20 03:39:55'),(11,1,NULL,2,NULL,'restock',1,'2024-06-20 03:51:56',NULL,'2024-06-20 03:51:56'),(12,1,NULL,10,NULL,'restock',1,'2024-06-20 03:53:43',NULL,'2024-06-20 03:53:43'),(13,1,NULL,5,NULL,'restock',1,'2024-06-20 03:55:38',NULL,'2024-06-20 03:55:38'),(14,1,NULL,50,NULL,'restock',1,'2024-06-20 04:03:30',NULL,'2024-06-20 04:03:30'),(15,8,NULL,4,NULL,'restock',1,'2024-06-21 23:00:45',NULL,'2024-06-21 23:00:45'),(16,8,NULL,10,5,'restock',1,'2024-06-22 02:07:44',1,'2024-06-22 03:45:02'),(17,8,NULL,1,NULL,'restock',1,'2024-06-22 03:47:36',NULL,'2024-06-22 03:47:36');
/*!40000 ALTER TABLE `stock_adjustments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `access_level_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `access_level_id` (`access_level_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`access_level_id`) REFERENCES `access_level` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'555','555','553','555',1),(3,'555','555','555','555',2),(4,'666','666','666','666',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-24 23:03:39
