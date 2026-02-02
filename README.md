# Daily News Bot 📰

Claude AIを使った日次ニュース配信ボット

## 機能

- 毎日自動でニュースを取得
- 日本のニュース + IT/テクノロジーニュース
- Telegram/Discordに自動配信
- GitHub Actionsで完全無料運用

## セットアップ

### 1. APIキーの取得

#### Anthropic API Key
1. https://console.anthropic.com/ にアクセス
2. APIキーを作成

#### Telegram Bot (オプション)
1. Telegramで @BotFather を検索
2. `/newbot` コマンドでボットを作成
3. トークンを保存
4. 自分のChat IDを取得: @userinfobot にメッセージを送る

#### Discord Webhook (オプション)
1. Discordサーバーの設定 → 連携サービス
2. ウェブフックを作成
3. Webhook URLをコピー

### 2. GitHub Secretsの設定

リポジトリの Settings → Secrets and variables → Actions で以下を追加:

- `ANTHROPIC_API_KEY`: Claude APIキー (必須)
- `TELEGRAM_BOT_TOKEN`: Telegramボットトークン (オプション)
- `TELEGRAM_CHAT_ID`: TelegramのChat ID (オプション)
- `DISCORD_WEBHOOK_URL`: Discord Webhook URL (オプション)

### 3. ローカルテスト
```bash
# 依存関係をインストール
npm install

# .envファイルを作成
cat > .env << EOF
ANTHROPIC_API_KEY=your_api_key_here
TELEGRAM_BOT_TOKEN=your_telegram_token
TELEGRAM_CHAT_ID=your_chat_id
EOF

# テスト実行
npm test
```

## 配信時刻の変更

`.github/workflows/daily-news.yml` の cron 設定を変更:
```yaml
schedule:
  # 日本時間 12:00 = UTC 3:00
  - cron: '0 3 * * *'
```

## トラブルシューティング

### ニュースが届かない
1. Actions タブでワークフローの実行を確認
2. エラーログをチェック
3. Secretsが正しく設定されているか確認

### APIキーエラー
- Anthropic APIキーの残高を確認
- キーの権限を確認

## ライセンス

MIT
```

#### **`.env.example`**
```
# Anthropic API Key (必須)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Telegram設定 (オプション)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=123456789

# Discord設定 (オプション)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxxx/xxxxx