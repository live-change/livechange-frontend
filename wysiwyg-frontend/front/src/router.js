import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router'

export function wysiwygRoutes(config = {}) {
  const { prefix = '/', route = (r) => r } = config
  return [
    route({
      name: 'wysiwyg:experiment1', path: prefix + '/e1', meta: { },
      component: () => import("./Experiment1.js"),
      props: {
      }
    })
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

