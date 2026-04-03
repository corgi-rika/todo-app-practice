// 未ログイン時にログインページへ移動するために使います
import { redirect } from 'next/navigation'

// Supabase サーバークライアントを作る関数です
import { createClient } from '../../../../lib/supabase/server'

// 更新処理の関数です
import { updateTodo } from './actions'

// ローディング対応の保存ボタンです
import { SubmitButton } from './submit-button'

// URL の /todos/abc-123/edit の abc-123 部分を受け取る型です
// docs にあった通り、params は Promise です
type Params = Promise<{ id: string }>

// searchParams も Promise です
// error の種類を URL から受け取ります
type SearchParams = Promise<{ error?: string | string[] }>

// 配列で来ても1つに絞る関数です
function getSingleValue(value: string | string[] | undefined) {
  // 配列なら最初の値を返します
  if (Array.isArray(value)) return value[0]
  // 配列でなければそのまま返します
  return value
}

// 編集ページ本体です
export default async function TodoEditPage({
  // URL の id を受け取ります
  params,
  // エラー種別を受け取ります
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  // Promise の params を実際の値に変えます
  const { id } = await params

  // Promise の searchParams を実際の値に変えます
  const resolvedSearchParams = await searchParams

  // error の値を1つに絞ります
  const errorType = getSingleValue(resolvedSearchParams.error)

  // Supabase クライアントを作ります
  const supabase = await createClient()

  // ログインユーザーを取得します
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 未ログインならログインページへ移動します
  if (!user) {
    redirect('/login')
  }

  // 編集対象の TODO を1件取得します
  // .eq('user_id', user.id) で自分の TODO だけに絞ります
  // .maybeSingle() はデータがなくてもエラーにしません
  const { data: todo } = await supabase
    .from('todos')
    .select('id, title, content, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  // 対象の TODO が見つからなかった場合の表示です（空状態）
  if (!todo) {
    return (
      // ページ全体の余白です
      <main className="p-6 max-w-xl">
        {/* ページタイトルです */}
        <h1 className="text-2xl font-bold">TODO編集</h1>

        {/* 空状態のメッセージです */}
        <p className="mt-4 text-sm opacity-80">
          対象のTODOが見つかりません。
        </p>

        {/* 一覧へ戻るリンクです */}
        <a
          href="/todos"
          className="mt-4 inline-block border rounded px-4 py-2 text-sm"
        >
          一覧へ戻る
        </a>
      </main>
    )
  }

  return (
    // ページ全体の余白です
    <main className="p-6 max-w-xl">
      {/* ページタイトルです */}
      <h1 className="text-2xl font-bold">TODO編集</h1>

      {/* 対象TODOのIDです */}
      <p className="mt-2 text-sm opacity-80">ID: {todo.id}</p>

      {/* バリデーションエラーのメッセージです */}
      {errorType === 'validation' && (
        <p className="mt-3 text-sm text-red-500">
          入力内容を確認してください。
        </p>
      )}

      {/* DB更新エラーのメッセージです */}
      {errorType === 'update' && (
        <p className="mt-3 text-sm text-red-500">
          更新に失敗しました。もう一度試してください。
        </p>
      )}

      {/* 編集フォームです */}
      {/* action に updateTodo を渡すことで、保存ボタンを押したときに更新処理が走ります */}
      <form action={updateTodo} className="mt-4 space-y-4">
        {/* id を hidden で持たせることで、更新処理に id を渡します */}
        <input type="hidden" name="id" value={todo.id} />

        {/* タイトル入力欄です */}
        <div>
          {/* タイトルのラベルです */}
          <label className="block text-sm font-medium">title</label>

          {/* 既存のタイトルを初期値として表示します */}
          <input
            name="title"
            defaultValue={todo.title}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* 内容入力欄です */}
        <div>
          {/* 内容のラベルです */}
          <label className="block text-sm font-medium">content</label>

          {/* 既存の内容を初期値として表示します */}
          <textarea
            name="content"
            defaultValue={todo.content}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* ステータス選択欄です */}
        <div>
          {/* ステータスのラベルです */}
          <label className="block text-sm font-medium">status</label>

          {/* 既存のステータスを初期値として表示します */}
          <select
            name="status"
            defaultValue={todo.status}
            className="w-full border rounded px-3 py-2"
          >
            {/* 未着手です */}
            <option value="not_started">not_started</option>

            {/* 進行中です */}
            <option value="in_progress">in_progress</option>

            {/* 完了です */}
            <option value="done">done</option>
          </select>
        </div>

        {/* 送信中は「保存中...」と表示するボタンです */}
        <SubmitButton />
      </form>
    </main>
  )
}