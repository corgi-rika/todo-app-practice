// このファイルの関数はサーバーで実行します
'use server'

// 更新後にページ遷移するために使います
import { redirect } from 'next/navigation'

// ページのキャッシュを更新するために使います
import { revalidatePath } from 'next/cache'

// Supabase のサーバークライアントを作る関数です
import { createClient } from '../../../../lib/supabase/server'

// 入力値をチェックするスキーマです
import { TodoFormSchema } from '../../../../types/todo'

// TODO を更新する関数です
// form の action に渡すので、引数は FormData です
export async function updateTodo(formData: FormData) {
  // フォームから id を取り出します
  const id = String(formData.get('id') ?? '')

  // フォームから各入力値を取り出します
  const input = {
    title: String(formData.get('title') ?? ''),
    content: String(formData.get('content') ?? ''),
    status: String(formData.get('status') ?? 'not_started'),
  }

  // 入力値を Zod でチェックします
  const parsed = TodoFormSchema.safeParse(input)

  // バリデーションエラーなら編集画面へ戻します
  if (!parsed.success) {
    redirect(`/todos/${id}/edit?error=validation`)
  }

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

  // todos テーブルを更新します
  // .eq('id', id) で「この ID の TODO だけ」に絞ります
  // .eq('user_id', user.id) で「自分の TODO だけ」に絞ります
  const { error } = await supabase
    .from('todos')
    .update({
      title: parsed.data.title,
      content: parsed.data.content,
      status: parsed.data.status,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  // DB エラーなら編集画面へ戻します
  if (error) {
    redirect(`/todos/${id}/edit?error=update`)
  }

  // 一覧と詳細のキャッシュを更新します
  revalidatePath('/todos')
  revalidatePath(`/todos/${id}`)

  // 更新後は詳細ページへ移動します
  redirect(`/todos/${id}`)
}