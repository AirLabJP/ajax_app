# Ruby 3.2.0の公式イメージを使用
FROM ruby:3.2.0

# 必要なパッケージをインストール
RUN apt-get update -qq && \
    apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    npm \
    default-mysql-client \
    vim \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# GemfileとGemfile.lockをコピー
COPY Gemfile Gemfile.lock ./

# Bundlerをインストール
RUN gem install bundler

# 依存関係をインストール
RUN bundle install

# package.jsonとyarn.lockをコピー
COPY package.json ./

# Node.jsの依存関係をインストール
RUN npm install

# アプリケーションのコードをコピー
COPY . .

# ポート3000を公開
EXPOSE 3000

# アプリケーションを起動
CMD ["rails", "server", "-b", "0.0.0.0"]