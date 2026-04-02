'use server'

// ログイン後に別ページへ移動するために使う
import { redirect } from 'next/navigation'
// サーバー側でSupabaseを使うためのクライアント
import { createClient } from '@/lib/supabase/server'

// フォーム送信後に画面へ返すエラー情報の型
export type LoginState = {
  message?: string
}

// ログイン処理本体
// prevState: 直前の画面状態
// formData: フォームから送られてきた値（email, password）
export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // Supabaseクライアントを作る
  const supabase = await createClient()

  // フォームから email と password を取り出す
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  // Supabase にメールとパスワードでログインを試みる
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // ログイン失敗ならエラーメッセージを返す
  if (error) {
    return {
      message: 'メールアドレスまたはパスワードが正しくありません',
    }
  }

  // ログイン成功したら /todos へ移動する
  redirect('/todos')
}