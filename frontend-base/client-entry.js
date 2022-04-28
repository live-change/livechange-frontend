import { clientApi } from '@live-change/vue3-ssr/clientApi.js'

import {
  createSharedElementDirective,
  SharedElementRouteGuard
} from 'v-shared-element'

import { createApp } from "./main.js"

export function clientEntry(App, createRouter) {

  window.api = clientApi({
    use: []
  })

  const { app, router } = createApp(api, App, createRouter)

  app.use(createSharedElementDirective())
  router.beforeEach(SharedElementRouteGuard)
  window.process = window.process || null

  // wait until router is ready before mounting to ensure hydration match
  router.isReady().then(() => {
    const instance = app.mount('#app', true)
    app._container._vnode = instance.$.vnode
  })

}