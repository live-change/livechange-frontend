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
    console.log(['prosemirror', 'createDocument'], documentData)
    await api.command(['prosemirror', 'createDocument'], documentData)
  }

  const extensions = getExtensions(props.config)
  console.log("CONFIG", props.config, 'EXTENSIONS', extensions)
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

  function save() {
    const state = editor.value.reactiveState.value
    const sendable = sendableSteps(state)
    if(sendable) {
      console.log("SENDABLE STEPS", sendable)
      const serializedSteps = sendable.steps.map(step => step.toJSON())
      console.log("SERIALIZED STEPS", serializedSteps)
      api.command(['prosemirror', 'doSteps'], {
        document, type: props.type,
        version: sendable.version, steps: serializedSteps, window: api.windowId
      })
    }
  }

  const saveDebounced = useDebounceFn(save, 100)

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
</script>

<style scoped>

</style>
