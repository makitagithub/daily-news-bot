const Anthropic = require('@anthropic-ai/sdk');
const https = require('https');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 日本時間の日付を取得
function getJapanDate() {
  const date = new Date();
  const japanTime = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const year = japanTime.getFullYear();
  const month = String(japanTime.getMonth() + 1).padStart(2, '0');
  const day = String(japanTime.getDate()).padStart(2, '0');
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[japanTime.getDay()];
  
  return `${year}年${month}月${day}日(${weekday})`;
}

async function fetchNews() {
  console.log('🔍 最新ニュースを取得中...');
  
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `今日は${getJapanDate()}です。以下の条件で最新ニュースをまとめてください:

【日常ニュース（就活・ビジネス向け）】
- 日本の経済ニュース：企業業績、市場動向、金融政策、為替、株価など
- 政治・政策ニュース：経済政策、法改正、規制、産業振興策など
- 業界動向：主要業界（製造、IT、金融、小売など）のトレンドや企業の戦略
- 就活生が面接や企業研究で役立つ時事情報を優先
- 事件・事故・芸能ニュースは除外
- 3-4件を厳選

【IT・テクノロジーニュース（技術・知識重視）】
- 最新の技術トレンド：AI/ML、クラウド、セキュリティ、開発ツールなど
- 技術的なブレークスルーや新しいフレームワーク・ライブラリ
- エンジニアリングの実践知識や設計思想
- オープンソースプロジェクトの動向
- 企業の人事ニュースや単なる製品発表は除外し、技術的な詳細や実装方法に焦点
- 3-4件を厳選

【出力形式】
各ニュースは以下の形式で：
- [要約（1-2文）] ([情報源名] - [URL])

以下のフォーマットで出力してください:

📰 **今日のニュース** (${getJapanDate()})

### 🌐 経済・ビジネスニュース（就活向け）
- [ニュース1の要約] ([情報源] - [URL])
- [ニュース2の要約] ([情報源] - [URL])
- [ニュース3の要約] ([情報源] - [URL])

### 💻 IT・テクノロジーニュース（技術重視）
- [ニュース1の要約] ([情報源] - [URL])
- [ニュース2の要約] ([情報源] - [URL])
- [ニュース3の要約] ([情報源] - [URL])

---
📅 次回配信: 明日の同時刻`
      }],
      tools: [{
        type: "web_search_20250305",
        name: "web_search"
      }]
    });

    // メッセージからテキストを抽出
    let newsText = '';
    for (const block of message.content) {
      if (block.type === 'text') {
        newsText += block.text;
      }
    }

    console.log('✅ ニュース取得完了');
    return newsText;
    
  } catch (error) {
    console.error('❌ ニュース取得エラー:', error.message);
    throw error;
  }
}

async function sendToTelegram(text) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.log('⚠️  Telegram設定がありません。スキップします。');
    return;
  }

  console.log('📤 Telegramに送信中...');
  
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const data = JSON.stringify({
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  });

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Telegram送信完了');
          resolve(body);
        } else {
          console.error('❌ Telegram送信失敗:', body);
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Telegram送信エラー:', error.message);
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

async function sendToDiscord(text) {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.log('⚠️  Discord設定がありません。スキップします。');
    return;
  }

  console.log('📤 Discordに送信中...');
  
  const url = process.env.DISCORD_WEBHOOK_URL;
  const data = JSON.stringify({
    content: text,
    username: 'Daily News Bot'
  });

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 204 || res.statusCode === 200) {
          console.log('✅ Discord送信完了');
          resolve(body);
        } else {
          console.error('❌ Discord送信失敗:', body);
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Discord送信エラー:', error.message);
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

async function sendToSlack(text) {
  if (!process.env.SLACK_WEBHOOK_URL) {
    console.log('⚠️  Slack設定がありません。スキップします。');
    return;
  }

  console.log('📤 Slackに送信中...');
  
  const url = process.env.SLACK_WEBHOOK_URL;
  const data = JSON.stringify({
    text: text,
    username: 'Daily News Bot',
    icon_emoji: ':newspaper:'
  });

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Slack送信完了');
          resolve(body);
        } else {
          console.error('❌ Slack送信失敗:', body);
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Slack送信エラー:', error.message);
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🚀 Daily News Bot 起動');
  console.log('📅 日付:', getJapanDate());
  console.log('');

  try {
    // ニュースを取得
    const news = await fetchNews();
    
    console.log('');
    console.log('📰 取得したニュース:');
    console.log('─'.repeat(50));
    console.log(news);
    console.log('─'.repeat(50));
    console.log('');

    // 通知を送信
    const sendPromises = [];
    
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      sendPromises.push(sendToTelegram(news));
    }
    
    if (process.env.DISCORD_WEBHOOK_URL) {
      sendPromises.push(sendToDiscord(news));
    }

    // ★ Slack送信を追加
    if (process.env.SLACK_WEBHOOK_URL) {
      sendPromises.push(sendToSlack(news));
    }

    if (sendPromises.length > 0) {
      await Promise.all(sendPromises);
    } else {
      console.log('⚠️  通知先が設定されていません');
      console.log('💡 Telegram、Discord、または Slack の設定を追加してください');
    }

    console.log('');
    console.log('✨ すべての処理が完了しました！');
    
  } catch (error) {
    console.error('');
    console.error('💥 エラーが発生しました:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// スクリプト実行
main();