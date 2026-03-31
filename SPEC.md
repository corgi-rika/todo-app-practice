# TODO App 仕様書

## 技術スタック
- Next.js 16.2.1（App Router）
- TypeScript
- Supabase（DB + Auth）
- Tailwind CSS

## 画面構成
- /todos（一覧）
- /todos/create（作成）
- /todos/[id]（詳細）
- /todos/[id]/edit（編集）

## DBスキーマ
### todos テーブル
| カラム | 型 | 制約 |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | FK → auth.users |
| title | varchar(50) | NOT NULL |
| content | varchar(100) | NOT NULL |
| status | text | not_started / in_progress / done |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

## 認証・認可
- ログイン必須（未ログインは /login へ）
- RLS: user_id = auth.uid() のみ操作可能

## バリデーション
- title: 50文字以内、必須
- content: 100文字以内、必須
- status: not_started / in_progress / done のいずれか

## 完了条件
- CRUD全操作できる
- 自分のTODOのみ操作可能
- フィルター（ステータス別）
- ソート（作成日/更新日）
- ローディング/エラー/空状態の表示