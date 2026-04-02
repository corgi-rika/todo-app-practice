import { z } from 'zod'

export const TodoStatus = z.enum(['not_started', 'in_progress', 'done'])
export type TodoStatus = z.infer<typeof TodoStatus>

export const TodoSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  title: z.string().min(1).max(50),
  content: z.string().min(1).max(100),
  status: TodoStatus,
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
})

export type Todo = z.infer<typeof TodoSchema>

export const TodoCreateSchema = TodoSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
})

// 作成・編集で共通利用する入力用スキーマ
export const TodoFormSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(50, 'タイトルは50文字以内です'),
  content: z.string().min(1, '内容は必須です').max(100, '内容は100文字以内です'),
  status: TodoStatus,
})


export type TodoCreate = z.infer<typeof TodoCreateSchema>