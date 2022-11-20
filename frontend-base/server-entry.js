import { renderToString } from 'vue/server-renderer'
import { renderMetaToString } from 'vue-meta/ssr'

import { serverApi } from '@live-change/vue3-ssr/serverApi.js'

import { createApp } from "./main.js"

function escapeHtml(unsafe) {
  return (''+unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

export function serverEntry(App, createRouter, config = {}) {
  return async function({ url, headers, dao, windowId }) {
    const host = headers['host']
    console.error('URL', host, url)
    const api = await serverApi(dao, {
      use: [],
      windowId
    })

    const response = {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      }
    }

    const { app, router } = await createApp(
      config, api, App, createRouter, host, headers, response, url
    )

    app.directive('shared-element', {})

    // set the router to the desired URL before rendering
    router.push(url)
    await router.isReady()

    // prefetch data
    await api.preFetchRoute(router.currentRoute, router)

    // passing SSR context object which will be available via useSSRContext()
    // @vitejs/plugin-vue injects code into a component's setup() that registers
    // itself on ctx.modules. After the render, ctx.modules would contain all the
    // components that have been instantiated during this render call.
    const ctx = {}
    const html = await renderToString(app, ctx)
    await renderMetaToString(app, ctx)

    const data = api.prerenderCache.cacheData()

    // the SSR manifest generated by Vite contains module -> chunk/asset mapping
    // which we can then use to determine what files need to be preloaded for this
    // request.

    const metaManager = app.config.globalProperties.$metaManager
    const activeMeta = metaManager.target.context.active
    console.log("ACTIVE META", activeMeta)
    ctx.teleports.head = [
      ...(activeMeta.title ? [`<title data-vm-ssr="true">${escapeHtml(activeMeta.title)}</title>`] : []),
      ...((activeMeta.meta || []).map(meta => `<meta ${Object.keys(meta).map(
        key => `${escapeHtml(key)}="${escapeHtml(meta[key])}"`
      ).join(' ')}>`)),
      ...((activeMeta.link || []).map(meta => `<link ${Object.keys(meta).map(
        key => `${escapeHtml(key)}="${escapeHtml(meta[key])}"`
      ).join(' ')}>`))
    ].join('\n')

    return {html, data, meta: ctx.teleports, modules: ctx.modules, response}
  }
}
