import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router'

import messageAuthRoutes from "./message-auth/router.js"
import signRoutes from "./sign/router.js"
import connectedRoutes from "./connected/router.js"
import deleteRoutes from "./delete/router.js"
import passwordRoutes from "./password/router.js"

export function routes(config = {}) {
  const { prefix = '', route = (r) => r } = config
  return [

    ...messageAuthRoutes(config),
    ...signRoutes(config),
    ...connectedRoutes(config),
    ...deleteRoutes(config),
    ...passwordRoutes(config)

  ]
}

export async function sitemap(route, api) {
  route({ name: 'SignIn' })
  route({ name: 'SignUp' })
}

export function createRouter(config) {
  const router = _createRouter({
    // use appropriate history implementation for server/client
    // import.meta.env.SSR is injected by Vite.
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: routes(config)
  })
  return router
}
