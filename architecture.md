# Pomodoro Timer Webアプリケーション アーキテクチャ案

## 1. 目的

本ドキュメントは、Flask + HTML/CSS/JavaScript で実装する Pomodoro Timer Webアプリのアーキテクチャ方針を定義する。

目標は以下の3点。

- UIモックに沿った画面を安定して実装できること
- 将来の機能追加（統計、設定、通知）に耐えられること
- ユニットテストしやすい構成であること

## 2. 技術スタック

- バックエンド: Flask
- フロントエンド: HTML, CSS, Vanilla JavaScript
- データ永続化: 初期は localStorage、拡張時は SQLite
- テスト:
  - Python: pytest
  - JavaScript: Vitest または Jest

## 3. 全体方針（責務分離）

### 3.1 Flaskの責務

- HTML配信
- JSON API提供（設定、履歴、統計）
- 入力バリデーションとHTTPレスポンス整形

### 3.2 フロントエンドの責務

- タイマー進行（カウントダウン）
- 状態遷移（作業/休憩/一時停止）
- DOM描画更新

### 3.3 分離原則

- 時間計算ロジックとUI描画を分離する
- 状態遷移ロジックを純粋関数として分離する
- 永続化を抽象化し、実装差し替え可能にする

## 4. 推奨ディレクトリ構成

```text
.
├─ architecture.md
├─ README.md
└─ 1.pomodoro/
   ├─ app.py
   ├─ templates/
   │  └─ index.html
   ├─ static/
   │  ├─ css/
   │  │  ├─ base.css
   │  │  └─ components.css
   │  └─ js/
   │     ├─ main.js
   │     ├─ timer-engine.js
   │     ├─ state-machine.js
   │     ├─ api-client.js
   │     └─ storage.js
   └─ tests/
      ├─ test_timer_engine.py
      ├─ test_state_machine.py
      └─ test_api.py
```

## 5. レイヤ設計

### 5.1 Presentation Layer

- `index.html`
- `base.css`, `components.css`
- `main.js`（イベント登録と描画連携）

### 5.2 Application Layer

- `timer-engine.js`: 時間計算コア
- `state-machine.js`: 状態遷移コア
- Python側の Service 層: ユースケース実行

### 5.3 Infrastructure Layer

- `api-client.js`: HTTP通信
- `storage.js`: localStorageの読み書き
- Python側 Repository 実装: SQLite など

## 6. タイマー状態モデル

### 6.1 状態

- `idle`
- `focus`
- `short_break`
- `long_break`
- `paused`

### 6.2 イベント

- `START_FOCUS`
- `PAUSE`
- `RESUME`
- `SKIP`
- `COMPLETE`
- `RESET`

### 6.3 実装ルール

- 残り時間は「終了時刻 `endAt` - 現在時刻」で算出する
- 残秒を毎tickで減算し続ける方式は避ける
- `COMPLETE` は1回だけ発火するガードを入れる

## 7. API設計（初期案）

### 7.1 HTML

- `GET /` : メイン画面

### 7.2 設定

- `GET /api/settings`
- `PUT /api/settings`

設定項目:

- `focusMinutes`
- `shortBreakMinutes`
- `longBreakMinutes`
- `longBreakInterval`

### 7.3 セッション履歴

- `POST /api/sessions/start`
- `POST /api/sessions/complete`
- `GET /api/sessions?date=YYYY-MM-DD`

### 7.4 統計

- `GET /api/stats/today`

返却例:

- 完了セッション数
- 合計集中時間
- 連続達成数

## 8. ユニットテスト容易性を高める追加方針

### 8.1 Clock抽象

- `now()` を直接呼ばない
- `Clock` インターフェースを介して時刻取得する
- テストでは固定時刻Clockを注入する

### 8.2 Repository抽象

- 設定/履歴の保存を `Repository` 経由に統一する
- 本番: SQLite 実装
- テスト: In-memory 実装

### 8.3 Flask Controllerの薄型化

- ルートは「入力検証」「Service呼び出し」「レスポンス変換」のみに限定
- 業務ロジックはService層へ集約

### 8.4 DI（依存性注入）

- Serviceに `Clock`, `Repository`, `Notifier` を注入
- ユニットテストでモック差し替え可能にする

### 8.5 UI分離

- DOM操作と状態遷移ロジックを分離
- `state-machine.js` はDOMを直接触らない

### 8.6 契約テスト

- APIレスポンスのキー/型を契約テスト化する
- フロントとバックエンドの破壊的変更を早期検知する

## 9. テスト戦略

### 9.1 テスト比率

- ユニット: 70%
- サービス層統合: 20%
- E2E: 10%

### 9.2 最小テストセット

- 状態遷移（focus -> short_break / long_break）
- `endAt` 基準での残り時間計算
- 一時停止中に残り時間が減らないこと
- 0秒到達時の `COMPLETE` 単発発火
- 設定APIの正常系/異常系

## 10. 実装ステップ

1. Flaskで画面配信（`GET /`）を作成
2. フロントでタイマー表示と基本操作（開始/停止/リセット）を実装
3. 状態機械を導入してモード遷移を安定化
4. localStorage保存を追加
5. Flask API（設定/履歴/統計）を追加
6. RepositoryをSQLiteへ切り替え
7. ユニットテストと契約テストを整備

## 11. 拡張性

以下の拡張を想定。

- 通知（ブラウザ通知/音声）
- 日次・週次の統計可視化
- 複数プロジェクト対応
- ユーザー認証

上記は、責務分離・抽象化・DIを前提にすれば破壊的な改修なしで追加しやすい。