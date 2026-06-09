# Pomodoro Timer 実装機能一覧

このドキュメントは、Pomodoro Timer アプリケーションの実装対象機能を整理したものです。

## 1. MVP（最小実装）で必須の機能

### 1.1 タイマー基本操作
- 開始
- 一時停止
- 再開
- リセット
- スキップ

### 1.2 タイマー表示と進行
- 残り時間のリアルタイム表示
- 現在モード表示（focus / short_break / long_break / paused / idle）
- 終了時刻（endAt）ベースでの残り時間算出
- 0秒到達時の COMPLETE イベントを単発発火

### 1.3 状態遷移制御
- 状態モデル管理（idle, focus, short_break, long_break, paused）
- イベント処理（START_FOCUS, PAUSE, RESUME, SKIP, COMPLETE, RESET）
- 長休憩の挿入ルール（longBreakInterval）

### 1.4 画面機能
- メイン画面表示（GET /）
- 操作ボタンの有効・無効制御
- 状態に応じた表示更新

### 1.5 設定機能
- 集中時間（focusMinutes）
- 短休憩時間（shortBreakMinutes）
- 長休憩時間（longBreakMinutes）
- 長休憩間隔（longBreakInterval）
- 設定値の入力バリデーション

### 1.6 永続化（初期）
- localStorage による設定保存/読込
- 必要に応じた進行状態の保存方針
- 再読み込み時の復元方針

### 1.7 バックエンド最小API
- GET /（HTML配信）
- GET /api/settings
- PUT /api/settings

### 1.8 エラーハンドリング
- API異常時のユーザー通知
- 不正入力時のエラーメッセージ表示
- 異常系レスポンスの形式統一

## 2. MVP後に追加する拡張機能

### 2.1 セッション履歴
- POST /api/sessions/start
- POST /api/sessions/complete
- GET /api/sessions?date=YYYY-MM-DD

### 2.2 統計
- GET /api/stats/today
- 当日の完了セッション数
- 合計集中時間
- 連続達成数

### 2.3 通知
- ブラウザ通知
- 音通知
- 通知ON/OFF設定

### 2.4 データ基盤拡張
- localStorage から SQLite への移行
- Repository 抽象による保存先差し替え

## 3. 品質確保のための実装対象

### 3.1 テスト
- タイマー計算ユニットテスト
- 状態遷移ユニットテスト
- 設定APIの正常系/異常系テスト
- APIレスポンスの契約テスト

### 3.2 設計上の実装ポイント
- Clock 抽象（時刻取得を注入可能にする）
- Flask Controller の薄型化（入力検証・Service呼び出し・レスポンス変換に限定）
- DOM操作と状態遷移ロジックの分離
- DI（Clock, Repository, Notifier の差し替え可能化）
