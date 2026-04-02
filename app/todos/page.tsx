import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

export default async function TodosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: todos, error } = await supabase
    .from('todos')
    .select('id, title, content, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">TODO一覧ページ</h1>
      <p className="mt-2 text-sm opacity-80">ログイン済みユーザーだけ見える想定です。</p>

      {error && (
        <p className="mt-4 text-sm text-red-500" aria-live="polite">
          一覧の取得に失敗しました
        </p>
      )}

      {!error && (!todos || todos.length === 0) && (
        <p className="mt-4 text-sm opacity-80">TODOはまだありません</p>
      )}

      {!error && todos && todos.length > 0 && (
        <ul className="mt-4 space-y-3">
          {todos.map((todo) => (
            <li key={todo.id} className="border rounded p-3">
              <p className="font-semibold">{todo.title}</p>
              <p className="text-sm mt-1">{todo.content}</p>
              <p className="text-xs mt-2 opacity-80">status: {todo.status}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}