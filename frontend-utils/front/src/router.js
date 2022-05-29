import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router'


export function routes(config = {}) {
  const { prefix = '/', route = (r) => r } = config
  return [

/*    route({
      name: 'accessControl:testPage', path: prefix + '', meta: { },
      component: () => import("./configuration/AccessControl.vue"),
      props: {
        objectType: 'example_Example',
        object: 'one'
      }
    })*/

  ]
}

export async function sitemap(route, api) {

}

import { client as useClient } from '@live-change/vue3-ssr'

export function createRouter(app, config) {
  //console.log("APP CTX", app._context)
  const client = useClient(app._context)
  const router = _createRouter({
    // use appropriate history implementation for server/client
    // import.meta.env.SSR is injected by Vite.
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: routes(config)
  })
  return router
}

