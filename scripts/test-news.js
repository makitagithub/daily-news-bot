// ローカルでテストするためのスクリプト
require('dotenv').config();
const { execSync } = require('child_process');

console.log('🧪 テストモード: ニュース取得をテストします\n');

// 環境変数のチェック
const requiredVars = ['ANTHROPIC_API_KEY'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ 必要な環境変数が設定されていません:');
  missingVars.forEach(v => console.error(`   - ${v}`));
  console.error('\n.env ファイルを作成してAPIキーを設定してください');
  process.exit(1);
}

console.log('✅ 環境変数チェック完了\n');

// fetch-news.js を実行
try {
  execSync('node scripts/fetch-news.js', { stdio: 'inherit' });
} catch (error) {
  console.error('\n❌ テスト失敗');
  process.exit(1);
}