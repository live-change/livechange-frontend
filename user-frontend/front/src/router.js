import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router'

import messageAuthRoutes from "./message-auth/router.js"
import signRoutes from "./sign/router.js"
import connectedRoutes from "./connected/router.js"
import deleteRoutes from "./delete/router.js"

export function routes(config = {}) {
  const { prefix = '', route = (r) => r } = config
  return [

    ...messageAuthRoutes(config),
    ...signRoutes(config),
    ...connectedRoutes(config),
    ...deleteRoutes(config),

    route({ name: 'user:resetPassword', path: prefix + '/reset-password',
      component: () => import("./ResetPassword.vue") }),
    route({ name: 'user:resetPasswordForm', path: prefix + '/set-new-password',
      component: () => import("./ResetPasswordForm.vue") }),
    route({ name: 'user:resetPasswordFinished', path: prefix + '/reset-password-finished',
      component: () => import("./ResetPasswordFinished.vue") }),

    route({ name: 'user:changePassword', path: prefix + '/change-password',
      component: () => import("./ChangePassword.vue") }),
    route({ name: 'user:changePasswordFinished', path: prefix + '/change-password-finished',
      component: () => import("./ChangePasswordFinished.vue") })

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
