import { useApi, inboxReader } from '@live-change/vue3-ssr'
import { ref } from 'vue'

import schema from "./editorSchema.js"
import { Step } from "prosemirror-transform"

import Debug from "debug"
const debug = Debug("wysiwyg:collab")

const stepsThrottle = 100

class RemoteAuthority{
  constructor(appContext, documentId, type) {
    this.appContext = appContext
    this.api = useApi(appContext)

    this.documentId = documentId
    this.type = typeg
    this.onNewSteps = []
    this.onResynchronization = []

    this.remoteVersion = undefined
    this.receivedSteps = []

    this.sentSteps = []
    this.sentVersion = undefined

    this.handleStepsTimeout = null

    this.waitingForResync = true
    this.blockNextResync = false
    this.pendingRequests = 0

    this.synchronizationState = ref('loading')

    this.api.source.on('connect', () => {
      this.resynchronize()
    })
  }

  resynchronize() {
    debug("RESYNCHRONIZATION REQUESTED!")
    if(this.blockNextResync) return
    if(!this.stepsReader) return
    debug("BUCKET", this.stepsReader.observable.getValue()?.length, this.stepsReader.bucketSize,
      JSON.stringify(this.stepsReader.observable.getValue()))
    debug("QUEUE", this.stepsReader.queue.length)
    if(this.stepsReader.observable.getValue() === undefined
      || this.stepsReader.observable.getValue().length == this.stepsReader.bucketSize
      || this.stepsReader.queue.length > 0) { /// wait for reader
      this.waitingForResync = true
      this.blockNextResync = true
      debug("WAIT FOR READER")
      return
    }
    debug("RESYNCHRONIZE!")
    this.waitingForResync = false
    this.sentSteps = []
    this.sentVersion = -1

    if(this.pendingRequests == 0) {
      this.synchronizationState.value = 'saved' // will be set to saving after any save attempt
    }
    for(const callback of this.onResynchronization) {
      callback()
    }
  }

  handleSteps() {
    for(const listener of this.onNewSteps) listener()
    if(this.receivedSteps.length > 1000) this.receivedSteps = this.receivedSteps.slice(-100)
    this.handleStepsTimeout = null
    this.blockNextResync = false
    if(this.waitingForResync) {
      this.resynchronize()
    }
  }
  handleStepsThrottled() {
    if(this.handleStepsTimeout === null) {
      this.handleStepsTimeout = setTimeout(() => this.handleSteps(), stepsThrottle)
    }
  }

  async startInboxReader() {
    this.stepsReader = inboxReader(
      (rawPosition, bucketSize) => {
        const positionCounter = (+rawPosition.split(':').pop().replace(/"/g, '')) + 1
        const position = JSON.stringify(this.documentId) +
          `:${JSON.stringify(positionCounter.toFixed().padStart(10, '0'))}`
        return ['prosemirror', 'steps', { document: this.documentId, gt: position, limit: bucketSize }]
      },
      (message) => {
        debug("MESSAGE!", message, this.remoteVersion)
        if(message.version != this.remoteVersion) throw new Error("message out of order!")
        const modifiedVersion = message.version + 1
        this.remoteVersion = modifiedVersion
        this.receivedSteps.push(message)
        this.handleStepsThrottled()
      },
      `${JSON.stringify(this.documentId)}:${JSON.stringify((this.remoteVersion - 1).toFixed().padStart(10, '0'))}`,
      {
        bucketSize: 32,
        context: this.appContext
      }
    )
  }

  async loadDocument() {
    debug("LOAD DOCUMENT!")
    const documentData = await this.dao.get(['editor', 'document', this.documentId])
    this.remoteVersion = documentData.version
    this.waitingForResync = false
    await this.startInboxReader()
    this.synchronizationState.value = 'loaded'
    return documentData
  }

  async startWithLoadedDocument(documentData) {
    debug("START WITH LOADED DOCUMENT!")
    this.remoteVersion = documentData.version
    this.waitingForResync = false
    await this.startInboxReader()
    this.synchronizationState.value = 'loaded'
    return documentData
  }

  dispose() {
    if(this.stepsReader) {
      this.stepsReader.dispose()
    }
  }

  async receiveSteps(version, steps, clientId) {
    if(this.waitingForResync) return
    debug("RECEIVE STEPS", version, '<', this.remoteVersion)
    if(version < this.remoteVersion) return

    const stepsJson = steps.map((step, index) => ({ version: version + index, step: step.toJSON() }))
    debug("STEPS JSON", stepsJson)

    /// REMOVE DUPLICATED STEPS:
    let firstOriginalStepIndex = 0
    let resynchronization = false
    debug("VERSION", version, "SENT VERSION", this.sentVersion)
    if(version <= this.sentVersion - this.sentSteps.length) {
      debug("STEPS BUFFER OVERFLOW, WAITING FOR RESYNCHRONIZATION")
      this.waitingForResync = true
      return
    }
    if(version <= this.sentVersion) { // found resend, check for duplicated steps
      for(let i = 0; i < stepsJson.length; i++) {
        const step = stepsJson[i]
        const sentStep = this.sentSteps.find(({ version }) => version == step.version)
        if(sentStep) {
          //debug('FOUND SENT STEP WITH THE SAME VERSION', sentStep, '==', step)
          if(sentStep.json != step.json) {
            resynchronization = true
            break
          }
          firstOriginalStepIndex = i + 1
        } else break
      }
    }
    stepsJson.splice(0, firstOriginalStepIndex)
    debug("STEPS JSON AFTER DUPLICATED REMOVAL", stepsJson.length)
    if(resynchronization && this.sentSteps.length > 0) {
      debug("RESYNCHRONIZATION!")
      const firstVersion = stepsJson[0].version
      this.sentSteps = this.sentSteps.filter(({ version }) => version < firstVersion)
    }
    this.sentSteps = this.sentSteps.concat(stepsJson)
    if(this.sentSteps.length > 200) this.sentSteps = this.sentSteps.slice(-100)

    if(stepsJson.length == 0) {
      debug("NOTHING TO SEND")
      return
    }
    this.sentVersion = stepsJson[0].version

    if(this.pendingRequests == 0) this.synchronizationState.value = 'saving'
    let result
    try {
      this.pendingRequests++
      result = await this.api.prosemirror.edit({
        document: this.documentId,
        type: this.type,
        version: this.sentVersion, steps: stepsJson.map(({step}) => step),
        window: api.windowId,
        continuation: firstOriginalStepIndex > 0
      })
    } finally {
      this.pendingRequests--
    }
    if(result == 'saved') {
      if(this.pendingRequests == 0) this.synchronizationState.value = 'saved'
    } else {
      this.resynchronize()
    }
  }

  stepsSince(version) {
    debug("GET STEPS SINCE", version, this.receivedSteps)
    const firstStepVersion = this.remoteVersion - this.receivedSteps.length
    debug(
      "COLLAB REQUESTED VERSION:", version,
      "  FIRST STEP VERSION:", firstStepVersion,
      "  REMOTE VERSION:", this.remoteVersion
    )
    if(version < firstStepVersion) {
      console.error("COLLAB REQUESTED BACK STEPS!")
      console.info("STARTING TIME TRAVEL!")
      this.receivedSteps = []
      if(!this.stepsReader) throw new Error("steps reader not initialized!")
      this.stepsReader.dispose()
      this.remoteVersion = version
      this.startInboxReader()
      return { steps: [], clientIDs: [] }
    }
    const versionDiff = version - firstStepVersion
    const stepsData = this.receivedSteps.slice(versionDiff)
    debug("PARSING STEPS", stepsData.length)
    const steps = stepsData.map(stepData => Step.fromJSON(schema, stepData.step))
    const clientIDs = stepsData.map(stepData => stepData.clientId)
    return { steps, clientIDs }
  }
}

export default RemoteAuthority
