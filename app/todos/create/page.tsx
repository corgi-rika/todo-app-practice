'use client'

import { useState } from 'react'
import { TodoFormSchema, type TodoStatus } from '@/types/todo'

type FieldErrors = {
  title?: string
  content?: string
  status?: string
}

export default function TodoCreatePage() {
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSubmit = (formData: FormData) => {
    const input = {
      title: String(formData.get('title') ?? ''),
      content: String(formData.get('content') ?? ''),
      status: String(formData.get('status') ?? 'not_started') as TodoStatus,
    }

    const result = TodoFormSchema.safeParse(input)

    if (!result.success) {
      const nextErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if (key === 'title' || key === 'content' || key === 'status') {
          nextErrors[key] = issue.message
        }
      }
      setErrors(nextErrors)
      return
    }

    setErrors({})
    alert('バリデーションOK（作成処理は次で実装）')
  }

  return (
    <main className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold">TODO作成</h1>

      <form action={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">title</label>
          <input name="title" className="w-full border rounded px-3 py-2" />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">content</label>
          <textarea name="content" className="w-full border rounded px-3 py-2" />
          {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">status</label>
          <select name="status" defaultValue="not_started" className="w-full border rounded px-3 py-2">
            <option value="not_started">not_started</option>
            <option value="in_progress">in_progress</option>
            <option value="done">done</option>
          </select>
          {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}
        </div>

        <button type="submit" className="border rounded px-4 py-2">
          作成
        </button>
      </form>
    </main>
  )
}