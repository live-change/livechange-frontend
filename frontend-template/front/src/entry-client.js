import { clientEntry } from '@live-change/frontend-base/client-entry.js'
import App from './App.vue'
import { createRouter } from './router'
import config from './config.js'

clientEntry(App, createRouter, {
  ...config,
  client: {
    api: {
      credentials(c) {
        if (!c) return {
          sessionKey: self.crypto.randomUUID()
        }
      }
    }
  }
})
