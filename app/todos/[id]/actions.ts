// このファイルはサーバー側で動く関数を置く場所です
// 'use server' を書くと、この中の関数はサーバーでしか動きません
'use server'

// ページを移動するために使います
import { redirect } from 'next/navigation'

// ページのキャッシュ（一時保存）を消すために使います
// キャッシュを消さないと、削除後も古いデータが表示され続けます
import { revalidatePath } from 'next/cache'

// サーバー側で Supabase を使うための関数を読み込みます
import { createClient } from '../../../lib/supabase/server'

// TODO を削除する関数です
// id には削除したい TODO の ID が入ります
export async function deleteTodo(id: string) {
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

  // todos テーブルから該当の TODO を削除します
  // .eq('id', id) で「この ID の TODO だけ」に絞ります
  // .eq('user_id', user.id) で「自分の TODO だけ」に絞ります
  // この2つを組み合わせることで、他人の TODO は削除できません
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  // 削除に失敗したらエラーを投げます
  if (error) {
    throw new Error('削除に失敗しました')
  }

  // 一覧ページのキャッシュを消します
  // これをしないと、削除後も古い一覧が表示されます
  revalidatePath('/todos')

  // 削除完了後、一覧ページへ移動します
  redirect('/todos')
}