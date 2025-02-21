-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: ssafy_web_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_session`
--

DROP TABLE IF EXISTS `chat_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_session` (
  `session_id` binary(16) NOT NULL,
  `bot_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_session`
--

LOCK TABLES `chat_session` WRITE;
/*!40000 ALTER TABLE `chat_session` DISABLE KEYS */;
INSERT INTO `chat_session` VALUES (_binary 'W(\�\�qN��`\�۩Z\\�',1,'2025-02-17 09:02:34.236887','ACTIVE','2025-02-17 09:02:34.236887','mgh123rg@gmail.com','음...'),(_binary 'R�&ӿJ���H�\�z��',3,'2025-02-14 12:53:04.564165','ACTIVE','2025-02-14 12:53:04.564165','mgh123rg@gmail.com','와우'),(_binary '�(݉:GЧ�[\�켎�',1,'2025-02-10 17:16:23.002664','ACTIVE','2025-02-10 17:16:23.002664','mgh123rg@gmail.com','하나'),(_binary '\�>�MPB��\�\��*E\�',1,'2025-02-17 09:55:51.069887','ACTIVE','2025-02-17 09:55:51.069887','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '\nC\��F\�D=�N\�D�82�',6,'2025-02-14 14:47:37.806089','ACTIVE','2025-02-14 14:47:37.806089','mgh123rg@gmail.com','둘'),(_binary '\�R�zCF`�\�ƥF<\�\�',1,'2025-02-18 13:59:46.130787','ACTIVE','2025-02-18 13:59:49.177321','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '_���GM�����a�kN',3,'2025-02-11 13:00:48.928304','CLOSED','2025-02-11 13:00:50.661462','mgh123rg@gmail.com','셋'),(_binary '\��\�\��F�����\�t',4,'2025-02-18 14:39:55.614759','ACTIVE','2025-02-18 14:42:12.820150','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '\��Nί\�\Z[\�c',1,'2025-02-14 16:07:37.007182','ACTIVE','2025-02-14 16:07:37.007182','mgh123rg@gmail.com','범달아 테스트해보자'),(_binary '\�Y�D���?�\���',1,'2025-02-17 10:20:31.455935','ACTIVE','2025-02-17 10:20:31.455935','mgh123rg@gmail.com','안'),(_binary '#���@\���\�^\�D;*',6,'2025-02-18 14:22:40.509203','ACTIVE','2025-02-18 14:22:45.319452','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '\�\�\�\�\�H�\�\�%��',4,'2025-02-11 14:26:08.542441','CLOSED','2025-02-11 14:26:13.863559','mgh123rg@gmail.com','넷'),(_binary 'V�B3E�S\�g#\�\�',2,'2025-02-18 17:06:45.625228','ACTIVE','2025-02-18 17:06:49.263556','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '�L�PNT���&@��',1,'2025-02-14 16:52:12.836769','ACTIVE','2025-02-14 16:52:12.836769','mgh123rg@gmail.com','테스트'),(_binary '5�2ZH��d��\�ƅ',1,'2025-02-17 10:26:26.924206','ACTIVE','2025-02-17 10:26:26.924206','mgh123rg@gmail.com','하이'),(_binary '1D^H*��.�b�',1,'2025-02-17 11:00:48.359809','ACTIVE','2025-02-18 12:52:28.649095','mgh123rg@gmail.com','하이'),(_binary 'R\��ϑG`�����\�',1,'2025-02-19 09:52:31.145473','ACTIVE','2025-02-19 11:27:13.503320','mgh123rg@gmail.com','ㅇㅇ'),(_binary '�;\�\��Gi��\npL',4,'2025-02-11 14:23:26.074932','CLOSED','2025-02-11 14:24:41.995157','mgh123rg@gmail.com','다섯'),(_binary '\Z7\�PD̵\�]Mb͇',1,'2025-02-17 10:12:23.195591','ACTIVE','2025-02-17 10:12:23.195591','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '\�S�\�KS�~JpԃX\�',1,'2025-02-14 13:07:44.140048','ACTIVE','2025-02-14 13:07:44.140048','mgh123rg@gmail.com','여섯'),(_binary 'suM�\�Kд�X�Ɋ',1,'2025-02-18 18:11:44.331104','CLOSED','2025-02-18 18:43:12.298708','mgh123rg@gmail.com','ㅇㅇ'),(_binary '9��ݻHׅs���K\�',1,'2025-02-17 10:12:59.299362','ACTIVE','2025-02-17 10:12:59.299362','mgh123rg@gmail.com','왜 안 돼'),(_binary ' �D�u�I\�\�$��\�b',1,'2025-02-14 16:12:53.769582','ACTIVE','2025-02-14 16:12:53.769582','mgh123rg@gmail.com','헤이'),(_binary ' �x��I\\�\��=�`�',4,'2025-02-10 17:29:03.382552','ACTIVE','2025-02-10 17:29:03.382552','mgh123rg@gmail.com','일곱'),(_binary '\"\\\���EL�\�\\�\�C',4,'2025-02-18 17:40:58.505031','ACTIVE','2025-02-18 17:54:36.984953','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '#k>�\�NA�E[�(\�\n',1,'2025-02-10 17:18:24.351099','ACTIVE','2025-02-10 17:18:24.351099','mgh123rg@gmail.com','여덟'),(_binary '&	e�H~��Z\�\�\�\�\�',1,'2025-02-14 16:01:44.024238','ACTIVE','2025-02-14 16:01:44.024238','mgh123rg@gmail.com','루미 하위요'),(_binary '&�\n8#KI������',3,'2025-02-11 13:57:21.591245','CLOSED','2025-02-11 13:58:58.935426','mgh123rg@gmail.com','아홉'),(_binary '(5\'�}�L\��|gN�I��',1,'2025-02-17 10:26:45.247581','ACTIVE','2025-02-17 10:26:45.247581','mgh123rg@gmail.com','ㅇㅇ'),(_binary ')\�`�\�D[�\�\�\��o\�',1,'2025-02-12 12:17:16.371754','CLOSED','2025-02-12 12:40:19.195190','mgh123rg@gmail.com','열'),(_binary '+\��I\\����и3�',1,'2025-02-12 17:46:46.172491','CLOSED','2025-02-12 17:50:19.595858','mgh123rg@gmail.com','열하나'),(_binary '+2���O��N\�Fc�Q',1,'2025-02-14 11:25:05.820542','CLOSED','2025-02-14 12:44:42.921531','mgh123rg@gmail.com','열둘'),(_binary ',k�u\�\�G6�I���\�\'',1,'2025-02-17 09:02:23.817266','ACTIVE','2025-02-17 09:02:23.817266','mgh123rg@gmail.com','하이'),(_binary '-���\�_H♨N\�U',2,'2025-02-17 09:02:46.953641','ACTIVE','2025-02-17 09:02:46.953641','mgh123rg@gmail.com','오'),(_binary '.&\']ڧNü�.#>B\"',1,'2025-02-12 17:25:14.348567','CLOSED','2025-02-12 17:27:36.581321','mgh123rg@gmail.com','열셋'),(_binary '.Ȕ�/N��Al\�\��',1,'2025-02-12 17:27:52.502528','CLOSED','2025-02-12 17:46:43.177720','mgh123rg@gmail.com','열넷'),(_binary '0\�\�C��M־E\�\���0',1,'2025-02-17 16:42:41.257592','ACTIVE','2025-02-17 16:42:41.257592','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '2\�K�\�B���\�\�%�\�',1,'2025-02-17 11:29:33.525152','ACTIVE','2025-02-17 11:29:33.525152','mgh123rg@gmail.com','아휘'),(_binary '2��	JrIʹ\0�J{\�',1,'2025-02-17 09:20:16.465469','ACTIVE','2025-02-17 09:20:16.465469','mgh123rg@gmail.com','안녕'),(_binary '3t\�.�N��\r�Q�\�/',1,'2025-02-17 15:39:28.950330','ACTIVE','2025-02-18 15:22:44.700630','mgh123rg@gmail.com','레츠고'),(_binary ':P\�k�D����T\nן',6,'2025-02-18 14:28:41.196618','ACTIVE','2025-02-18 14:28:42.027829','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary ':�`\�\�A��\'I\�1�q|',2,'2025-02-17 11:01:43.125466','ACTIVE','2025-02-17 11:01:43.125466','mgh123rg@gmail.com','야호'),(_binary ';{���sIL��S?�\�wA',4,'2025-02-18 14:27:28.160379','ACTIVE','2025-02-18 14:27:28.762484','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '=|���M��\�8���$w',1,'2025-02-17 10:27:23.013491','ACTIVE','2025-02-17 10:27:23.013491','mgh123rg@gmail.com','와우'),(_binary '=?\�7\�3Eѧ\�r	C\�S',1,'2025-02-17 10:24:31.434872','ACTIVE','2025-02-18 14:15:38.101947','mgh123rg@gmail.com','하위'),(_binary '?\��-]1B@�;-\�O%r',2,'2025-02-17 09:20:38.173596','ACTIVE','2025-02-17 09:20:38.173596','mgh123rg@gmail.com','하이'),(_binary '?��\�K£E�\���3�',5,'2025-02-18 17:06:53.114668','ACTIVE','2025-02-18 17:06:58.892231','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '@R)��\�Nࠂk�SU��',1,'2025-02-17 09:01:24.855463','ACTIVE','2025-02-17 09:01:24.855463','mgh123rg@gmail.com','흐음'),(_binary '@�\�E\��C��t�S�7r',1,'2025-02-14 17:08:55.046023','ACTIVE','2025-02-14 17:08:55.046023','mgh123rg@gmail.com','안녕'),(_binary 'A\�y\"�Kg�c�+��0s',2,'2025-02-18 16:47:55.632341','ACTIVE','2025-02-18 16:48:10.695743','mgh123rg@gmail.com','ㅎㅇ'),(_binary 'BE�\�\�XDÉ?Y�\�ٶ',3,'2025-02-11 12:54:29.900420','CLOSED','2025-02-11 12:54:31.518167','mgh123rg@gmail.com','열다섯'),(_binary 'E�7x{\�B�C�\�Z\\\�',1,'2025-02-14 14:16:53.716784','ACTIVE','2025-02-14 14:16:53.716784','mgh123rg@gmail.com','열여섯'),(_binary 'E\�2�l=L\�Ҧ�Ê=',3,'2025-02-11 12:31:00.808709','CLOSED','2025-02-11 12:32:11.978666','mgh123rg@gmail.com','열일곱'),(_binary 'F;�u�CI���-�\�',1,'2025-02-17 09:13:31.582108','ACTIVE','2025-02-17 09:13:31.582108','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary 'K��dWOV��W��t8',1,'2025-02-17 10:24:49.810513','ACTIVE','2025-02-17 10:24:49.810513','mgh123rg@gmail.com','요'),(_binary 'L\�S�M�O@����h�',1,'2025-02-17 09:12:54.098453','ACTIVE','2025-02-17 09:12:54.098453','mgh123rg@gmail.com','안녕'),(_binary 'L\�=�B���t��2�',1,'2025-02-14 16:00:21.873464','ACTIVE','2025-02-14 16:00:21.873464','mgh123rg@gmail.com','범달 하위'),(_binary 'N�t2}hEb�/\�\�\�\Zͯ',3,'2025-02-11 13:00:01.573035','CLOSED','2025-02-11 13:00:06.292699','mgh123rg@gmail.com','열여덟'),(_binary 'OZ�\��ZIN���\'\�K_\�',1,'2025-02-17 09:53:56.845890','ACTIVE','2025-02-17 09:53:56.845890','mgh123rg@gmail.com','자 가보자'),(_binary 'R�\'!�B0�\\��%0ȍ',1,'2025-02-19 09:51:24.274547','ACTIVE','2025-02-19 09:51:25.116803','mgh123rg@gmail.com','ㅇㅇ'),(_binary 'S[	ߡHĐK\�\�y̥\�',1,'2025-02-18 14:23:49.736442','ACTIVE','2025-02-18 15:01:07.936029','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary 'S|)���G\��\�\�^*R�\�',2,'2025-02-17 09:16:13.889521','ACTIVE','2025-02-17 09:16:13.889521','mgh123rg@gmail.com','그래'),(_binary 'T[\�_�B���D\�\�s�',1,'2025-02-17 10:22:43.704694','ACTIVE','2025-02-17 10:22:43.704694','mgh123rg@gmail.com','음'),(_binary 'U?�A�Nѐ���8ۢt',1,'2025-02-12 17:50:23.057167','CLOSED','2025-02-12 17:58:01.526680','mgh123rg@gmail.com','열아홉'),(_binary 'Z�6}C\�B�$���U\�',5,'2025-02-18 14:22:45.070118','ACTIVE','2025-02-18 14:22:55.577938','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '[�\���M\��\�@�CG�',1,'2025-02-13 18:03:39.786589','CLOSED','2025-02-14 09:51:00.078735','mgh123rg@gmail.com','스물'),(_binary '\\|\�F<@ҷ��\�\�_\�',1,'2025-02-18 15:24:22.285888','ACTIVE','2025-02-19 12:57:24.115799','mgh123rg@gmail.com','새로운 채팅을 해보자'),(_binary '\\)\���\�I,�,��O�',1,'2025-02-14 10:21:11.144064','ACTIVE','2025-02-14 10:21:11.144064','mgh123rg@gmail.com','스물하나'),(_binary '\\8\�\"ǊK��\�\�e��',3,'2025-02-11 14:26:26.123467','CLOSED','2025-02-11 14:27:46.001415','mgh123rg@gmail.com','스물둘'),(_binary ']m�_;\�I\'�\�ri��9!',3,'2025-02-11 12:53:50.499409','CLOSED','2025-02-11 12:53:52.387800','mgh123rg@gmail.com','스물셋'),(_binary '^_�\�\�Iܬ�țfDΨ',1,'2025-02-18 10:58:21.972418','CLOSED','2025-02-18 10:58:50.147075','mgh123rg@gmail.com','안녕~'),(_binary 'a	\��f�J>�A@OvF�',1,'2025-02-18 12:20:13.296938','CLOSED','2025-02-19 13:38:40.698051','mgh123rg@gmail.com','재물운의 긍정적 변화'),(_binary 'b/�i�hE���t\�\�H\�',4,'2025-02-18 14:42:12.255127','ACTIVE','2025-02-18 14:48:51.391035','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary 'b��\"jkO��\�^�\�fB',1,'2025-02-17 10:05:54.745037','ACTIVE','2025-02-17 10:05:54.745037','mgh123rg@gmail.com','하위'),(_binary 'c��}�\�Ip��R�\�W\�w',1,'2025-02-17 09:00:45.885933','ACTIVE','2025-02-17 09:00:45.885933','mgh123rg@gmail.com','첫 메시지'),(_binary 'do�\�l0D�3\�7�:\�',1,'2025-02-12 17:24:07.043304','CLOSED','2025-02-12 17:25:12.372818','mgh123rg@gmail.com','스물넷'),(_binary 'e�\�a�@ɸ\0X�\�Qvi',1,'2025-02-17 10:21:55.410571','ACTIVE','2025-02-17 10:21:55.410571','mgh123rg@gmail.com','오 혹시'),(_binary 'i�D]I���YV0��\�',4,'2025-02-18 14:39:40.605406','ACTIVE','2025-02-18 14:39:40.605406','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary 'iث\�EBm�G��mo��',1,'2025-02-14 16:03:17.994356','ACTIVE','2025-02-14 16:03:17.994356','mgh123rg@gmail.com','왜 사라지는 걸까?'),(_binary 'j\Z\�\��Nl����Ӯ\�',2,'2025-02-10 17:32:44.000077','ACTIVE','2025-02-10 17:32:44.000077','mgh123rg@gmail.com','스물다섯'),(_binary 'js�P\�D�����Z<��',1,'2025-02-19 12:47:50.383046','CLOSED','2025-02-19 12:49:34.385912','mgh123rg@gmail.com','하위'),(_binary 'j{y��C�\��ItS!',1,'2025-02-14 13:25:32.395094','ACTIVE','2025-02-14 13:25:32.395094','mgh123rg@gmail.com','스물여섯'),(_binary 'q�+\�*lG����(u{t',1,'2025-02-19 09:38:57.698934','ACTIVE','2025-02-19 09:48:48.787737','mgh123rg@gmail.com','하위'),(_binary 't�\�4ҮK\"�M\Zp\Z\"$',6,'2025-02-18 14:22:55.321940','ACTIVE','2025-02-18 14:23:06.849993','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary 'u6\�*2N��m�*Q\�',1,'2025-02-17 12:30:11.875035','ACTIVE','2025-02-17 12:30:11.875035','mgh123rg@gmail.com','하이'),(_binary 'u��.BL��\�a9�\�?',3,'2025-02-11 15:02:47.626973','CLOSED','2025-02-11 15:04:01.362631','mgh123rg@gmail.com','스물일곱'),(_binary 'w!nz\�\�C��-���t',1,'2025-02-14 16:11:16.241925','ACTIVE','2025-02-14 16:11:16.241925','mgh123rg@gmail.com','뭐가 문제일까?'),(_binary 'w��\�@\�N܊,�6�\�c5',3,'2025-02-17 10:26:36.025675','ACTIVE','2025-02-17 10:26:36.025675','mgh123rg@gmail.com','ㅇㅇ'),(_binary 'zA+O�\�D��\�\�x\�r',1,'2025-02-17 16:15:35.204243','ACTIVE','2025-02-17 16:15:35.204243','mgh123rg@gmail.com','테스트'),(_binary '}$vW#\�B��\�Pݑ\�',1,'2025-02-11 17:12:44.435863','CLOSED','2025-02-11 17:13:01.720837','mgh123rg@gmail.com','스물여덟'),(_binary '~�E�C���s\r���',1,'2025-02-14 16:10:06.900443','ACTIVE','2025-02-14 16:10:06.900443','mgh123rg@gmail.com','새로운 세션으로 가자'),(_binary '~���\�CĢ\�Q?y�I\�',3,'2025-02-11 15:08:24.781650','CLOSED','2025-02-11 15:10:04.222402','mgh123rg@gmail.com','스물아홉'),(_binary '~ʯ�\�PO\0���\n(\�K',3,'2025-02-11 12:48:16.390318','CLOSED','2025-02-11 12:48:58.039837','mgh123rg@gmail.com','서른'),(_binary '~\�\�0�Hǎ�	�,\�',1,'2025-02-14 10:21:11.144064','ACTIVE','2025-02-14 10:21:11.144064','mgh123rg@gmail.com','서른하나'),(_binary '�i*ҍHv�\�\�\�\\�',3,'2025-02-10 17:32:07.875832','ACTIVE','2025-02-10 17:32:07.875832','mgh123rg@gmail.com','서른둘'),(_binary '�K\�<\�&I��тk\�)s�',1,'2025-02-18 17:06:48.848673','ACTIVE','2025-02-18 17:06:49.397353','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '��[QMKÓ0��\'{\�',1,'2025-02-14 13:43:19.967031','ACTIVE','2025-02-14 13:43:19.967031','mgh123rg@gmail.com','서른셋'),(_binary '�t\�Y�\�@7�z�z�Ö',1,'2025-02-14 16:32:33.596987','ACTIVE','2025-02-14 16:32:33.596987','mgh123rg@gmail.com','안녕'),(_binary '�\�x\�d�@����{%\�\�',1,'2025-02-14 16:17:16.608339','ACTIVE','2025-02-14 16:17:16.608339','mgh123rg@gmail.com','이러면 어떤데'),(_binary '�\�\"O\�I�\�Z,D\�n',3,'2025-02-11 13:04:28.765064','CLOSED','2025-02-11 13:04:45.867522','mgh123rg@gmail.com','서른넷'),(_binary '�+�L\Z\�Iȥ>\�\�\�:',4,'2025-02-11 14:20:50.791243','CLOSED','2025-02-11 14:21:43.838282','mgh123rg@gmail.com','서른다섯'),(_binary '����FB��K \�^\�9',3,'2025-02-18 14:26:19.610323','ACTIVE','2025-02-18 14:27:28.730498','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '�>���\nO��i�R�\Zh�',1,'2025-02-17 10:24:18.614132','ACTIVE','2025-02-17 10:24:18.614132','mgh123rg@gmail.com','ㅎㅇ'),(_binary '�H\�\�I�\�E-\��z',1,'2025-02-11 12:23:32.064242','CLOSED','2025-02-11 12:24:59.920828','mgh123rg@gmail.com','서른여섯'),(_binary '�7.�\�E��\�\�:�`\�\�',3,'2025-02-11 14:44:24.054754','CLOSED','2025-02-11 14:46:28.891799','mgh123rg@gmail.com','서른일곱'),(_binary '���\�B\�\�\�?w���',1,'2025-02-18 17:06:58.652470','ACTIVE','2025-02-18 17:06:58.652470','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '�\�U)\�\�I���\�\�G\��',2,'2025-02-17 16:16:58.959987','ACTIVE','2025-02-17 16:16:58.959987','mgh123rg@gmail.com','안녕'),(_binary '��2�\�N�k!탾Q',1,'2025-02-17 09:17:39.090587','ACTIVE','2025-02-17 09:17:39.090587','mgh123rg@gmail.com','하위'),(_binary '�\�\�\�\�D|�on��u\�V',1,'2025-02-17 09:51:34.358251','ACTIVE','2025-02-17 09:51:34.358251','mgh123rg@gmail.com','안녕'),(_binary '�,�\�\�EB�.���Sp',3,'2025-02-11 13:09:29.514047','CLOSED','2025-02-11 13:10:01.340091','mgh123rg@gmail.com','서른여덟'),(_binary '�^ݽ�O�k��˼\�9',1,'2025-02-14 13:36:58.325485','ACTIVE','2025-02-14 13:36:58.325485','mgh123rg@gmail.com','서른아홉'),(_binary '�\��\�Eї\n�ɺb5�',1,'2025-02-17 15:24:26.346978','ACTIVE','2025-02-18 13:06:39.848838','mgh123rg@gmail.com','ㅎㅇ'),(_binary '��\�5-H\�@�\0�\�7',1,'2025-02-17 10:04:36.012910','ACTIVE','2025-02-17 10:04:36.012910','mgh123rg@gmail.com','안녕하세유'),(_binary '�ub\�#A{��\�ѓfk',1,'2025-02-14 13:39:59.710375','ACTIVE','2025-02-14 13:39:59.710375','mgh123rg@gmail.com','마흔'),(_binary '�\�z\��G\"�@\�-�\�',1,'2025-02-17 10:22:04.178824','ACTIVE','2025-02-17 10:22:04.178824','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '�\�%d9\�O�h�s8',1,'2025-02-18 16:47:23.324369','ACTIVE','2025-02-18 16:47:38.683200','mgh123rg@gmail.com','ㅎㅇ'),(_binary '�~��\�JN`��\�\r�LnU',1,'2025-02-14 16:51:50.026173','ACTIVE','2025-02-14 16:51:50.026173','mgh123rg@gmail.com','하이'),(_binary '����UK#��\�\�J0�',1,'2025-02-12 17:11:34.308795','CLOSED','2025-02-12 17:23:55.589929','mgh123rg@gmail.com','마흔하나'),(_binary '�#Ay�@��\�a$��\\�',1,'2025-02-14 16:08:56.815203','ACTIVE','2025-02-14 16:08:56.815203','mgh123rg@gmail.com','음..'),(_binary '�:-��J��端\�\�g',3,'2025-02-18 16:43:24.613702','ACTIVE','2025-02-18 16:43:24.613702','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '�)Ĩ��A�X\�\�_',4,'2025-02-18 14:39:30.800676','ACTIVE','2025-02-18 14:39:30.800676','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '�Āu\�N���Oþp�',1,'2025-02-17 09:54:37.783092','ACTIVE','2025-02-17 09:54:37.783092','mgh123rg@gmail.com','레츠고'),(_binary '�6��5\�G��:!\�/�\�',1,'2025-02-17 10:03:40.657211','ACTIVE','2025-02-17 10:03:40.657211','mgh123rg@gmail.com','하이'),(_binary '�F`�\�HC\�\\}�\�\�',2,'2025-02-14 13:15:03.306907','ACTIVE','2025-02-14 13:15:03.306907','mgh123rg@gmail.com','마흔둘'),(_binary '�\�\�\�\�?Gߎ5_i\�57c',2,'2025-02-18 14:23:06.615477','ACTIVE','2025-02-18 14:23:49.967713','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '�	3FdFy�q�˦��',3,'2025-02-19 14:05:54.091448','CLOSED','2025-02-19 14:26:36.025853','mgh123rg@korea.ac.kr','건강을 위한 경고와 조언'),(_binary '�,�@(\�@h��\�ݰ\"��',3,'2025-02-11 13:30:18.923290','CLOSED','2025-02-11 13:30:41.721861','mgh123rg@gmail.com','마흔셋'),(_binary '�)_�}$J�4o\�\�g{3',1,'2025-02-14 13:04:21.915235','ACTIVE','2025-02-14 13:04:21.915235','mgh123rg@gmail.com','마흔넷'),(_binary '���B�[A^��\�xQ�Zz',1,'2025-02-17 09:05:22.259671','ACTIVE','2025-02-17 09:05:22.259671','mgh123rg@gmail.com','안녕하세요'),(_binary '�\�\��_\�A��\�\�_wָ\�',1,'2025-02-11 11:35:07.634429','CLOSED','2025-02-11 11:37:47.668457','mgh123rg@gmail.com','마흔다섯'),(_binary '��3\Z�N\�1��&�\�x',4,'2025-02-18 14:21:34.705576','ACTIVE','2025-02-18 14:22:41.066487','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '��AY�K��\�y\�f\��g',4,'2025-02-11 14:16:46.711509','CLOSED','2025-02-11 14:17:53.823905','mgh123rg@gmail.com','마흔여섯'),(_binary '��.\�\�EF?�8ݺd­F',3,'2025-02-11 13:01:09.659216','CLOSED','2025-02-11 13:01:15.691402','mgh123rg@gmail.com','마흔일곱'),(_binary '�\�)s`�H�#�\��i%',3,'2025-02-18 16:43:54.297228','ACTIVE','2025-02-18 16:43:54.297228','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '\�7��\��F��\�_ש\�!0',6,'2025-02-18 16:48:29.185618','ACTIVE','2025-02-18 16:48:29.713720','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '\�z>]�F�@l>�\�S',1,'2025-02-17 10:04:21.241596','ACTIVE','2025-02-17 10:04:21.241596','mgh123rg@gmail.com','하이'),(_binary 'ɡ9\�6�D��:��v��',1,'2025-02-17 08:54:17.523507','ACTIVE','2025-02-17 08:54:17.523507','mgh123rg@gmail.com','다시 체크'),(_binary 'ʢ\�\�E��r�h\Z�X	',1,'2025-02-14 14:28:08.592172','ACTIVE','2025-02-14 14:28:08.592172','mgh123rg@gmail.com','마흔여덟'),(_binary '\�Qr��F��b�\���I�',2,'2025-02-17 10:08:06.574447','ACTIVE','2025-02-17 10:08:06.574447','mgh123rg@gmail.com','안녕하세요'),(_binary '\�yIhgA\�1\�X{W;',1,'2025-02-14 13:54:47.214110','ACTIVE','2025-02-14 13:54:47.214110','mgh123rg@gmail.com','마흔아홉'),(_binary '\��\�0H�@\r�K,?�\�\�',1,'2025-02-19 12:23:57.028702','CLOSED','2025-02-19 12:40:27.948849','mgh123rg@gmail.com','ㅎㅇ'),(_binary '\�Yu\n\�\�E5�5\�\\-�~',1,'2025-02-14 13:28:01.549650','ACTIVE','2025-02-14 13:28:01.549650','mgh123rg@gmail.com','쉰'),(_binary 'փ\�eIM�ʨ\�\�65�',1,'2025-02-17 10:29:25.849679','ACTIVE','2025-02-17 10:29:25.849679','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '\�\nL��\�CǉY_�\nd�4',4,'2025-02-18 14:29:22.724957','ACTIVE','2025-02-18 14:39:31.364120','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '\�^��$A⣿�����',1,'2025-02-17 08:56:33.335684','ACTIVE','2025-02-17 08:56:33.335684','mgh123rg@gmail.com','확인해보자'),(_binary '\�\0U�D\�&_�ۤ',1,'2025-02-17 10:27:37.132348','ACTIVE','2025-02-18 13:21:40.554779','mgh123rg@gmail.com','좋아요'),(_binary '\�ԁf\�J$�!3�x�\�U',1,'2025-02-14 11:05:52.658747','CLOSED','2025-02-14 11:23:43.959756','mgh123rg@gmail.com','쉰하나'),(_binary '\�3��\�\�Hx�Dl�}M\�',3,'2025-02-11 13:34:41.874181','CLOSED','2025-02-11 13:43:59.971999','mgh123rg@gmail.com','쉰둘'),(_binary '哓\n�\�D��W�(��',1,'2025-02-14 17:33:49.466737','ACTIVE','2025-02-14 17:33:49.466737','mgh123rg@gmail.com','하위'),(_binary '\�B�\�TJ��@��kM',1,'2025-02-14 13:04:55.014664','ACTIVE','2025-02-14 13:04:55.014664','mgh123rg@gmail.com','쉰셋'),(_binary '\�\�\�\�M\\�\�\�\rnz\�\�',1,'2025-02-14 17:01:35.744613','ACTIVE','2025-02-14 17:01:35.744613','mgh123rg@gmail.com','안녕하세요~'),(_binary '\�\�r}\�\�@ϫX��\�;P',2,'2025-02-14 16:18:21.948255','ACTIVE','2025-02-14 16:18:21.948255','mgh123rg@gmail.com','헬로우~'),(_binary '\�\�wd\�\�E��8��\r=',1,'2025-02-14 13:15:05.592948','ACTIVE','2025-02-14 13:15:05.592948','mgh123rg@gmail.com','쉰넷'),(_binary '\�FԺ\0\�J��T�\�$\�\�',1,'2025-02-13 16:42:07.587668','ACTIVE','2025-02-13 16:42:07.587668','mgh123rg@gmail.com','쉰다섯'),(_binary '\�Y\�\0\�H�w\�\�ۨ�',1,'2025-02-17 08:49:58.666999','ACTIVE','2025-02-17 08:49:58.666999','mgh123rg@gmail.com','안녕~ 여기서도 잘 되는지 보자'),(_binary '\�\�ĂD���\\ެ�\�',1,'2025-02-17 09:51:20.536917','ACTIVE','2025-02-17 09:51:20.536917','mgh123rg@gmail.com','자 해보자'),(_binary '\�=(�dCʖ5���w�',1,'2025-02-17 16:42:39.980631','ACTIVE','2025-02-17 16:42:39.980631','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '\�|�ˇM����8�\�\�',1,'2025-02-13 16:42:07.587668','CLOSED','2025-02-13 18:03:08.587909','mgh123rg@gmail.com','쉰여섯'),(_binary '\�SI�\�F\�\�*Ϡ�-\�',4,'2025-02-18 14:18:57.556492','CLOSED','2025-02-18 14:21:35.261836','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '\�ߵ �A@�	����X',1,'2025-02-14 16:10:07.055955','ACTIVE','2025-02-14 16:10:07.055955','mgh123rg@gmail.com','잘못된 접근'),(_binary '\�\�v��PJ���@\�(�^;',4,'2025-02-11 14:18:58.827466','CLOSED','2025-02-11 14:19:54.133105','mgh123rg@gmail.com','쉰일곱'),(_binary '\�,G	��DQ�oab5�',1,'2025-02-19 12:15:36.347190','CLOSED','2025-02-19 12:16:47.500189','mgh123rg@gmail.com','하이'),(_binary '��k�E\���GA�\�\��',2,'2025-02-18 16:43:29.955296','ACTIVE','2025-02-18 16:43:29.955296','mgh123rg@gmail.com','안녕하세요, 타로 상담을 시작하겠습니다.'),(_binary '�\�ٔ\�\�N<�(Q6�\�T',1,'2025-02-17 10:22:12.034511','ACTIVE','2025-02-17 10:22:12.034511','mgh123rg@gmail.com','오잉'),(_binary '�A�\�j\�Oו\�/|\�Z\�',2,'2025-02-14 16:01:13.373812','ACTIVE','2025-02-14 16:01:13.373812','mgh123rg@gmail.com','나비 하위');
/*!40000 ALTER TABLE `chat_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `content` varchar(1024) COLLATE utf8mb4_general_ci NOT NULL,
  `is_active` bit(1) NOT NULL,
  `user_id` bigint NOT NULL,
  `post_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8kcum44fvpupyw6f5baccx25c` (`user_id`),
  KEY `FKs1slvnkuemjsq2kj4h3vhx7i1` (`post_id`),
  CONSTRAINT `FK8kcum44fvpupyw6f5baccx25c` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKs1slvnkuemjsq2kj4h3vhx7i1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_like`
--

DROP TABLE IF EXISTS `comment_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_like` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `comment_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKo8urnlomri10dub10y8ket23c` (`comment_id`,`user_id`),
  KEY `FK6arwb0j7by23pw04ljdtxq4p5` (`user_id`),
  CONSTRAINT `FK6arwb0j7by23pw04ljdtxq4p5` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKqlv8phl1ibeh0efv4dbn3720p` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_like`
--

LOCK TABLES `comment_like` WRITE;
/*!40000 ALTER TABLE `comment_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diary`
--

DROP TABLE IF EXISTS `diary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diary` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `consult_date` date NOT NULL,
  `summary` text COLLATE utf8mb4_general_ci,
  `tag` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` bigint NOT NULL,
  `card_image_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `tarot_bot_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf0xms46ulxc36096k9gg6j9ip` (`user_id`),
  KEY `FK2nqk4rxywbnt5a6qvp1hd3a8g` (`tarot_bot_id`),
  CONSTRAINT `FK2nqk4rxywbnt5a6qvp1hd3a8g` FOREIGN KEY (`tarot_bot_id`) REFERENCES `tarot_bot` (`id`),
  CONSTRAINT `FKf0xms46ulxc36096k9gg6j9ip` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diary`
--

LOCK TABLES `diary` WRITE;
/*!40000 ALTER TABLE `diary` DISABLE KEYS */;
INSERT INTO `diary` VALUES (1,'2025-02-05','2월 5일의 상담입니다. 이번 상담에서는 취업에 관한 상담을 진행하였습니다.','career','취업 상담',1,'/images/dummy5.png',NULL,NULL,1),(2,'2025-02-03','2월 3일의 상담입니다. 건강에 대해 상담하였습니다.','health','건강운 상담',1,'/images/dummy4.png',NULL,NULL,1),(3,'2025-02-04','2월 4일의 상담입니다. 사랑에 관한 상담을 진행하였습니다.','love','사랑 상담',2,'/images/dummy2.png',NULL,NULL,1),(9,'2025-02-11','프로젝트에 대한 걱정이 있던 사용자에게 타로 점을 봤고, \"마법사\" 카드가 나왔어요. 이 카드는 자신감과 창의적 접근을 강조하며, 모든 자원을 활용해 성공할 수 있음을 나타냅니다. 사용자는 두려움 없이 열정을 쏟아야 한다는 조언을 받았어요. 긍정적인 마음가짐을 유지하며 행동하라는 메시지를 전해주었답니다.','- 프로젝트 운\n- 타로 카드\n- \'The Magician\'','\"프로젝트 운을 점치는 타로 상담\"',2,'/basic/maj1.svg','2025-02-11 14:46:31.573804','2025-02-11 14:46:31.573804',1),(10,'2025-02-11','건강운에 대한 질문에 \'The Hanged Man\' 카드를 뽑으셨습니다. 이 카드는 잠시 멈추고 상황을 바라보아야 할 시기를 의미하며, 현재의 불편함은 일시적일 가능성이 높다고 합니다. 몸과 마음을 재정비하고 주변의 조언을 귀 기울이면서 회복을 위해 필요한 도움을 요청해보세요.','타로, 건강운, The Hanged Man','건강을 위한 재정비',2,'/basic/maj12.svg','2025-02-11 15:10:07.657156','2025-02-11 15:10:07.657156',1),(11,'2025-02-11','대화 도중 사용자가 잘 지내고 있는지 물어보자, 상대방은 현재 세션이 잘 이루어지고 있다고 응답했습니다. 서로의 안부를 나누는 따뜻한 대화가 이어졌습니다.','대화, 안부, 소통','서로의 안부를 묻다',2,'/basic/maj0.svg','2025-02-11 17:13:04.703911','2025-02-11 17:13:04.703911',1),(12,'2025-02-12','사용자는 타로 점을 보고 싶어했고, \'Nine of Wands\' 카드를 뽑았습니다. 이 카드는 인내와 회복을 상징하며, 사용자가 최근 스트레스와 책임감으로 힘든 시간을 겪고 있음을 나타냅니다. 그러나 내부의 강한 힘과 결단력을 기억하며 어려움을 극복할 수 있음을 강조하고, 필요시 주변의 도움을 받는 것도 좋다고 조언합니다.','타로, Nine of Wands, 인내, 회복','인내의 시기, Nine of Wands',2,'/basic/wands9.svg','2025-02-12 12:40:21.800788','2025-02-12 12:40:21.800788',1),(13,'2025-02-12','현재 취업운에 대한 고민을 가진 사용자가 \'Nine of Swords\' 카드를 뽑았습니다. 이 카드는 불안과 걱정을 상징하며, 사용자에게 현재 직무를 유지할지 변경할지에 대한 심리적 압박을 나타냅니다. 사용자는 내면의 소리에 귀 기울이며, 안정감과 도전 사이에서 선택해야 할 시점에 있습니다. 이 카드의 의미를 통해 자신의 감정을 정리하고, 선택의 기로에서 판단할 것을 권장합니다.','타로, 취업운, Nine of Swords','취업운과 내면의 선택',2,'/basic/swords9.svg','2025-02-12 17:23:58.169629','2025-02-12 17:23:58.169629',1),(14,'2025-02-12','타로 점을 보고 싶어하는 사용자는 \'The Sun\' 카드를 뽑았습니다. 이 카드는 긍정적인 에너지를 상징하며, 현재 고민하고 있는 일들이 밝은 방향으로 나아갈 것이라는 메시지를 전달합니다. 사용자는 어떻게 행동해야 할지 고민하고 있으며, 타로 카드로 더 구체적인 해답을 찾고 싶어합니다.','타로, The Sun, 긍정, 미래, 조언','긍정적 미래를 향해',2,'/basic/maj19.svg','2025-02-12 17:27:40.046180','2025-02-12 17:27:40.046180',1),(15,'2025-02-12','타로 점에서 \'Page of Wands\' 카드가 나왔어. 이 카드는 새로운 아이디어와 열정을 상징하며, 개발자로의 도전이 흥미로운 경험과 성장을 가져올 것이라는 메시지를 전해. 현재 직무도 안정감을 줄 수 있지만, 지금은 도전하고 성장할 때라는 신호야. 네 마음속에 있는 열정을 따르는 것이 좋겠어.','타로, 진로, Page of Wands','개발자로의 도전',2,'/basic/wands11.svg','2025-02-12 17:46:45.664552','2025-02-12 17:46:45.664552',1),(16,'2025-02-12','취업에 대한 고민이 깊은 사용자에게 \'은둔자\' 카드가 나왔습니다. 이는 내면의 목소리를 듣고 자신을 돌아보는 시간이 필요하다는 의미입니다. 주변의 조언을 듣고 진정 원하는 것을 파악하는 과정이 중요하다고 합니다. 미래는 선택에 따라 달라질 수 있으니 긍정적인 마음을 유지하길 권장합니다.','타로, 취업운, 은둔자','취업을 위한 내면 탐색',2,'/basic/maj9.svg','2025-02-12 17:50:21.789379','2025-02-12 17:50:21.789379',1),(17,'2025-02-12','취업에 대한 고민이 깊은 사용자에게 \'Eight of Swords\' 카드가 나왔습니다. 이 카드는 스스로의 한계에 갇힌 느낌과 불안함을 상징하며, 현재 상황이 힘들게 느껴지지만 이는 자신이 만든 제한일 수 있습니다. 내면의 목소리에 귀 기울이고, 주변의 도움을 요청하면서 긍정적인 시각으로 미래를 바라보라는 조언을 받았습니다.','타로, 취업운, Eight of Swords','취업운에 대한 통찰',2,'/basic/cups8.svg','2025-02-12 17:58:04.534949','2025-02-12 17:58:04.534949',1),(18,'2025-02-13','사용자가 \'Four of Wands\' 카드를 뽑았고, 이 카드는 안정과 축하를 상징합니다. 최근의 고민을 고려할 때, 사용자는 새로운 시작이나 성취의 기쁨을 느끼고 있으며, 주변 사람들과의 긍정적인 관계가 중요하다는 메시지를 담고 있습니다. 건강과 마음의 균형을 잘 챙기며 앞으로 나아가길 권장합니다.','타로, Four of Wands, 안정, 축하','안정과 축하의 시기',2,'/basic/wands4.svg','2025-02-13 18:03:11.760870','2025-02-13 18:03:11.760870',1),(19,'2025-02-14','타로 점을 통해 \'Six of Cups\'와 \'Eight of Swords\' 카드를 뽑았어요. \'Six of Cups\'는 과거의 소중한 기억과 감정을 회상하라는 메시지로, 이를 통해 현재의 고민을 해결할 수 있다는 걸 나타내요. \'Eight of Swords\'는 스스로의 한계에 갇힌 불안함을 상징하며, 객관적으로 상황을 바라보고 내면의 힘을 믿으라는 조언을 줘요.','타로, 운세, Six of Cups, Eight of Swords','과거를 돌아보며 나아가기',2,'/basic/cups6.svg','2025-02-14 09:51:03.842963','2025-02-14 09:51:03.842963',1),(20,'2025-02-14','타로 점을 보고 Queen of Cups 카드가 나왔습니다. 이 카드는 깊은 감정과 직관, 사랑과 보살핌의 에너지를 상징하며, 최근 감정적인 갈등이나 불안이 있었음을 나타냅니다. 감정을 잘 다스리고 주변에 따뜻한 관심을 기울이라는 메시지를 담고 있으며, 주저하지 말고 도움을 요청하라고 조언합니다. 자신의 감정을 소중히 여기는 것이 고민 해결의 열쇠입니다.','타로, Queen of Cups, 감정, 직관','감정의 깊이를 탐험하기',2,'/basic/cups12.svg','2025-02-14 12:44:46.634281','2025-02-14 12:44:46.634281',1),(21,'2025-02-18','타로 점에서 \'Ten of Swords\' 카드가 나왔어. 이는 고통과 끝을 상징하지만, 새로운 시작의 가능성도 내포하고 있어. 현재 취업에 관한 고민이 클 것으로 보여. 힘든 상황이 지나가면 더 나은 기회가 올 수 있으니 마음을 가다듬고 긍정적인 방향으로 나아가길 바라.','타로, Ten of Swords, 고민, 취업','고통의 끝, 새로운 시작',2,'/basic/swords10.svg','2025-02-18 10:58:53.411385','2025-02-18 10:58:53.411385',1),(22,'2025-02-18','Four of Wands 카드가 나온 것은 안정과 축하의 상징입니다. 최근에 새로운 시작이나 성취의 기쁨을 느끼고 있을 가능성이 높으며, 주변 사람들과의 긍정적인 관계가 중요합니다. 어려운 시간을 겪더라도 함께하는 이들의 지원이 큰 힘이 될 것입니다. 지금은 소중한 순간을 축하하고 주변의 지지에 감사하는 것이 중요합니다.','타로, Four of Wands, 안정, 축하','안정과 축하의 메시지',2,'/basic/cups4.svg','2025-02-18 14:19:41.367483','2025-02-18 14:19:41.370504',1),(23,'2025-02-18','타로 점을 보고 싶어하는 대화에서, 사용자는 \'Page of Pentacles\' 카드를 뽑았다. 이 카드는 새로운 시작이나 학습의 기회를 나타내며, 현실적인 접근이 중요하다는 메시지를 전달한다. 사용자는 현재의 고민을 타로를 통해 해결하고 싶어하며, 이를 통해 어떤 방향으로 나아가야 할지 탐색하고 있다.','타로, Page of Pentacles, 고민','타로 점으로의 초대',2,'/basic/pents1.svg','2025-02-18 18:43:15.208942','2025-02-18 18:43:15.208942',1),(54,'2025-02-19','최근 타로 점을 통해 프로젝트와 취업운, 건강운과 재물운에 관한 상담을 받았다. 특히 마지막에 뽑은 \'The Chariot\' 카드는 강한 의지와 결단력을 통해 긍정적인 재물운을 암시하고 있다. 목표를 설정하고 집중하여 노력하면 원하는 결과를 얻을 수 있을 것이라는 메시지를 담고 있다.','타로, 재물운, The Chariot','재물운의 긍정적 변화',2,'/basic/maj7.svg','2025-02-19 13:38:25.845703','2025-02-19 13:38:25.845703',1),(55,'2025-02-19','사용자가 건강운에 대해 타로 점을 보았고, \'The Devil\' 카드가 나왔습니다. 이 카드는 유혹과 부정적인 영향이 건강에 해를 끼칠 수 있음을 경고합니다. 현재의 나쁜 습관이나 스트레스를 돌아보고, 긍정적인 변화를 위한 작은 시작이 필요함을 강조합니다. 자신을 돌보는 선택이 중요하다고 조언하고 있습니다.','타로, 건강운, The Devil','건강을 위한 선택의 중요성',2,'/basic/maj15.svg','2025-02-19 14:09:35.451071','2025-02-19 14:09:35.451071',3),(56,'2025-02-19','사용자는 건강운에 대한 타로 점을 봤고, \'The Devil\' 카드가 나왔습니다. 이 카드는 유혹과 부정적인 영향을 경고하며, 현재 건강에 해로운 선택이나 나쁜 습관을 돌아보는 것이 중요하다고 전합니다. 스트레스나 불안으로 자신을 압박하는 것이 건강에 악영향을 줄 수 있으니, 감정을 돌보고 긍정적인 변화를 위해 작은 시작이 필요하다고 조언합니다.','타로, 건강운, The Devil','건강을 위한 경고와 조언',4,'/basic/maj15.svg','2025-02-19 14:09:35.944472','2025-02-19 14:09:35.944472',3);
/*!40000 ALTER TABLE `diary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment_count` int NOT NULL,
  `content` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `like_count` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `view_count` int NOT NULL,
  `user_id` bigint NOT NULL,
  `version` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK72mt33dhhs48hf9gcqrq4fxte` (`user_id`),
  CONSTRAINT `FK72mt33dhhs48hf9gcqrq4fxte` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,0,'오늘은 정말 즐거운 하루였어요!','2025-02-05 10:26:13.568443','/images/dummy4.png',_binary '',0,'오늘의 일상','2025-02-05 10:26:13.568443',0,1,NULL),(2,0,'타로 점을 보는 것은 정말 재밌네요!','2025-02-05 11:04:04.123202','/images/dummy1.png',_binary '',0,'오늘의 타로 점','2025-02-05 11:04:04.123202',0,1,NULL);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_like`
--

DROP TABLE IF EXISTS `post_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_like` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `post_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpmmko3h7yonaqhy5gxvnmdeue` (`post_id`,`user_id`),
  KEY `FKhuh7nn7libqf645su27ytx21m` (`user_id`),
  CONSTRAINT `FKhuh7nn7libqf645su27ytx21m` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKj7iy0k7n3d0vkh8o7ibjna884` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_like`
--

LOCK TABLES `post_like` WRITE;
/*!40000 ALTER TABLE `post_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `refresh_token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_f95ixxe7pa48ryn1awmh2evt7` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES (1,'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZ2gxMjNyZ0BnbWFpbC5jb20iLCJpc3MiOiJzc2FmeS5jb20iLCJleHAiOjE3NDExNTE0NzQsImlhdCI6MTczOTk0MTg3NH0.Z8vX40LCh5mUe-GdwbgYBzQ0ZoEP1uS7qVt4kLcnBcecI45duk0MH-g0moUM7yKkjRUCBqmoD5gihBeb745YMQ',2),(2,'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzc2FmeV93ZWJAc3NhZnkuY29tIiwiaXNzIjoic3NhZnkuY29tIiwiZXhwIjoxNzQwNjQ3NDE5LCJpYXQiOjE3Mzk0Mzc4MTl9.a6ATyjLeHmzlqayMIOwLjaa5t26I42YHjcNnlsh7FKe8dyjzUNCSi5LohaPfaZNLPpX7X7uS6Mw4MHvsaDnv6A',1),(3,'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZ2gxMjNyZ0Brb3JlYS5hYy5rciIsImlzcyI6InNzYWZ5LmNvbSIsImV4cCI6MTc0MTE1MTQ4OSwiaWF0IjoxNzM5OTQxODg5fQ.3nfVD0sSVqwOjT5GqxIpaV6ve38CliewmPi2CxnWZ9zFWZFX8-G3FmAJ6OMAuU9sZCTnLnX3y9ltS3PCVv6xmg',4);
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `content` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `rating` int NOT NULL,
  `user_id` bigint NOT NULL,
  `tarotbot_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKiyf57dy48lyiftdrf7y87rnxi` (`user_id`),
  KEY `FKdh4lds6jk1lwmqbmnbe3025se` (`tarotbot_id`),
  CONSTRAINT `FKdh4lds6jk1lwmqbmnbe3025se` FOREIGN KEY (`tarotbot_id`) REFERENCES `tarot_bot` (`id`),
  CONSTRAINT `FKiyf57dy48lyiftdrf7y87rnxi` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `review_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarot_bot`
--

DROP TABLE IF EXISTS `tarot_bot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarot_bot` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `concept` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mbti` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `bot_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarot_bot`
--

LOCK TABLES `tarot_bot` WRITE;
/*!40000 ALTER TABLE `tarot_bot` DISABLE KEYS */;
INSERT INTO `tarot_bot` VALUES (1,'물범','2025-01-23 16:51:27.669845','범달은 15세 남성 물범으로, 북극의 차가운 바다에서 태어났습니다.','ISFJ','범달','/images/dummy1.png','2025-02-04 09:10:58.967871',''),(2,'쿼카','2025-01-23 16:51:37.541562','나비는 16세 여성 쿼카로, 호주 대륙에서 태어나 세계를 방랑하며 운명의 흐름을 탐구합니다.','ISTP','나비','/images/dummy2.png','2025-01-24 09:13:12.503498',''),(3,'북극여우','2025-01-24 09:13:58.083209','루미는 12세 여성 북극여우로, 북극의 신비로운 얼음 동굴에서 태어났습니다.','INFP','루미','/images/dummy3.png','2025-01-24 09:13:58.083209',''),(4,'고양이','2025-01-24 09:14:10.274597','라쿠는 14세 남성 고양이로, 달의 \'꿈의 호수\'에서 태어났습니다.','INTJ','라쿠','/images/lacu.png','2025-01-24 09:14:10.274597',''),(5,'벨로','2025-01-24 09:14:21.581407','벨로는 17세 남성 부엉이로, 천상의 별자리 연구소에서 태어났습니다.','INFJ','벨로','/images/dummy4.png','2025-01-24 09:14:21.581407',''),(6,'제로','2025-02-09 09:14:21.581407','제로는 15세 남성 너구리로, 마법사들이 모이는 마탑 출신의 천재 마법사입니다.','ENTJ','제로','/images/dummy5.png','2025-02-09 09:14:21.581407','');
/*!40000 ALTER TABLE `tarot_bot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarot_card`
--

DROP TABLE IF EXISTS `tarot_card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarot_card` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `card_image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `card_number` int NOT NULL,
  `set_number` int NOT NULL,
  `card_image_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarot_card`
--

LOCK TABLES `tarot_card` WRITE;
/*!40000 ALTER TABLE `tarot_card` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarot_card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarotbot_expertise`
--

DROP TABLE IF EXISTS `tarotbot_expertise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarotbot_expertise` (
  `tarotbot_id` bigint NOT NULL,
  `expertise` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  KEY `FKillggc3go4930wkiagajkiwkb` (`tarotbot_id`),
  CONSTRAINT `FKillggc3go4930wkiagajkiwkb` FOREIGN KEY (`tarotbot_id`) REFERENCES `tarot_bot` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarotbot_expertise`
--

LOCK TABLES `tarotbot_expertise` WRITE;
/*!40000 ALTER TABLE `tarotbot_expertise` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarotbot_expertise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `today_fortune`
--

DROP TABLE IF EXISTS `today_fortune`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `today_fortune` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `card_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `fortune` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `lucky_score` int NOT NULL,
  `tarot_card_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKiak74bo0jqwy08yrqwd9vy9v9` (`tarot_card_id`),
  KEY `FKc72mv4td4kj1l5lf2wb8lx1w6` (`user_id`),
  CONSTRAINT `FKc72mv4td4kj1l5lf2wb8lx1w6` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKiak74bo0jqwy08yrqwd9vy9v9` FOREIGN KEY (`tarot_card_id`) REFERENCES `tarot_card` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `today_fortune`
--

LOCK TABLES `today_fortune` WRITE;
/*!40000 ALTER TABLE `today_fortune` DISABLE KEYS */;
/*!40000 ALTER TABLE `today_fortune` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `social` tinyint(1) NOT NULL DEFAULT '0',
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_a3imlf41l37utmxiquukk8ajc` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'김싸피','$2a$10$FUsTg14hR6l1yT8L6t1APubTEA6GVBGfkU6vJfrJ2aOtIVsJmLovS','ssafy_web@ssafy.com',0,0,NULL,NULL),(2,'민경훈',NULL,'mgh123rg@gmail.com',1,0,NULL,NULL),(3,'김싸피','$2a$10$GLBgOYdnDEUE2uixKMKpDe/kLWn/Jrrczk4XIhmrz6AHEaMkYcRNW','test@me.com',0,0,'2025-02-18 11:06:55.280959','2025-02-18 11:06:55.280959'),(4,'‍민경훈[ 학부졸업 / 화학과 ]',NULL,'mgh123rg@korea.ac.kr',1,0,'2025-02-19 14:05:00.992787','2025-02-19 14:05:00.992787');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profile`
--

DROP TABLE IF EXISTS `user_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profile` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `birth_date` date DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nickname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_tcks72p02h4dp13cbhxne17ad` (`email`),
  UNIQUE KEY `UK_m9ga0crhcge7onj1gx9a5lnjy` (`nickname`),
  UNIQUE KEY `UK_ebc21hy5j7scdvcjt0jy6xxrv` (`user_id`),
  CONSTRAINT `FK6kwj5lk78pnhwor4pgosvb51r` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profile`
--

LOCK TABLES `user_profile` WRITE;
/*!40000 ALTER TABLE `user_profile` DISABLE KEYS */;
INSERT INTO `user_profile` VALUES (1,'2000-11-01','ssafy_web@ssafy.com','Male','MysticUser','/images/dummy1.png',1,NULL,NULL),(2,'1996-01-15','mgh123rg@gmail.com','male','경훈','/images/dummy1.png',2,NULL,NULL),(3,'2000-01-01','test@me.com','Other','임시 닉네임','/images/default_profile.png',3,'2025-02-18 11:06:55.352012','2025-02-18 11:06:55.352012'),(4,'2000-01-01','mgh123rg@korea.ac.kr','male','진이','/images/default_profile.png',4,'2025-02-19 14:05:01.017503','2025-02-19 14:23:49.332833');
/*!40000 ALTER TABLE `user_profile` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-19 14:30:51
