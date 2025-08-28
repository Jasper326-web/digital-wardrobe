"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/lang-context"

export function CurrencySwitcher() {
  const { currency, setCurrency, currencySymbol, t } = useLanguage()

  const toggle = () => setCurrency(currency === 'cny' ? 'usd' : 'cny')

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


