import { useTranslations } from 'next-intl'
import type { Category, Tariff, MembershipDuration } from './types'

export function useCategoryLabel(): Record<Category, string> {
  const t = useTranslations('poolCalculator.category')
  return {
    adult: t('adult'),
    senior: t('senior'),
    student: t('student'),
    preschool3plus: t('preschool3plus'),
    under2: t('under2'),
    companion_student_adult: t('companion_student_adult'),
    companion_senior_adult: t('companion_senior_adult'),
  }
}

export function useTariffLabel(): Record<Tariff, string> {
  const t = useTranslations('poolCalculator.tariff')
  return {
    season_9_6: t('season_9_6'),
    season_7_8: t('season_7_8'),
    evening: t('evening'),
    group: t('group'),
  }
}

export function useDurationLabel(): Record<MembershipDuration, string> {
  const t = useTranslations('poolCalculator.duration')
  return {
    '30d': t('30d'),
    '6m': t('6m'),
    '1y': t('1y'),
  }
}