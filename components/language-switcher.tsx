'use client'

import { useLanguage } from '@/lib/lang-context'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-sm"
      title={t('language.switch')}
    >
      <Globe className="h-4 w-4" />
      <span>{language === 'zh' ? 'EN' : '中'}</span>
    </Button>
  )
}
