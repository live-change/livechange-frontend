import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router'

import { dbAdminRoutes } from "@live-change/db-admin"

export function wysiwygRoutes(config = {}) {
  const { prefix = '/', route = (r) => r } = config
  return [

    route({
      name: 'urls:examplePage', path: prefix + '',
      component: () => import("./UrlsPage.vue"),
      props: {
        targetType: 'example_Example',
        target: 'one'
      },
      meta: {
        wide: true
      }
    }),

    ...dbAdminRoutes({ prefix: '/_db', route: r => ({ ...r, meta: { ...r.meta, raw: true }}) })

  ]
}

export async function sitemap(route, api) {

}


export function createRouter(app, config) {
  const router = _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: wysiwygRoutes(config)
  })
  return router
}

