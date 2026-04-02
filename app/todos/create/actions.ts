'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type CreateTodoState = {
  message?: string
}

const VALID_STATUS = ['not_started', 'in_progress', 'done'] as const
type TodoStatus = (typeof VALID_STATUS)[number]

export async function createTodo(
  _prevState: CreateTodoState,
  formData: FormData,
): Promise<CreateTodoState> {
  const title = String(formData.get('title') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()
  const statusRaw = String(formData.get('status') ?? '').trim()

  if (!title) return { message: 'titleは必須です' }
  if (title.length > 50) return { message: 'titleは50文字以内です' }
  if (!content) return { message: 'contentは必須です' }
  if (content.length > 100) return { message: 'contentは100文字以内です' }
  if (!VALID_STATUS.includes(statusRaw as TodoStatus)) {
    return { message: 'statusが不正です' }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { message: 'ログインが必要です' }
  }

  const { error: insertError } = await supabase.from('todos').insert({
    title,
    content,
    status: statusRaw as TodoStatus,
    user_id: user.id,
  })

  if (insertError) {
    return { message: 'TODOの作成に失敗しました' }
  }

  revalidatePath('/todos')
  redirect('/todos')
}