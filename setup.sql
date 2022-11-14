-- create the databases
CREATE DATABASE IF NOT EXISTS activities;

-- DROP TABLE IF EXISTS `activities`;
-- CREATE TABLE `activities`  (
--   `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
--   `created_at` datetime NOT NULL,
--   `updated_at` datetime NULL DEFAULT NULL,
--   `deleted_at` datetime NULL DEFAULT NULL,
--   `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
--   `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
--   `priority` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
--   PRIMARY KEY (`id`) USING BTREE
-- ) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- DROP TABLE IF EXISTS `todos`;
-- CREATE TABLE `todos`  (
--   `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
--   `created_at` datetime NOT NULL,
--   `updated_at` datetime NULL DEFAULT NULL,
--   `deleted_at` datetime NULL DEFAULT NULL,
--   `activity_group_id` int(100) NULL DEFAULT NULL,
--   `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
--   `is_active` BOOLEAN,
--   `priority` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'very-high',
--   PRIMARY KEY (`id`) USING BTREE
-- ) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- SET FOREIGN_KEY_CHECKS = 1;

-- -- create the users for each database
-- CREATE USER 'localhost'@'%' IDENTIFIED BY 'password';
-- GRANT CREATE, ALTER, INDEX, LOCK TABLES, REFERENCES, UPDATE, DELETE, DROP, SELECT, INSERT ON `activities`.* TO 'localhost'@'%';

-- flush privileges;