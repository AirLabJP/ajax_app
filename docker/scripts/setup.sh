#!/bin/bash

# Docker環境セットアップスクリプト

echo "🚀 Docker環境をセットアップしています..."

# コンテナをビルドして起動
echo "📦 コンテナをビルドしています..."
docker-compose build

echo "🔄 コンテナを起動しています..."
docker-compose up -d

# データベースの準備を待つ
echo "⏳ データベースの準備を待っています..."
sleep 10

# データベースのセットアップ
echo "🗄️ データベースをセットアップしています..."
docker-compose exec -T web rails db:create
docker-compose exec -T web rails db:migrate
docker-compose exec -T web rails db:seed

echo "✅ セットアップが完了しました！"
echo "🌐 アプリケーション: http://localhost:3000"
echo "📊 データベース: localhost:3306"
echo "🔴 Redis: localhost:6379"
echo ""
echo "📝 よく使用するコマンド:"
echo "  - ログ確認: docker-compose logs -f web"
echo "  - Rails コンソール: docker-compose exec web rails console"
echo "  - コンテナ停止: docker-compose down"