"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/lang-context"
import { trackEvent } from "@/lib/analytics"

export function CurrencySwitcher() {
  const { currency, setCurrency, currencySymbol, t } = useLanguage()

  const toggle = () => {
    const next = currency === 'cny' ? 'usd' : 'cny'
    trackEvent('currency_toggle', { to: next })
    setCurrency(next)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="flex items-center gap-2 text-sm"
      title={currency === 'cny' ? '切换到 USD' : 'Switch to CNY'}
    >
      <span>{t('currency.switch')}</span>
      <span>{currencySymbol}</span>
    </Button>
  )
}


