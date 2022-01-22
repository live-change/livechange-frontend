import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router'

import messageAuthRoutes from "./message-auth/routes.js"
import signRoutes from "./sign/routes.js"
import connectedRoutes from "./connected/routes.js"
import deleteRoutes from "./delete/routes.js"
import { passwordResetRoutes, passwordChangeRoutes } from "./password/routes.js"
import { notificationsSettingsRoutes, notificationsRoutes } from "./notifications/routes.js"

export function routes(config = {}) {
  const { prefix = '/', route = (r) => r } = config
  return [

    ...messageAuthRoutes(config),
    ...signRoutes(config),
    ...passwordResetRoutes(config),

    route({
      path: prefix + 'settings', meta: { pageType: 'wide' },
      component: () => import("./settings/Settings.vue"),
      children: [
        {
          name: 'user:settings', path: '', meta: { viewType: 'wide', signedIn: true },
          component: () => import("./settings/SettingsIndex.vue")
        },
        ...deleteRoutes({ ...config, prefix: '' }),
        ...passwordChangeRoutes({ ...config, prefix: '' }),
        ...connectedRoutes({ ...config, prefix: '' }),
        ...notificationsSettingsRoutes({ ...config, prefix: '' })
      ]
    }),

  ]
}

export async function sitemap(route, api) {
  route({ name: 'SignIn' })
  route({ name: 'SignUp' })
}

import { client as useClient } from '@live-change/vue3-ssr'

export function createRouter(app, config) {
  console.log("APP CTX", app._context)
  const client = useClient(app._context)
  const router = _createRouter({
    // use appropriate history implementation for server/client
    // import.meta.env.SSR is injected by Vite.
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: routes(config)
  })
  router.beforeEach(async (to, from) => {
    if(to?.matched.find(m => m?.meta.signedIn)) {
      if(!client.value.user) {
        console.log("REDIRECT TO LOGIN BECAUSE PAGE REQUIRES LOGIN!")
        router.redirectAfterSignIn = to.fullPath
        return { name: 'user:signIn' }
      }
    }
    if(to?.matched.find(m => m?.meta.signedOut)) {
      if(client.value.user) {
        console.log("REDIRECT TO USER INDEX BECAUSE PAGE REQUIRES LOGOUT!")
        return { name: 'user:settings' }
      }
    }
    if(to && to.name == 'user:signIn' && from?.matched.find(m => m?.meta.saveForSignIn)) {
      console.log("SAVE FOR LOGIN", from.fullPath)
      localStorage.redirectAfterLogin = from.fullPath
    }
  })
  return router
}

