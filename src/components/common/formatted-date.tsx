import dayjs from 'dayjs'
import useGlobalContext from '@/hooks/use-context'

import 'dayjs/locale/en'
import 'dayjs/locale/de'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/it'
import 'dayjs/locale/ja'
import 'dayjs/locale/ro'
import 'dayjs/locale/ar'
import 'dayjs/locale/hi'
import 'dayjs/locale/pt'
import 'dayjs/locale/ru'
import 'dayjs/locale/tr'
import 'dayjs/locale/zh'
import 'dayjs/locale/hu'
import 'dayjs/locale/pl'
import 'dayjs/locale/uk'

export const FormattedDate = (props: { date: Date, format: string }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage

  const { date, format } = props
  return dayjs(date!).locale(currentLanguage).format(format)
}