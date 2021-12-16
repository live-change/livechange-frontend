import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router'

import messageAuthRoutes from "./message-auth/router.js"

export function routes(config = {}) {
  const { prefix = '', route = (r) => r } = config
  return [

    ...messageAuthRoutes(config),

    route({ name: 'user:signIn', path: prefix + '/sign-in',
      component: () => import("./SignIn.vue") }),
    route({ name: 'user:signInFinished', path: prefix + '/sign-in-finished',
      component: () => import("./SignInFinished.vue") }),

    route({ name: 'user:signUp', path: prefix + '/sign-up',
      component: () => import("./SignUp.vue") }),
    route({ name: 'user:signUpFinished', path: prefix + '/sign-up-finished',
      component: () => import("./SignUpFinished.vue") }),

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

    route({ name: 'user:connectedAccounts', path: prefix + '/connected-accounts',
      component: () => import("./ConnectedAccounts.vue") }),
    route({ name: 'user:connectAccount', path: prefix + '/connect-account',
      component: () => import("./ConnectAccount.vue") }),
    route({ name: 'user:connectAccountFinished', path: prefix + '/account-connected',
      component: () => import("./ConnectAccountFinished.vue") }),

    route({ name: 'user:deleteAccount', path: prefix + '/delete-account',
      component: () => import("./DeleteAccount.vue") }),
    route({ name: 'user:deleteAccountFinished', path: prefix + '/account-deleted',
      component: () => import("./DeleteAccountFinished.vue") }),
    route({ name: 'user:deleteAccountFeedbackSent', path: prefix + '/account-deleted-feedback-sent',
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
