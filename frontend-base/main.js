import { createSSRApp } from 'vue'
import { createMetaManager } from 'vue-meta'

import { registerComponents } from '@live-change/vue3-components'
import ReactiveDaoVue from '@live-change/dao-vue3'

import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import { PrimeVueConfirmSymbol } from 'primevue/useconfirm'
import ToastService from 'primevue/toastservice'
import { PrimeVueToastSymbol } from 'primevue/usetoast'
import DialogService from 'primevue/dialogservice'
import { PrimeVueDialogSymbol } from 'primevue/usedialog'
import StyleClass from 'primevue/styleclass'
import Ripple from 'primevue/ripple'
import BadgeDirective from 'primevue/badgedirective'
import VueLazyLoad from 'vue3-lazyload'

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp(api, App, createRouter, host, response) {
  const isSSR = response !== undefined
  const app = createSSRApp(App)
  app.config.devtools = true

  app.config.globalProperties.$response = response
  app.config.globalProperties.$host = host

  api.installInstanceProperties(app.config.globalProperties)

  registerComponents(app)
  app.use(ReactiveDaoVue, { dao: api })

  const router = createRouter(app)
  app.use(router)

  app.use(PrimeVue, {
    ripple: true
  })

  app.use(ConfirmationService)
  app.provide(PrimeVueConfirmSymbol, app.config.globalProperties.$confirm)

  app.use(ToastService)
  app.provide(PrimeVueToastSymbol, app.config.globalProperties.$toast)

  app.use(DialogService)
  app.provide(PrimeVueDialogSymbol, app.config.globalProperties.$dialog)

  const oldCommand = api.command
  api.command = async (...args) => {
    console.log("API COMMAND!")
    try {
      return await oldCommand.apply(api, args)
    } catch(error) {
      const text = error.message || error
      const toast = app.config.globalProperties.$toast
      if(text == 'notAuthorized')  toast.add({ severity:'error', summary: "Not Authorized", life: 5000 })
      throw error
    }
  }

  app.directive('styleclass', StyleClass)
  app.directive('ripple', Ripple)
  app.directive('badge', BadgeDirective)

  app.use(VueLazyLoad, {
    // options...
  })

  const meta = createMetaManager({
    isSSR
  })
  app.use(meta)

  return { app, router }
}
