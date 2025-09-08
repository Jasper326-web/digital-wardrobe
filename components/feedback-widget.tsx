"use client"

import { useEffect, useMemo, useState } from 'react'
import { MessageSquare, Send, X } from 'lucide-react'
import { useLanguage } from '@/lib/lang-context'
import { supabase } from '@/lib/supabase'
import { updates, type UpdateItem } from '@/components/update-announcement'

interface FeedbackPayload {
  message: string
  email?: string
  language: 'zh' | 'en'
  page_url?: string
  user_agent?: string
}

export function FeedbackWidget() {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 排序更新为最新在上
  const sortedUpdates: UpdateItem[] = useMemo(() => {
    return [...updates].sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [])

  useEffect(() => {
    // 悬停打开，离开后延迟关闭的体验
    let closeTimer: number | undefined
    return () => {
      if (closeTimer) window.clearTimeout(closeTimer)
    }
  }, [])

  const submitFeedback = async () => {
    if (!message.trim()) {
      setError(t('feedback.errorEmpty'))
      return
    }
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      const payload: FeedbackPayload = {
        message: message.trim(),
        email: email.trim() || undefined,
        language,
        page_url: typeof window !== 'undefined' ? window.location.href : undefined,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      }
      const { error: insertError } = await supabase.from('feedback').insert(payload)
      if (insertError) throw insertError
      setSuccess(t('feedback.success'))
      setMessage('')
      setEmail('')
    } catch (e: any) {
      setError(t('feedback.errorSubmit'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed right-4 top-1/3 z-50">
      {/* 小按钮 */}
      <div
        className="group"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          aria-label="feedback"
          className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* 展开面板 */}
        <div
          className={`mt-3 w-[340px] max-w-[80vw] bg-white rounded-xl shadow-xl border border-emerald-100 overflow-hidden transform transition-all duration-200 origin-top-right ${
            isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span className="text-sm font-semibold text-emerald-800">{t('feedback.title')}</span>
            </div>
            <button
              className="p-1 rounded hover:bg-emerald-100"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4 text-emerald-700" />
            </button>
          </div>

          {/* 表单 */}
          <div className="px-4 py-3 space-y-3">
            {success && (
              <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded p-2">
                {success}
              </div>
            )}
            {error && (
              <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">
                {error}
              </div>
            )}
            <textarea
              className="w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-sm p-2 resize-y min-h-[80px]"
              placeholder={t('feedback.placeholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input
              className="w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-sm p-2"
              type="email"
              placeholder={t('feedback.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={submitFeedback}
              disabled={submitting}
              className="inline-flex items-center justify-center w-full text-sm font-medium rounded-md bg-emerald-600 text-white py-2 hover:bg-emerald-700 disabled:opacity-60"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? t('feedback.submitting') : t('feedback.submit')}
            </button>
          </div>

          {/* 更新说明 */}
          <div className="px-4 pb-4">
            <div className="text-xs font-semibold text-emerald-900 mb-2">
              {t('feedback.updates')}
            </div>
            <div className="space-y-2 max-h-40 overflow-auto pr-1">
              {sortedUpdates.map(u => (
                <div key={u.id} className="rounded border border-emerald-100 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-900 truncate mr-2">{u.title}</span>
                    <span className="text-[10px] text-gray-500 shrink-0">{u.date}</span>
                  </div>
                  <div className="text-[11px] text-gray-600 mt-1 line-clamp-3">{u.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


