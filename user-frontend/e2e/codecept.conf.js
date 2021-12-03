const { devices } = require('playwright');

const testServerPort = process.env.TEST_URL ? 0 : require('get-port-sync')() 
const testServerUrl = process.env.TEST_URL || `http://localhost:${testServerPort}`

exports.config = {
  tests: './*.test.js',
  output: './output',
  helpers: {
    LiveChange: {
      require: '@live-change/codeceptjs-helper',
      startServer: !process.env.TEST_URL,
      enableSessions: true,
      initScript: "./init.js",
      port: testServerPort
    },
    VideoHelper: {
      require: 'codeceptjs-video-helper'
    },
    AssertWrapper : {
      require: "codeceptjs-assert"
    },
    Playwright: {
      browser: 'chromium',
      url: testServerUrl,
      show: true,
      emulate: {
        ...devices['Pixel 2'],
        recordVideo: process.env.RECORD_TESTS ? {
          dir: "./output"
        } : undefined,
      }
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'e2e',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
}