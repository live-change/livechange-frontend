import { analytics } from "@live-change/vue3-components"
import gtag, { install as gtagInstall } from "ga-gtag"

import * as fbq from './fbq.js'

gtagInstall('G-SECPFC3K6V', { 'send_page_view': false })
fbq.init('1925367877664900')

analytics.on('*', (type, e) => console.log('ANALYTICS EVENT', type, e) )

analytics.on('formDone', ({ service, action }) => {
  if(service == 'contactForm' && action == 'sendContactFormMail') {
    setTimeout(() => {
      gtag('event', 'contactFormSent', {
        'event_category': 'contactForm'
      })
      gtag('event', 'conversion', {'send_to': 'AW-10863738295/ZkSlCNSAkqcDELf7nbwo'})
    }, 23)
    setTimeout(() => {
      fbq.track('Contact', {
        fn: parameters.firstName,
        ln: parameters.lastName,
        ph: parameters.phone,
        em: parameters.from
      }, { autoConfig: false })
    }, 23)
  }
})

analytics.on('menuOpen', e => {

})

analytics.on('pageView', ({ to, fullPath }) => {
  setTimeout(() => {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: `${document.location.protocol}//${document.location.host}${fullPath}`,
      page_path: to
    })
  }, 23)
  setTimeout(() => {
    fbq.track('PageView', {}, { autoConfig: false })
  }, 23)
})
