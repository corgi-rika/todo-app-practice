// ページ移動のために使います
import { redirect } from 'next/navigation'

// 該当データがない場合に 404 ページを出すために使います
import { notFound } from 'next/navigation'

// サーバー側で Supabase を使うための関数を読み込みます
import { createClient } from '../../../lib/supabase/server'

// さっき作った削除関数を読み込みます
import { deleteTodo } from './actions'

// URL の /todos/abc-123 の「abc-123」部分を受け取るための型です
// docs にあった通り、params は Promise です
type Params = Promise<{ id: string }>

// TODO詳細ページ本体です
export default async function TodoDetailPage({
  // URL の id を受け取ります
  params,
}: {
  // params の型をここで指定します
  params: Params
}) {
  // Supabase クライアントを作ります
  const supabase = await createClient()

  // 今ログインしているユーザーを取得します
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ユーザーがいなければログインページへ移動します
  if (!user) {
    redirect('/login')
  }

  // Promise の params を実際の値に変えます
  const { id } = await params

  // 該当の TODO を1件だけ取得します
  // .eq('id', id) で「この ID の TODO だけ」に絞ります
  // .eq('user_id', user.id) で「自分の TODO だけ」に絞ります
  // .single() で1件だけ取得します
  const { data: todo, error } = await supabase
    .from('todos')
    .select('id, title, content, status, created_at, updated_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  // 取得できなかった場合は 404 ページを表示します
  if (error || !todo) {
    notFound()
  }

  // deleteTodo に todo.id をあらかじめ渡しておきます
  // こうすることで削除ボタンを押したとき、id が自動で渡されます
  const deleteTodoWithId = deleteTodo.bind(null, todo.id)

  // 画面に表示する内容です
  return (
    // ページ全体の余白です
    <main className="p-6">
      {/* ページタイトルです */}
      <h1 className="text-2xl font-bold">TODO詳細</h1>

      {/* 詳細カードです */}
      <div className="mt-4 border rounded p-4 space-y-2">
        {/* タイトルです */}
        <p className="font-semibold text-lg">{todo.title}</p>

        {/* 内容です */}
        <p className="text-sm">{todo.content}</p>

        {/* ステータスです */}
        <p className="text-xs opacity-80">status: {todo.status}</p>

        {/* 作成日時です */}
        <p className="text-xs opacity-80">created_at: {todo.created_at}</p>

        {/* 更新日時です */}
        <p className="text-xs opacity-80">updated_at: {todo.updated_at}</p>
      </div>

      {/* ボタン群です */}
      <div className="mt-4 flex gap-4">
        {/* 一覧ページへ戻るリンクです */}
        <a href="/todos" className="border rounded px-4 py-2 text-sm">
          一覧へ戻る
        </a>

        {/* 編集ページへのリンクです */}
        <a
          href={`/todos/${todo.id}/edit`}
          className="border rounded px-4 py-2 text-sm"
        >
          編集
        </a>

        {/* 削除フォームです */}
        {/* form の action に deleteTodoWithId を渡すことで、ボタンを押したときに削除処理が走ります */}
        <form action={deleteTodoWithId}>
          {/* 削除ボタンです。赤文字にして目立たせています */}
          <button
            type="submit"
            className="border rounded px-4 py-2 text-sm text-red-500"
          >
            削除
          </button>
        </form>
      </div>
    </main>
  )
}