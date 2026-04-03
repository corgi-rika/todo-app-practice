import { redirect } from 'next/navigation'
import { createClient } from '../lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ログイン済みなら一覧、未ログインならログインへ
  redirect(user ? '/todos' : '/login')
}