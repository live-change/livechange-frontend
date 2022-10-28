import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router'

import { dbAdminRoutes } from "@live-change/db-admin"
import {userRoutes} from "@live-change/user-frontend";

export function wysiwygRoutes(config = {}) {
  const { prefix = '/', route = (r) => r } = config
  return [
    ...userRoutes({ ...config, prefix: prefix + 'user/' }),

    route({
      name: 'index', path: prefix, meta: { },
      component: () => import("./Index.vue")
    }),

    ...dbAdminRoutes({ prefix: '/_db', route: r => ({ ...r, meta: { ...r.meta, raw: true }}) }),
    //...catchAllPagesRoute({ ...config }) // todo: add when ready
  ]
}

export async function sitemap(route, api) {
  await pagesSitemap(route, api)
}


export function createRouter(app, config) {
  const router = _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: wysiwygRoutes(config)
  })
  return router
}

