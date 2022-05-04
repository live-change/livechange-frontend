const { findFreePorts } = require("find-free-ports")
const path = require('path')
const vuePlugin = require('@vitejs/plugin-vue')
const { visualizer } = require('rollup-plugin-visualizer')
const viteImages = require('vite-plugin-vue-images')
const viteCompression = require('vite-plugin-compression')

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
      port: (await findFreePorts())[0]
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
            'shared-element': ssrTransformCustomDir
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
        /live-change-framework\/uid\//,
        /live-change-dao\/dao\//,
        /live-change-dao\/dao-sockjs\//,
        /live-change-dao\/dao-websocket\//,
      ]
    },
  },
  ssr: {
    external: [
      '@live-change/dao',
      '@live-change/uid',
      '@live-change/framework',
      '@live-change/framework/lib/utils/validators.js',
      'debug',
      'vite'
    ],
    noExternal: [
      'vue-meta',
      '@live-change/vue3-components',
      '@live-change/dao-vue3',
      '@live-change/vue3-ssr',
      '@live-change/email-service',
      '@live-change/password-authentication-service',
      'vue3-scroll-border'
    ]
  },
  optimizeDeps: {
    include: [
      '@live-change/dao',
      '@live-change/dao-sockjs',
      '@live-change/dao-websocket',
      '@live-change/uid',
      '@live-change/framework',
      '@live-change/framework/lib/utils/validators.js',
      'debug'
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

