// 未ログイン時に /login へ移動するために使います
import { redirect } from 'next/navigation'

// サーバー側で Supabase を使うための関数を読み込みます
import { createClient } from '../../lib/supabase/server'

// URLの ?status=...&sort=...&order=... を受け取るための型です
type SearchParams = Promise<{
  // ステータス絞り込み用です
  status?: string | string[]

  // 並び替え項目です
  sort?: string | string[]

  // 昇順・降順です
  order?: string | string[]
}>

// ステータスで許可する値の一覧です
const STATUS_OPTIONS = ['all', 'not_started', 'in_progress', 'done'] as const

// 並び替えで許可する値の一覧です
const SORT_OPTIONS = ['created_at', 'updated_at'] as const

// 順序で許可する値の一覧です
const ORDER_OPTIONS = ['desc', 'asc'] as const

// URLパラメータが配列で来ても、先頭の1件だけ使うための関数です
function getSingleValue(value: string | string[] | undefined) {
  // 配列なら最初の値を返します
  if (Array.isArray(value)) {
    return value[0]
  }

  // 配列でなければそのまま返します
  return value
}

// TODO一覧ページ本体です
export default async function TodosPage({
  // URLの検索条件を受け取ります
  searchParams,
}: {
  // searchParams の型をここで指定します
  searchParams: SearchParams
}) {
  // Supabaseクライアントを作ります
  const supabase = await createClient()

  // 今ログインしているユーザーを取得します
  const {
    // data の中の user を取り出します
    data: { user },
  } = await supabase.auth.getUser()

  // ユーザーがいなければログインページへ移動します
  if (!user) {
    redirect('/login')
  }

  // Promise の searchParams を実際の値に変えます
  const resolvedSearchParams = await searchParams

  // status の生の値を取り出し、なければ all にします
  const rawStatus = getSingleValue(resolvedSearchParams.status) ?? 'all'

  // sort の生の値を取り出し、なければ created_at にします
  const rawSort = getSingleValue(resolvedSearchParams.sort) ?? 'created_at'

  // order の生の値を取り出し、なければ desc にします
  const rawOrder = getSingleValue(resolvedSearchParams.order) ?? 'desc'

  // status が許可された値なら使い、違えば all に戻します
  const status = STATUS_OPTIONS.includes(
    rawStatus as (typeof STATUS_OPTIONS)[number]
  )
    ? rawStatus
    : 'all'

  // sort が許可された値なら使い、違えば created_at に戻します
  const sort = SORT_OPTIONS.includes(rawSort as (typeof SORT_OPTIONS)[number])
    ? rawSort
    : 'created_at'

  // order が許可された値なら使い、違えば desc に戻します
  const order = ORDER_OPTIONS.includes(rawOrder as (typeof ORDER_OPTIONS)[number])
    ? rawOrder
    : 'desc'

  // まずは「このユーザーの todos を取る」ための基本クエリを作ります
  let query = supabase
    // todos テーブルを使います
    .from('todos')
    // 一覧表示に必要な列を取得します
    .select('id, title, content, status, created_at, updated_at')
    // ログイン中のユーザーのデータだけに絞ります
    .eq('user_id', user.id)

  // status が all でなければ、ステータスでさらに絞り込みます
  if (status !== 'all') {
    query = query.eq('status', status)
  }

  // 最後に並び替えをつけて、実際にデータを取得します
  const { data: todos, error } = await query.order(sort, {
    // asc なら昇順、そうでなければ降順にします
    ascending: order === 'asc',
  })

  // 画面に表示する内容です
  return (
    // ページ全体の余白です
    <main className="p-6">
      {/* ページタイトルです */}
      <h1 className="text-2xl font-bold">TODO一覧ページ</h1>

      {/* 補足文です */}
      <p className="mt-2 text-sm opacity-80">
        ログイン済みユーザーだけ見える想定です。
      </p>

      {/* 絞り込み・並び替え用のフォームです */}
      <form method="GET" className="mt-4 space-y-4 border rounded p-4">
        {/* ステータス選択のまとまりです */}
        <div>
          {/* status 用のラベルです */}
          <label htmlFor="status" className="block text-sm font-medium">
            ステータス
          </label>

          {/* status を選ぶプルダウンです */}
          <select
            // ラベルと関連付ける id です
            id="status"
            // URLに入るキー名です
            name="status"
            // 今選ばれている値を表示します
            defaultValue={status}
            // 見た目のクラスです
            className="mt-1 w-full border rounded px-3 py-2"
          >
            {/* 絞り込みなしです */}
            <option value="all">all</option>

            {/* 未着手だけに絞ります */}
            <option value="not_started">not_started</option>

            {/* 進行中だけに絞ります */}
            <option value="in_progress">in_progress</option>

            {/* 完了だけに絞ります */}
            <option value="done">done</option>
          </select>
        </div>

        {/* 並び替え項目のまとまりです */}
        <div>
          {/* sort 用のラベルです */}
          <label htmlFor="sort" className="block text-sm font-medium">
            並び替え項目
          </label>

          {/* 並び替え項目を選ぶプルダウンです */}
          <select
            // ラベルと関連付ける id です
            id="sort"
            // URLに入るキー名です
            name="sort"
            // 今選ばれている値を表示します
            defaultValue={sort}
            // 見た目のクラスです
            className="mt-1 w-full border rounded px-3 py-2"
          >
            {/* 作成日で並び替えます */}
            <option value="created_at">created_at</option>

            {/* 更新日で並び替えます */}
            <option value="updated_at">updated_at</option>
          </select>
        </div>

        {/* 昇順・降順のまとまりです */}
        <div>
          {/* order 用のラベルです */}
          <label htmlFor="order" className="block text-sm font-medium">
            並び順
          </label>

          {/* 並び順を選ぶプルダウンです */}
          <select
            // ラベルと関連付ける id です
            id="order"
            // URLに入るキー名です
            name="order"
            // 今選ばれている値を表示します
            defaultValue={order}
            // 見た目のクラスです
            className="mt-1 w-full border rounded px-3 py-2"
          >
            {/* 新しい順などに使う降順です */}
            <option value="desc">desc</option>

            {/* 古い順などに使う昇順です */}
            <option value="asc">asc</option>
          </select>
        </div>

        {/* フォーム送信ボタンです */}
        <button type="submit" className="border rounded px-4 py-2">
          適用
        </button>
      </form>

      {/* 取得エラー時の表示です */}
      {error && (
        <p className="mt-4 text-sm text-red-500" aria-live="polite">
          一覧の取得に失敗しました
        </p>
      )}

      {/* データが0件のときの表示です */}
      {!error && (!todos || todos.length === 0) && (
        <p className="mt-4 text-sm opacity-80">TODOはまだありません</p>
      )}

      {/* データがあるときの一覧表示です */}
      {!error && todos && todos.length > 0 && (
        <ul className="mt-4 space-y-3">
          {/* TODOを1件ずつ表示します */}
          {todos.map((todo) => (
            <li key={todo.id} className="border rounded p-3">
              {/* タイトルです */}
              <p className="font-semibold">{todo.title}</p>

              {/* 内容です */}
              <p className="text-sm mt-1">{todo.content}</p>

              {/* ステータスです */}
              <p className="text-xs mt-2 opacity-80">status: {todo.status}</p>

              {/* 作成日時です */}
              <p className="text-xs opacity-80">
                created_at: {todo.created_at}
              </p>

              {/* 更新日時です */}
              <p className="text-xs opacity-80">
                updated_at: {todo.updated_at}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}