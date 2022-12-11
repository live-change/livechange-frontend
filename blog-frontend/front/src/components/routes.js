import { sitemap } from "@live-change/url-frontend"

export function contentEditRoutes(config = {}) {
  const { prefix = '/', route = (r) => r } = config

  return [
    route({ name: 'blog:editor', path: prefix + 'post-editor/:pageId', meta: { }, props: true,
      component: () => import("./BlogPostEditor.vue") }),
    route({ name: 'blog:preview', path: prefix + 'post-preview/:pageId', meta: { }, props: true,
      component: () => import("./BlogPostPreview.vue") }),
  ]
}

export function catchAllPagesRoute(config = {}) {
  const { prefix = '/', route = (r) => r } = config

  return [

    route({
      name: 'blog:post', path: prefix + ':path(.*)', meta: { },
      component: () => import("./BlogPost.vue"),
      props: true
    })

  ]
}


export function routes(config = {}) {
  const { prefix = '/', route = (r) => r } = config

  return [

      ...contentEditRoutes(config),
      ...catchAllPagesRoute({ ...config, prefix: config.blogPrefix ?? '/blog/' })

  ]
}

export async function pagesSitemap(route, api) {
  await sitemap(route, api, 'blog_Post', '/blog/')
}

export default routes
