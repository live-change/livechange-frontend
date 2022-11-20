import { clientApi } from '@live-change/vue3-ssr/clientApi.js'

import {
  createSharedElementDirective,
  SharedElementRouteGuard
} from 'v-shared-element'

import { createApp } from "./main.js"

export async function clientEntry(App, createRouter, config = {}) {

  const windowId = window.__WINDOW_ID__
  console.error("CLIENT WINDOW ID", windowId)

  window.api = clientApi({
    use: [],
    windowId
  })

  const host = document.location.host
  const url = document.location.pathname + document.location.search
  const { app, router } = await createApp(
    config, api, App, createRouter, host, null, null, url
  )

  app.use(createSharedElementDirective())
  router.beforeEach(SharedElementRouteGuard)
  window.process = window.process || null

  // wait until router is ready before mounting to ensure hydration match
  router.isReady().then(() => {
    const instance = app.mount('#app', true)
    app._container._vnode = instance.$.vnode
  })

}
