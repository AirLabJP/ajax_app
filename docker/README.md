# Docker実行環境

このプロジェクトはDockerを使用してRailsアプリケーションを実行するための環境を提供します。

## 構成

- **Rails 7.0** (Ruby 3.2.0)
- **MySQL 8.0** (データベース)
- **Redis 7** (キャッシュ・セッション管理)
- **Node.js** (フロントエンド資産のビルド)

## セットアップ手順

### 1. 前提条件

- Docker
- Docker Compose

### 2. 環境の起動

```bash
# コンテナをビルドして起動
docker-compose up --build

# バックグラウンドで起動
docker-compose up -d --build
```

### 3. 初回セットアップ

初回起動時は以下のコマンドでデータベースをセットアップします：

```bash
# データベースの作成とマイグレーション
docker-compose exec web rails db:create
docker-compose exec web rails db:migrate
docker-compose exec web rails db:seed
```

### 4. アプリケーションへのアクセス

- **Rails アプリケーション**: http://localhost:3000
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

## よく使用するコマンド

### コンテナの管理

```bash
# コンテナの起動
docker-compose up

# コンテナの停止
docker-compose down

# コンテナの再起動
docker-compose restart

# ログの確認
docker-compose logs -f web
```

### Rails コマンドの実行

```bash
# Rails コンソール
docker-compose exec web rails console

# データベースマイグレーション
docker-compose exec web rails db:migrate

# テストの実行
docker-compose exec web rails test

# ジェネレーターの実行
docker-compose exec web rails generate model User name:string
```

### データベースの管理

```bash
# MySQL に接続
docker-compose exec db mysql -u ajax_app -p ajax_app_development

# データベースのリセット
docker-compose exec web rails db:drop db:create db:migrate db:seed
```

## トラブルシューティング

### ポートが既に使用されている場合

`docker-compose.yml`のポート設定を変更してください：

```yaml
ports:
  - "3001:3000"  # 3000番ポートが使用されている場合
```

### データベース接続エラー

1. MySQLコンテナが起動しているか確認：
   ```bash
   docker-compose ps
   ```

2. データベースのログを確認：
   ```bash
   docker-compose logs db
   ```

### ボリュームのリセット

データベースを完全にリセットしたい場合：

```bash
# コンテナとボリュームを削除
docker-compose down -v

# 再起動
docker-compose up --build
```

## 開発時の注意点

- コードの変更は自動的に反映されます（ホットリロード）
- `node_modules`はボリュームマウントから除外されています
- ログファイルは`log/`ディレクトリに保存されます
- データベースのデータは永続化されます（`mysql_data`ボリューム）

## 本番環境へのデプロイ

本番環境では以下の点に注意してください：

1. 環境変数の適切な設定
2. セキュリティキーの設定
3. データベースのバックアップ戦略
4. ログの管理
5. リソース制限の設定