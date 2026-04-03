// このファイルの関数はサーバーで実行します
'use server'

// ログアウト後にログインページへ移動するために使います
import { redirect } from 'next/navigation'

// Supabase サーバークライアントを作る関数です
import { createClient } from '../../lib/supabase/server'

// ログアウト処理です
export async function logout() {
  // Supabase クライアントを作ります
  const supabase = await createClient()

  // Supabase のセッションを削除してログアウトします
  await supabase.auth.signOut()

  // ログインページへ移動します
  redirect('/login')
}