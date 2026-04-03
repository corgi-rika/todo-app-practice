// このコンポーネントはクライアント側で動きます
// useFormStatus はクライアントでしか使えないため 'use client' が必要です
'use client'

// フォームの送信状態を取得するために使います
import { useFormStatus } from 'react-dom'

// 保存ボタンコンポーネントです
export function SubmitButton() {
  // pending が true のとき、フォームは送信中です
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      // 送信中はボタンを押せなくします
      disabled={pending}
      // 送信中は半透明にして「押せない」ことを見た目でも伝えます
      className="border rounded px-4 py-2 disabled:opacity-50"
    >
      {/* 送信中は「保存中...」、それ以外は「保存」と表示します */}
      {pending ? '保存中...' : '保存'}
    </button>
  )
}