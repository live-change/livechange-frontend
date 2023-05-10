const { findFreePorts } = require("find-free-ports")
const path = require('path')
const vuePlugin = require('@vitejs/plugin-vue')
const { visualizer } = require('rollup-plugin-visualizer')
const viteImages = require('vite-plugin-vue-images')
const viteCompression = require('vite-plugin-compression')
const { searchForWorkspaceRoot } = require('vite')

const ssrTransformCustomDir = () => {
  return {
    props: [],
    needRuntime: true
  }
}

module.exports = async ({ command, mode }) => ({
  define: {
    ENV_BASE_HREF: JSON.stringify(process.env.BASE_HREF || 'http://localhost:8001')
  },
  server: {
    hmr: {
      port: +(process.env.HMR_PORT ?? (await findFreePorts())[0])
    },
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        path.dirname(require.resolve('primeicons/package.json')),
        path.dirname(require.resolve('@fortawesome/fontawesome-free/package.json'))
      ]
    }
  },
  plugins: [
    vuePlugin({
      template: {
        compilerOptions: {
          //   whitespace: "preserve",
          directiveTransforms: {
            'ripple': ssrTransformCustomDir,
            'styleclass': ssrTransformCustomDir,
            'badge': ssrTransformCustomDir,
            'shared-element': ssrTransformCustomDir,
            'lazy': ssrTransformCustomDir
          }
        }
      },
    }),
    viteImages({ extensions: ['jpg', 'jpeg', 'png', 'svg', 'webp'] }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
    viteCompression({ algorithm: 'gzip', ext: '.gz' }),
    viteCompression({ algorithm: 'deflate', ext: '.zz' }),
    visualizer({
      filename: '../stats.html'
    }),
  ],
  build: {
    minify: false,
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [
        /node_modules/,
        /live-change-framework\/framework\//,
        /live-change-framework\/relations-plugin\//,
        /live-change-framework\/uid\//,
        /live-change-db\/db-web\//,
        /live-change-db\/db\//,
        /live-change-db\/db-store-rbtree\//,
        /live-change-db\/db-store-indexeddb\//,
        /live-change-db\/db-store-localstorage\//,
        /live-change-dao\/dao\//,
        /live-change-dao\/dao-sockjs\//,
        /live-change-dao\/dao-websocket\//,
        /live-change-dao\/dao-message\//,
      ]
    },
  },
  ssr: {
    external: [
      '@live-change/dao',
      '@live-change/uid',
      '@live-change/framework',
      '@live-change/framework/lib/utils/validators.js',
      '@live-change/relations-plugin',
      '@live-change/db-web',
      '@live-change/db',
      '@live-change/db-store-indexeddb',
      '@live-change/db-store-rbtree',
      'debug',
      'vite',
      'pica'
    ],
    noExternal: [
      'vue-meta',
      '@live-change/vue3-components',
      '@live-change/dao-vue3',
      '@live-change/vue3-ssr',
      '@live-change/email-service',
      '@live-change/password-authentication-service',
      '@live-change/db-admin',
      '@live-change/user-frontend',
      '@live-change/frontend-base',
      '@live-change/frontend-utils',
      '@live-change/access-control-frontend',
      '@live-change/content-frontend',
      '@live-change/blog-frontend',
      '@live-change/image-frontend',
      '@live-change/security-frontend',
      '@live-change/upload-frontend',
      '@live-change/url-frontend',
      '@live-change/user-frontend',
      '@live-change/wysiwyg-frontend',
      'vue3-scroll-border',
      'pretty-bytes'
    ]
  },
  optimizeDeps: {
    include: [
      '@live-change/dao',
      '@live-change/dao-sockjs',
      '@live-change/dao-websocket',
      '@live-change/dao-message',
      '@live-change/uid',
      '@live-change/framework',
      '@live-change/framework/lib/utils/validators.js',
      '@live-change/relations-plugin',
      '@live-change/db-web',
      '@live-change/db',
      '@live-change/db-store-indexeddb',
      '@live-change/db-store-rbtree',
      'debug',
      'pica'
    ],
    exclude: [
      'primevue'
    ]
  },

  resolve: {
    alias: [
      { find: 'debug', replacement: 'debug/src/browser.js' },
      { find: 'universal-websocket-client', replacement: 'universal-websocket-client/browser.js' },
      { find: 'sockjs-client', replacement: 'sockjs-client/dist/sockjs.min.js' }
    ],
  }
})

