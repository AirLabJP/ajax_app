-- MySQL初期化スクリプト
-- データベースとユーザーの作成

-- データベースの作成（既にdocker-compose.ymlで作成済み）
-- CREATE DATABASE IF NOT EXISTS ajax_app_development;
-- CREATE DATABASE IF NOT EXISTS ajax_app_test;
-- CREATE DATABASE IF NOT EXISTS ajax_app_production;

-- ユーザーの権限設定（既にdocker-compose.ymlで作成済み）
-- GRANT ALL PRIVILEGES ON ajax_app_development.* TO 'ajax_app'@'%';
-- GRANT ALL PRIVILEGES ON ajax_app_test.* TO 'ajax_app'@'%';
-- GRANT ALL PRIVILEGES ON ajax_app_production.* TO 'ajax_app'@'%';

-- 文字セットの設定
ALTER DATABASE ajax_app_development CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER DATABASE ajax_app_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER DATABASE ajax_app_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- タイムゾーンの設定
SET time_zone = '+00:00';