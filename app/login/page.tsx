'use client'

// Server Action の結果を画面で受け取るために使う
import { useActionState } from 'react'
// ログイン処理本体と、その返り値の型を使う
import { login, type LoginState } from './actions'

// フォーム初期状態
const initialState: LoginState = {}

export default function LoginPage() {
  // state: サーバーから返ってきたエラーメッセージ
  // formAction: form の action に渡す送信先
  // pending: 送信中かどうか
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <main className="relative z-[9999] pointer-events-auto p-6 max-w-sm bg-white text-black">
      <h1 className="text-2xl font-bold">ログイン</h1>

      {/* 送信すると actions.ts の login が実行される */}
      <form action={formAction} className="mt-4 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border rounded px-3 py-2 bg-white text-black caret-black"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border rounded px-3 py-2 bg-white text-black caret-black"
          />
        </div>

        {/* ログイン失敗時のエラーメッセージ */}
        {state.message && (
          <p aria-live="polite" className="text-red-600 text-sm">
            {state.message}
          </p>
        )}

        {/* 送信中はボタンを無効化して連打を防ぐ */}
        <button
          type="submit"
          disabled={pending}
          className="border rounded px-4 py-2 w-full"
        >
          {pending ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </main>
  )
}