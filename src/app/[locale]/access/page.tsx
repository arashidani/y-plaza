import React from 'react'
import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { generateLocaleParams } from '@/lib/static-params'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { NavitimeLink } from '@/components/access/NavitimeLink'
import { getTranslations } from 'next-intl/server'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

// Node.js Runtime (generateStaticParams使用のため)
export const runtime = 'nodejs'
export const dynamic = 'force-static'
// 24時間キャッシュ
export const revalidate = 86400

interface PageProps {
  params: Promise<{ locale: string }>
}

// バス時刻表データ（路線ごと/行き・帰りで統合）
type FromKey = 'izumo' | 'youPlaza' | 'kounan' | 'nishiIzumo'
const busTimetables = {
  heisei: {
    outbound: {
      from: 'izumo' as FromKey,
      times: ['9:43', '11:00', '15:00', '16:30']
    },
    return: {
      from: 'youPlaza' as FromKey,
      times: ['11:44', '13:18', '15:38', '17:08']
    }
  },
  kounan: {
    outbound: {
      from: 'kounan' as FromKey,
      times: ['8:34', '10:31', '12:34']
    },
    return: {
      from: 'nishiIzumo' as FromKey,
      times: ['8:24', '9:57', '10:16', '12:24']
    }
  }
} as const

// PDFリンクデータ（路線別）
type LineName = keyof typeof busTimetables
const busLinesPdfs: { lineName: LineName; timeTableUrl: string; fareTableUrl: string }[] = [
  {
    lineName: 'heisei',
    timeTableUrl: 'http://www.susanoo.co.jp/image/rosen/heisei_jikoku.pdf',
    fareTableUrl: 'http://www.susanoo.co.jp/image/rosen/heisei_unchin.pdf'
  },
  {
    lineName: 'kounan',
    timeTableUrl: 'http://www.susanoo.co.jp/image/rosen/kounan_jikoku.pdf',
    fareTableUrl: 'http://www.susanoo.co.jp/image/rosen/kounan_unchin.pdf'
  }
]

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { locale } = await params
  const baseURL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.azarashi.work'
  const currentURL = `${baseURL}/${locale}/access`

  return {
    title: '出雲ゆうプラザ アクセスマップ',
    description:
      '出雲ゆうプラザへのアクセス情報と地図を表示しています。住所: 島根県出雲市西新町1丁目2547-2',
    alternates: {
      canonical: currentURL,
      languages: {
        ja: `${baseURL}/ja/access`,
        en: `${baseURL}/en/access`,
        pt: `${baseURL}/pt/access`,
        'x-default': `${baseURL}/access`
      }
    }
  }
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default async function AccessPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('accessPage')

  const getFromLabel = (key: FromKey) => {
    switch (key) {
      case 'izumo':
        return t('izumoDeparture')
      case 'youPlaza':
        return t('youPlazaDeparture')
      case 'kounan':
        return t('kounanDeparture')
      case 'nishiIzumo':
        return t('nishiIzumoDeparture')
    }
  }

  const getTimePdfLabel = (line: LineName) => {
    switch (line) {
      case 'heisei':
        return t('heiseiLineTimeTablePdf')
      case 'kounan':
        return t('kounanLineTimeTablePdf')
    }
  }

  const getFarePdfLabel = (line: LineName) => {
    switch (line) {
      case 'heisei':
        return t('heiseiLineFareTablePdf')
      case 'kounan':
        return t('kounanLineFareTablePdf')
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>

      <div className="space-y-6">
        {/* 施設情報 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('facilityInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-foreground font-medium">
                {t('address')}:
              </span>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(t('addressValue'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary ml-2 underline"
              >
                {t('addressValue')}
              </a>
            </div>
            <div>
              <span className="text-foreground font-medium">{t('tel')}:</span>
              <span className="text-muted-foreground ml-2">0853-30-0707</span>
            </div>
            <div>
              <div className="text-foreground mb-2 font-medium">
                {t('operatingHours')}:
              </div>
              <div className="text-muted-foreground ml-4 space-y-1">
                <p>{t('normalHours')}</p>
                <p>{t('summerHours')}</p>
              </div>
            </div>

            <div>
              <div className="text-foreground mb-2 font-medium">
                {t('closedDays')}:
              </div>
              <div className="text-muted-foreground ml-4 space-y-1">
                <p>{t('closedDaysDetail')}</p>
                <p className="text-xs">{t('summerNote')}</p>
              </div>
            </div>
            <div>
              <div className="text-foreground mb-2 font-medium">
                {t('sliderHours')}:
              </div>
              <div className="text-muted-foreground ml-4 space-y-1">
                <p>{t('sliderNormalHours')}</p>
                <p>{t('sliderSummerHours')}</p>
              </div>
            </div>
            <div>
              <div className="text-foreground mb-2 font-medium">
                {t('attractionDays')}:
              </div>
              <div className="text-muted-foreground ml-4 space-y-1">
                <p>{t('attractionDaysDetail1')}</p>
                <p>{t('attractionDaysDetail2')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 地図 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('map')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full overflow-hidden rounded-md border">
              <iframe
                src="https://www.google.com/maps?q=島根県出雲市西新町1丁目2547-2&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="出雲ゆうプラザの地図"
                className="h-full w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* 電車でのアクセス */}
        <Card>
          <CardHeader>
            <CardTitle>{t('trainAccess')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">{t('trainAccessDetail')}</p>
            <div className="space-y-4">
              <h4 className="text-foreground font-medium">{t('timetable')}:</h4>

              <div className="space-y-3">
                <div>
                  <h5 className="text-foreground mb-2 text-sm font-medium">
                    {t('outbound')}
                  </h5>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button
                      size="sm"
                      asChild
                      className="border-[#006300] bg-[#006300] font-bold text-white hover:border-[#005200] hover:bg-[#005200]"
                    >
                      <NavitimeLink
                        className="text-xs"
                        params={{
                          departure: '00003564',
                          arrival: '00004791',
                          line: '00000067',
                          updown: '1'
                        }}
                      >
                        {t('izumoToNishiIzumo')}
                        <span className="ml-1">↗</span>
                      </NavitimeLink>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="border-[#006300] bg-[#006300] font-bold text-white hover:border-[#005200] hover:bg-[#005200]"
                    >
                      <NavitimeLink
                        className="text-xs"
                        params={{
                          departure: '00007849',
                          arrival: '00004791',
                          line: '00000067',
                          updown: '0'
                        }}
                      >
                        {t('hamadaToNishiIzumo')}
                        <span className="ml-1">↗</span>
                      </NavitimeLink>
                    </Button>
                  </div>
                </div>

                <div>
                  <h5 className="text-foreground mb-2 text-sm font-medium">
                    {t('return')}
                  </h5>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button
                      size="sm"
                      asChild
                      className="border-[#006300] bg-[#006300] font-bold text-white hover:border-[#005200] hover:bg-[#005200]"
                    >
                      <NavitimeLink
                        className="text-xs"
                        params={{
                          departure: '00004791',
                          arrival: '00003564',
                          line: '00000067',
                          updown: '0'
                        }}
                      >
                        {t('nishiIzumoToIzumo')}
                        <span className="ml-1">↗</span>
                      </NavitimeLink>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="border-[#006300] bg-[#006300] font-bold text-white hover:border-[#005200] hover:bg-[#005200]"
                    >
                      <NavitimeLink
                        className="text-xs"
                        params={{
                          departure: '00004791',
                          arrival: '00007849',
                          line: '00000067',
                          updown: '1'
                        }}
                      >
                        {t('nishiIzumoToHamada')}
                        <span className="ml-1">↗</span>
                      </NavitimeLink>
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-xs">
                {t('timetableNote')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* アクセス方法 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('carAccess')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h3 className="text-foreground mb-2 font-medium">
                {t('fromYonago')}
              </h3>
              <div className="text-muted-foreground space-y-1 pl-4">
                <p>{t('fromYonagoRoute1')}</p>
                <p>{t('fromYonagoRoute2')}</p>
              </div>
            </div>

            <div>
              <h3 className="text-foreground mb-2 font-medium">
                {t('fromHamada')}
              </h3>
              <div className="text-muted-foreground space-y-1 pl-4">
                <p>{t('fromHamadaRoute1')}</p>
                <p>{t('fromHamadaRoute2')}</p>
              </div>
            </div>

            <div>
              <h3 className="text-foreground mb-2 font-medium">
                {t('fromHiroshima')}
              </h3>
              <div className="text-muted-foreground space-y-1 pl-4">
                <p>{t('fromHiroshimaRoute1')}</p>
                <p>{t('fromHiroshimaRoute2')}</p>
                <p>{t('fromHiroshimaRoute3')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* バスでのアクセス */}
        <Card>
          <CardHeader>
            <CardTitle>{t('busAccess')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">{t('busAccessDetail')}</p>
            <p className="text-muted-foreground">
              {t('busAccessDetailKounan')}
            </p>

            <div>
              <h4 className="text-foreground mb-3 font-medium">
                {t('busTimetable')}
              </h4>
              <div className="space-y-6">
                <div>
                  <h5 className="text-foreground mb-2 text-sm font-medium">
                    {t('outbound')}
                  </h5>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* 平成温泉線（行き） */}
                    <div className="space-y-2">
                      <h6 className="text-foreground text-sm font-medium">
                        {getFromLabel(busTimetables.heisei.outbound.from)}
                      </h6>
                      <div className="rounded-md border">
                        <Table className="w-full">
                          <TableBody className="divide-border divide-y">
                            {busTimetables.heisei.outbound.times.map((time) => (
                              <TableRow key={time}>
                                <TableCell className="text-center font-medium">
                                  {time}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    {/* 江南線（行き） */}
                    <div className="space-y-2">
                      <h6 className="text-foreground text-sm font-medium">
                        {getFromLabel(busTimetables.kounan.outbound.from)}
                      </h6>
                      <div className="rounded-md border">
                        <Table className="w-full">
                          <TableBody className="divide-border divide-y">
                            {busTimetables.kounan.outbound.times.map((time) => (
                              <TableRow key={time}>
                                <TableCell className="text-center font-medium">
                                  {time}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-foreground mb-2 text-sm font-medium">
                    {t('return')}
                  </h5>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* 平成温泉線（帰り） */}
                    <div className="space-y-2">
                      <h6 className="text-foreground text-sm font-medium">
                        {getFromLabel(busTimetables.heisei.return.from)}
                      </h6>
                      <div className="rounded-md border">
                        <Table className="w-full">
                          <TableBody className="divide-border divide-y">
                            {busTimetables.heisei.return.times.map((time) => (
                              <TableRow key={time}>
                                <TableCell className="text-center font-medium">
                                  {time}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    {/* 江南線（帰り） */}
                    <div className="space-y-2">
                      <h6 className="text-foreground text-sm font-medium">
                        {getFromLabel(busTimetables.kounan.return.from)}
                      </h6>
                      <div className="rounded-md border">
                        <Table className="w-full">
                          <TableBody className="divide-border divide-y">
                            {busTimetables.kounan.return.times.map((time) => (
                              <TableRow key={time}>
                                <TableCell className="text-center font-medium">
                                  {time}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {busLinesPdfs.map((line) => (
                    <div
                      key={line.lineName}
                      className="flex flex-col gap-2 sm:flex-row sm:gap-4"
                    >
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={line.timeTableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs"
                        >
                          {getTimePdfLabel(line.lineName)}
                          <span className="ml-1">↗</span>
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={line.fareTableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs"
                        >
                          {getFarePdfLabel(line.lineName)}
                          <span className="ml-1">↗</span>
                        </a>
                      </Button>
                    </div>
                  ))}
                  <p className="text-muted-foreground text-xs">
                    {t('busNote')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 公式サイトリンク */}
        <Card>
          <CardHeader>
            <CardTitle>{t('detailInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              {t('detailInfoDesc')}
            </p>
            <Button asChild>
              <a
                href="https://y-plaza.sakura.ne.jp/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('officialSite')}
                <span className="ml-1">↗</span>
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
