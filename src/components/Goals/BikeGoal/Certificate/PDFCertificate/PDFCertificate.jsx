import {
  Page,
  Text,
  Document,
  StyleSheet,
  View,
  Font
} from '@react-pdf/renderer'
import React from 'react'
import CourgetteFont from 'src/assets/fonts/Courgette.ttf'
import LatoFont from 'src/assets/fonts/Lato.ttf'
import PlusJakartaFont from 'src/assets/fonts/PlusJakartaSans.ttf'
import { BackgroundSVG } from 'src/components/Goals/BikeGoal/Certificate/PDFCertificate/BackgroundSVG'
import { CO2CertificateSVG } from 'src/components/Goals/BikeGoal/Certificate/PDFCertificate/CO2CertificateSVG'
import { CozySVG } from 'src/components/Goals/BikeGoal/Certificate/PDFCertificate/CozySVG'

Font.register({
  family: 'Lato',
  src: LatoFont
})
Font.register({
  family: 'Courgette',
  src: CourgetteFont
})
Font.register({
  family: 'PlusJakarta',
  src: PlusJakartaFont
})

const style = StyleSheet.create({
  co2CertificateSVG: { margin: '0 auto 10px' },
  cozySVG: { margin: '0 auto' },
  page: { padding: 8 },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 54,
    left: 40,
    bottom: 50,
    right: 40
  },
  title: {
    whiteSpace: 'pre-line',
    fontFamily: 'PlusJakarta',
    fontSize: 24,
    fontStyle: 'normal',
    textAlign: 'center',
    lineHeight: 1.2
  },
  subTitle: {
    textAlign: 'center',
    color: 'rgba(29, 33, 42, 0.48)',
    marginTop: 20,
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 400
  },
  name: {
    fontFamily: 'Courgette',
    textAlign: 'center',
    color: '#297EF2',
    fontSize: 32,
    fontStyle: 'normal',
    marginTop: 20
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(29, 33, 42, 0.12)',
    margin: '20px 0'
  },
  text: {
    fontFamily: 'Lato',
    textAlign: 'left',
    color: 'rgba(29, 33, 42, 0.90)',
    fontSize: 14,
    fontStyle: 'normal',
    marginTop: 20,
    lineHeight: 1.3
  }
})

export const PDFCertificate = ({
  t,
  username,
  daysToReach,
  sourceName,
  year,
  lang
}) => {
  const currentDate = new Date()
  const currentDateFormatted = currentDate.toLocaleDateString(lang, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const currentTimeFormatted = currentDate
    .toLocaleTimeString(lang, {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })
    .replace(':', 'h')

  return (
    <Document>
      <Page wrap={false} style={style.page}>
        <View>
          <BackgroundSVG />
        </View>
        <View style={style.content}>
          <View>
            <View style={style.co2CertificateSVG}>
              <CO2CertificateSVG />
            </View>
            <Text style={style.title}>{t('PDF.title')}</Text>
            <Text style={style.subTitle}>
              {t('PDF.date', { currentDateFormatted, currentTimeFormatted })}
            </Text>
            <Text style={style.name}>{username}</Text>
            <View style={style.divider}></View>
            <Text style={style.text}>{t('PDF.recipient', { sourceName })}</Text>
            <Text style={style.text}>
              {t('PDF.date', { currentDateFormatted, currentTimeFormatted })}
            </Text>
            <Text style={style.text}>
              {t('PDF.paragraph01', { username, daysToReach, year })}
            </Text>
            <Text style={style.text}>{t('PDF.paragraph02')}</Text>
            <Text style={style.text}>{t('PDF.paragraph03')}</Text>
            <Text style={style.text}>{t('PDF.signature', { username })}</Text>
          </View>
          <View style={style.cozySVG}>
            <CozySVG />
          </View>
        </View>
      </Page>
    </Document>
  )
}
