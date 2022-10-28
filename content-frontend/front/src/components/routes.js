import { sitemap } from "@live-change/url-frontend"

export function contentEditRoutes(config = {}) {
  const { prefix = '/', route = (r) => r } = config

  return [

    route({ name: 'content:editor', path: prefix + 'content-editor/:documentId', meta: { },
      component: () => import("./ContentEditor.vue") }),
    route({ name: 'content:pageEditor', path: prefix + 'page-editor/:pageId', meta: { },
      component: () => import("./PageEditor.vue") }),

  ]
}

export function catchAllPagesRoute(config = {}) {
  const { prefix = '/', route = (r) => r } = config

  return [

    route({
      name: 'content:page', path: prefix + ':path(.*)', meta: { },
      component: () => import("./Page.vue"),
      props: true
    })

  ]
}


export function routes(config = {}) {
  const { prefix = '/', route = (r) => r } = config

  return [

      ...contentEditRoutes(config),
      ...catchAllPagesRoute({ ...config, prefix: config.pagePrefix ?? '/' })

  ]
}

export async function pagesSitemap(route, api) {
  await sitemap(route, api, 'page_Page', '/')
}

export default routes
