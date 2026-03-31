import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getSession()

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Supabase接続確認</h1>
      <p className="mt-2">
        {error ? 'NG: 初期化エラー' : 'OK: Supabaseクライアント初期化成功'}
      </p>
      <pre className="mt-4 text-sm">
        {JSON.stringify({ hasSession: !!data.session }, null, 2)}
      </pre>
    </main>
  )
}