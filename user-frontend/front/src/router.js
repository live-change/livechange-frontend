import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router'

export function routes(config = {}) {
  const { prefix = '', route = (r) => r } = config
  return [
    route({ name: 'user:signIn', path: prefix + '/sign-in',
      component: () => import("./SignIn.vue") }),
    route({ name: 'user:signUp', path: prefix + '/sign-up',
      component: () => import("./SignUp.vue") }),
    route({ name: 'user:resetPassword', path: prefix + '/reset-password',
      component: () => import("./ResetPassword.vue") }),
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
