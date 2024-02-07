const { findFreePorts } = require("find-free-ports")
const path = require('path')
const vuePlugin = require('@vitejs/plugin-vue')

const Markdown = require('unplugin-vue-markdown/vite')
const MarkdownItAnchor = require('markdown-it-anchor')
const MarkdownItSub = require('markdown-it-sub')
const MarkdownItSup = require('markdown-it-sup')
const MarkdownItFootnote = require('markdown-it-footnote')
const MarkdownItDefList = require('markdown-it-deflist')
const MarkdownItAbbr = require('markdown-it-abbr')
const MarkdownItMark = require('markdown-it-mark')
const MarkdownItKatex = require('markdown-it-katex')
const MarkdownItTaskLists = require('markdown-it-task-lists')
const MarkdownItTableOfContents = require('markdown-it-table-of-contents')
const MarkdownItMermaid = require('markdown-it-mermaid').default

const { highlight } = require('@live-change/frontend-base/lezer.js')

const Components = require('unplugin-vue-components/vite')
const {
  PrimeVueResolver
} = require('unplugin-vue-components/resolvers')

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

let version = process.env.VERSION ?? 'unknown'

module.exports = async ({ command, mode }, options = {
  ssrDisabledDirectives: ['ripple', 'styleclass', 'badge', 'shared-element', 'lazy']

}) => {
  //console.log("VITE CONFIG", command, mode)
  return {
    define: {
      ENV_BASE_HREF: JSON.stringify(process.env.BASE_HREF || 'http://localhost:8001'),
      ENV_BRAND_NAME: JSON.stringify(process.env.BRAND_NAME || "Example"),
      ENV_BRAND_DOMAIN: JSON.stringify(process.env.BRAND_DOMAIN || "example.com"),
      ENV_MODE: JSON.stringify(mode),
      ENV_VERSION: JSON.stringify(version),
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
        include: [/\.vue$/, /\.md$/],
        template: {
          compilerOptions: {
            //   whitespace: "preserve",
            directiveTransforms: {
              ...(Object.fromEntries(options.ssrDisabledDirectives.map(d => [d, ssrTransformCustomDir]))),
            }
          }
        },
      }),
      Markdown({
        headEnabled: true,
        markdownItOptions: {
          html: true,
          linkify: true,
          typographer: true,
          highlight,
        },
        markdownItSetup(md) {
          md.use(MarkdownItSub)
          md.use(MarkdownItSup)
          md.use(MarkdownItFootnote)
          md.use(MarkdownItDefList)
          md.use(MarkdownItAbbr)
          md.use(MarkdownItMark)
          md.use(MarkdownItKatex)
          md.use(MarkdownItTaskLists)
          md.use(MarkdownItMermaid)
          md.use(MarkdownItAnchor)
          md.use(MarkdownItTableOfContents, {
            includeLevel: [1, 2, 3],
            containerClass: 'table-of-contents',
          })
        },
        wrapperClasses: 'markdown-body'
      }),
      Components({
        types: [{
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        }],
        resolvers: [
          PrimeVueResolver({
          })
        ],
        // allow auto load markdown components under `./src/components/`
        dirs: ['src/components'],
        // search for subdirectories
        deep: true,
        extensions: ['vue', 'md'],
        dts: true,
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
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
        ...(command == 'build' ? [
        ]: [
          '@live-change/dao',
        ]),
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
        ...(command == 'build' ? [
          '@live-change/dao',
        ]: [

        ]),
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
        '@live-change/flow-frontend',
        '@live-change/frontend-auto-form',
        'vue3-scroll-border',
        'pretty-bytes',
        'primevue',
        'primevue/usetoast',
        'primevue/useconfirm',
        'primevue/usedialog'
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
        'primevue',
        'primevue/usetoast',
        'primevue/useconfirm',
        'primevue/usedialog',
      ]
    },

    resolve: {
      alias: [
        { find: 'debug', replacement: 'debug/src/browser.js' },
        { find: 'universal-websocket-client', replacement: 'universal-websocket-client/browser.js' },
        { find: 'sockjs-client', replacement: 'sockjs-client/dist/sockjs.min.js' }
      ],
    },

    resolvers: [{
      fileToRequest (filePath) {
        console.log('@@@', filePath);
        if (filePath.startsWith(srcPath)) {
          return `/@/${path.relative(srcPath, filePath)}`;
        }
      },
      requestToFile (publicPath) {
        if (publicPath.startsWith('/@/')) {
          return path.join(srcPath, publicPath.replace(/^\/@\//, ''));
        }
      },
    }],
  }
}

