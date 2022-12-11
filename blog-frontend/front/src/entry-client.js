import { clientEntry } from '@live-change/frontend-base/client-entry.js'
import App from './App.vue'
import { createRouter } from './router'
import config from './config.js'

await clientEntry(App, createRouter, config)
