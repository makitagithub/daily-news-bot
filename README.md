# Daily News Bot 📰

GitHub Actionsを使った完全無料の日次ニュース配信ボット

**特徴:**
- ☁️ **完全クラウド実行** - PCを起動する必要なし
- 🆓 **完全無料** - GitHub Actionsの無料枠内で運用
- 🤖 **Claude AI搭載** - 最新ニュースを自動要約
- 📱 **Slack通知** - スマホでいつでも確認可能
- 🎯 **カスタマイズ可能** - 就活・技術学習に最適化

## 🚀 仕組み
```
GitHub Actions (クラウド)
    ↓
毎日自動実行 (日本時間 8:00)
    ↓
Claude APIでニュース取得・要約
    ↓
Slack/Discord/Telegramに通知
```

**PCは一切不要！** GitHub Actions がクラウド上で自動実行します。

## 📋 配信内容

### 🌐 経済・ビジネスニュース（就活向け）
- 企業業績・市場動向
- 金融政策・経済政策
- 業界トレンド・M&A
- 就活に役立つ時事情報

### 💻 IT・テクノロジーニュース（技術重視）
- AI/機械学習の新技術
- プログラミング言語・フレームワーク
- クラウド・セキュリティ技術
- オープンソースプロジェクト

## 🛠️ セットアップ

### 1️⃣ リポジトリをフォーク/クローン
```bash
git clone https://github.com/makitagithub/daily-news-bot.git
cd daily-news-bot
```

### 2️⃣ 必要なAPIキー・Webhookを取得

#### Anthropic API Key (必須)
1. [Anthropic Console](https://console.anthropic.com/) にアクセス
2. API Keysから新しいキーを作成
3. `sk-ant-api03-xxxxx...` をコピー

#### Slack Webhook URL (推奨)
1. [Slack API](https://api.slack.com/apps) にアクセス
2. **Create New App** → **From scratch**
3. App Name: `Daily News Bot`
4. **Incoming Webhooks** を有効化
5. **Add New Webhook to Workspace**
6. 通知先チャンネルを選択
7. Webhook URLをコピー

<details>
<summary><b>その他の通知先（オプション）</b></summary>

#### Telegram
1. @BotFather で `/newbot` を実行
2. ボットトークンを取得
3. @userinfobot で自分のChat IDを取得

#### Discord
1. サーバー設定 → 連携サービス
2. ウェブフックを作成
3. Webhook URLをコピー

</details>

### 3️⃣ GitHub Secretsに登録

リポジトリの **Settings** → **Secrets and variables** → **Actions** で以下を追加:

| Secret名 | 説明 | 必須 |
|---------|------|------|
| `ANTHROPIC_API_KEY` | Claude APIキー | ✅ 必須 |
| `SLACK_WEBHOOK_URL` | Slack Webhook URL | 推奨 |
| `TELEGRAM_BOT_TOKEN` | Telegramボットトークン | オプション |
| `TELEGRAM_CHAT_ID` | Telegram Chat ID | オプション |
| `DISCORD_WEBHOOK_URL` | Discord Webhook URL | オプション |

### 4️⃣ テスト実行

1. リポジトリの **Actions** タブを開く
2. **Daily News Briefing** を選択
3. **Run workflow** をクリック
4. 2-3分待つとSlack/通知先にニュースが届く

## ⏰ 配信時刻の変更

`.github/workflows/daily-news.yml` を編集:
```yaml
on:
  schedule:
    # 日本時間 8:00 = UTC 23:00 (前日)
    - cron: '0 23 * * *'
```

### よく使う時刻設定

| 日本時間 | cron設定 |
|---------|---------|
| 7:00 | `0 22 * * *` |
| 8:00 | `0 23 * * *` |
| 12:00 | `0 3 * * *` |
| 20:00 | `0 11 * * *` |

複数設定も可能:
```yaml
schedule:
  - cron: '0 23 * * *'  # 朝8時
  - cron: '0 11 * * *'  # 夜8時
```

## 🎨 ニュース内容のカスタマイズ

`scripts/fetch-news.js` のプロンプトを編集することで、取得するニュースの種類をカスタマイズできます。

### 例: 特定業界に特化
```javascript
【経済・ビジネスニュース】
- IT業界の動向（SaaS、クラウド、AI企業）
- スタートアップの資金調達
- テック企業の株価・決算
```

### 例: 研究者向け
```javascript
【学術・研究ニュース】
- 最新の論文・研究成果
- 学会発表・カンファレンス情報
- 研究助成金・公募情報
```

## 📊 コスト

| サービス | 料金 |
|---------|------|
| GitHub Actions | **無料** (Public リポジトリは無制限) |
| Claude API | 1回 約$0.01-0.02 (月$0.30程度) |
| **合計** | **月$0.30程度** |

## 🔧 トラブルシューティング

### ニュースが届かない

1. **Actions** タブで実行履歴を確認
2. エラーログをチェック
3. GitHub Secretsが正しく設定されているか確認

### APIキーエラー
```
Error: 401 Unauthorized
```

- Anthropic APIキーの残高を確認
- キーが正しくコピーされているか確認

### Slack通知が届かない

- Webhook URLが正しいか確認
- Slackチャンネルの権限を確認

### 実行されない（cron）

- GitHub Actionsは最大15分程度遅延することがあります
- リポジトリに最近のアクティビティがない場合、初回実行が遅れることがあります

## 📁 プロジェクト構成
```
daily-news-bot/
├── .github/
│   └── workflows/
│       └── daily-news.yml      # GitHub Actions設定
├── scripts/
│   ├── fetch-news.js           # ニュース取得メインスクリプト
│   └── test-news.js            # ローカルテスト用
├── .gitignore
├── package.json
└── README.md
```

## 🔒 セキュリティ

- ✅ APIキーは全てGitHub Secretsで暗号化保存
- ✅ コードに秘密情報を含めない
- ✅ Public リポジトリでも安全に運用可能

## 🚀 応用例

このボットをベースに、以下のような機能を追加できます：

- 📈 **株価・為替レート通知**
- 🏢 **特定企業のニュース監視**
- 📚 **論文・技術記事の要約配信**
- 🌐 **多言語ニュース対応**
- 📊 **週次/月次レポート生成**

## 🤝 コントリビューション

プルリクエスト歓迎！以下のような改善案をお待ちしています：

- 新しい通知先の追加（LINE、Teams等）
- ニュースソースの拡充
- UI/UXの改善
- ドキュメントの充実

## 📜 ライセンス

MIT License

## 🙏 謝辞

- [Anthropic Claude](https://www.anthropic.com/) - AIによるニュース要約
- [GitHub Actions](https://github.com/features/actions) - 自動実行基盤

---

## 💡 よくある質問

<details>
<summary><b>PCを起動していなくても動きますか？</b></summary>

はい！GitHub Actionsはクラウド上で動作するため、PCの状態に関係なく毎日自動実行されます。

</details>

<details>
<summary><b>料金はかかりますか？</b></summary>

GitHub Actionsは無料、Claude APIは月$0.30程度です。ほぼ無料で運用できます。

</details>

<details>
<summary><b>ニュースの内容を変更できますか？</b></summary>

はい！`scripts/fetch-news.js`のプロンプトを編集することで自由にカスタマイズできます。

</details>

<details>
<summary><b>複数人で使えますか？</b></summary>

はい！Slackの場合は複数チャンネルに通知可能です。または、各自がリポジトリをフォークして個別に設定できます。

</details>

<details>
<summary><b>他の言語のニュースも取得できますか？</b></summary>

はい！プロンプトを変更することで英語や他の言語のニュースも取得できます。

</details>

---

**作成者:** [@makitagithub](https://github.com/makitagithub)

**⭐ このプロジェクトが役に立ったら、ぜひスターをお願いします！**