import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router'

import messageAuthRoutes from "./message-auth/router.js"
import signRoutes from "./sign/router.js"

export function routes(config = {}) {
  const { prefix = '', route = (r) => r } = config
  return [

    ...messageAuthRoutes(config),
    ...signRoutes(config),


    route({ name: 'user:resetPassword', path: prefix + '/reset-password',
      component: () => import("./ResetPassword.vue") }),
    route({ name: 'user:resetPasswordForm', path: prefix + '/set-new-password',
      component: () => import("./ResetPasswordForm.vue") }),
    route({ name: 'user:resetPasswordFinished', path: prefix + '/reset-password-finished',
      component: () => import("./ResetPasswordFinished.vue") }),

    route({ name: 'user:changePassword', path: prefix + '/change-password',
      component: () => import("./ChangePassword.vue") }),
    route({ name: 'user:changePasswordFinished', path: prefix + '/change-password-finished',
      component: () => import("./ChangePassword.vue") }),

    route({ name: 'user:connected', path: prefix + '/connected',
      component: () => import("./Connected.vue") }),
    route({ name: 'user:connect', path: prefix + '/connect',
      component: () => import("./Connect.vue") }),
    route({ name: 'user:connectFinished', path: prefix + '/connect-finished',
      component: () => import("./ConnectFinished.vue") }),

    route({ name: 'user:delete', path: prefix + '/delete-account',
      component: () => import("./DeleteAccount.vue") }),
    route({ name: 'user:deleteFinished', path: prefix + '/account-deleted',
      component: () => import("./DeleteAccountFinished.vue") }),
    route({ name: 'user:deleteFeedbackSent', path: prefix + '/account-deleted-feedback-sent',
      component: () => import("./DeleteAccountFeedbackSent.vue") }),

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
