import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'

let version = process.env.VERSION ?? 'unknown'

import baseViteConfig from '@live-change/frontend-base/vite-config.js'

export default defineConfig(async ({ command, mode }) => {
  const baseConfig = (await baseViteConfig({ command, mode }))
  return {
    ...baseConfig,

    define: {
      ...baseConfig.define,
      ENV_VERSION: JSON.stringify(version)
    },

    plugins: [
      ...baseConfig.plugins,
      Pages({
        dirs: [
          // basic
          { dir: 'src/pages', baseRoute: '' },
          // blog
          // { dir: 'src/blog', baseRoute: 'blog' },
        ],
        extensions: ['vue', 'md'],
      }),
    ],

    resolve: {
      ...baseConfig.resolve,
      alias: [
        ...baseConfig.resolve.alias,
      ]
    }
  }
})
