'use client'

import { useActionState } from 'react'
import { createTodo, type CreateTodoState } from './actions'

const initialState: CreateTodoState = {}

export default function TodoCreatePage() {
  const [state, formAction, pending] = useActionState(createTodo, initialState)

  return (
    <main className="p-6 min-h-screen w-full bg-white text-black">
      <h1 className="text-2xl font-bold">TODO作成</h1>

      <form action={formAction} className="mt-4 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            title
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={50}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black caret-black"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            content
          </label>
          <textarea
            id="content"
            name="content"
            required
            maxLength={100}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black caret-black"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            status
          </label>
          <select
            id="status"
            name="status"
            defaultValue="not_started"
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
          >
            <option value="not_started">not_started</option>
            <option value="in_progress">in_progress</option>
            <option value="done">done</option>
          </select>
        </div>

        {state.message && (
          <p className="text-sm text-red-600" aria-live="polite">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="border rounded px-4 py-2"
        >
          {pending ? '作成中...' : '作成'}
        </button>
      </form>
    </main>
  )
}