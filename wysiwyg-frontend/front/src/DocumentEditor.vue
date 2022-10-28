<template>
  <div class="relative">
    <slot v-if="editor" name="menu" :editor="editor">
      <EditorMenu :editor="editor" :config="config" />
    </slot>
    <editor-content :editor="editor" class="content" />
  </div>
</template>

<script setup>

  import { useEditor, EditorContent } from '@tiptap/vue-3'
  import { ref, computed, watch, provide, defineEmits, defineProps, getCurrentInstance, onUnmounted } from 'vue'
  import { toRefs, useDebounceFn } from '@vueuse/core'
  import EditorMenu from "./EditorMenu.vue"
  import { getExtensions } from "./contentConfigExtensions.js"
  import { getSchemaSpecFromConfig } from "./schemaJson.js"

  import { live, path, useApi, inboxReader } from '@live-change/vue3-ssr'
  import ProseMirrorCollab from "./ProseMirrorCollab.js"
  import { sendableSteps, receiveTransaction, getVersion } from 'prosemirror-collab'
  import { Step } from 'prosemirror-transform'

  const props = defineProps({
    document: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    initialContent: {
      type: Object,
      default: () => ({ type: 'doc', content: [ ] })
    }
  })

  const appContext = getCurrentInstance().appContext
  const api = useApi(appContext)

  const { document } = props

  let documentData = await api.get(['prosemirror', 'document', { document }])
  if(!documentData) {
    documentData = {
      id: document,
      document: props.document,
      type: props.type,
      purpose: props.purpose,
      content: props.initialContent,
      version: 0
    }
    documentData = await api.command(['prosemirror', 'createDocumentIfNotExists'], documentData)
  }

  const extensions = getExtensions(props.config)
  //console.log("CONFIG", props.config, 'EXTENSIONS', extensions)
  const editor = useEditor({
    content: documentData.content,
    extensions: [
      ...extensions,
      ProseMirrorCollab.configure({
        version: documentData.version,
        clientID: api.windowId
      })
    ],
    onTransaction: ({ editor, transaction }) => {
      console.log("EDITOR UPDATE", editor, transaction)
      saveDebounced()
    }
  })

  let sentSteps = []
  let sentVersion = 0

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  async function save() {
    const state = editor.value.reactiveState.value
    const sendable = sendableSteps(state)
    if(sendable) {
      let version = sendable.version
      let firstOriginalStepIndex = 0
      let resynchronization = false
      console.log("SENDABLE STEPS", sendable)
      const serializedSteps = sendable.steps.map((step, index) => ({ version: version + index, step: step.toJSON() }))
      console.log("SERIALIZED STEPS", serializedSteps)
      if(sendable.version <= sentVersion) { // found resend, check for duplicated steps
        for(let i = 0; i < serializedSteps.length; i++) {
          const step = serializedSteps[i]
          const sentStep = sentSteps.find(({ version }) => version == step.version)
          if(sentStep) {
            console.log('FOUND SENT STEP WITH THE SAME VERSION', sentStep, '==', step)
            if(JSON.stringify(sentStep) != JSON.stringify(step)) {
              resynchronization = true
              break
            }
            firstOriginalStepIndex = i + 1
          } else break
        }
      }
      serializedSteps.splice(0, firstOriginalStepIndex)
      if(resynchronization && sentSteps.length > 0) {
        console.log("RESYNCHRONIZATION!")
        const firstVersion = serializedSteps[0].version
        sentSteps = sentSteps.filter(({ version }) => version < firstVersion)
      }
      if(serializedSteps.length == 0) {
        console.log("NOTHING TO SEND")
        return
      }
      sentVersion = serializedSteps[0].version
      sentSteps = sentSteps.concat(serializedSteps)
      if(sentSteps.length > 200) sentSteps = sentSteps.slice(-100)
      const data = {
        document, type: props.type,
        version: sentVersion, steps: serializedSteps.map(({ step }) => step), window: api.windowId,
        continuation: firstOriginalStepIndex > 0
      }
      console.log("SEND DATA", data)
      //await sleep(1000)
      await api.command(['prosemirror', 'doSteps'], data)
    }
  }
  const saveDebounced = useDebounceFn(save, 100)

  api.source.on('connect', () => {
    save()
  })

  if(typeof window != 'undefined') {
    const stepsReader = inboxReader(
      (rawPosition, bucketSize) => {
        const positionCounter = +rawPosition.split(':').pop().replace(/"/g, '')
        const position = `${JSON.stringify(document)}:${JSON.stringify(positionCounter.toFixed().padStart(10, '0'))}`
        return ['prosemirror', 'steps', { document, gt: position, limit: bucketSize }]
      },
      (message) => {
        console.log("MESSAGE!", message)
        const modifiedVersion = +message.id.split(':').pop().replace(/"/g, '')
        const originalVersion = modifiedVersion - message.steps.length
        const state = editor.value.reactiveState.value
        const currentVersion = getVersion(state)
        if(currentVersion < originalVersion) throw new Error("COLLAB REQUESTED BACK STEPS!")
        console.log("COLLAB VERSION", currentVersion, "ORIGINAL VERSION", originalVersion, "MODIFIED VERSION", modifiedVersion)
        const versionDiff = currentVersion - originalVersion
        const newSteps = message.steps.slice(versionDiff)
        console.log("RUNNING STEPS", newSteps.length, "/", message.steps.length)
        const steps = newSteps.map(stepJson => Step.fromJSON(editor.value.schema, stepJson))
        const clientIDs = steps.map(step => message.window)
        const transaction = receiveTransaction(state, steps, clientIDs)
        editor.value.view.dispatch(transaction)
      },
      `${JSON.stringify(document)}:${JSON.stringify(documentData.version.toFixed().padStart(10, '0'))}`
    )
    onUnmounted(() => stepsReader.dispose())
  }

  const schemaSpec = ref(getSchemaSpecFromConfig(props.config))
</script>

<style scoped>

</style>
