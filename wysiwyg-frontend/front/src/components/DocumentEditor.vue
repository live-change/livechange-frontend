<template>
  <div class="relative">
    <slot v-if="editor" name="menu" :editor="editor" :saveState="saveState">
      <EditorMenu :editor="editor" :config="config" :saveState="saveState">
        <template #before="scope"><slot name="beforeMenu" v-bind="{ ...scope, editor, saveState }" /></template>
        <template #after="scope"><slot name="afterMenu" v-bind="{ ...scope, editor, saveState }" /></template>
        <template #begin="scope"><slot name="menuBegin" v-bind="{ ...scope, editor, saveState }" /></template>
        <template #end="scope"><slot name="menuEnd" v-bind="{ ...scope, editor, saveState }" /></template>
      </EditorMenu>
    </slot>
    <editor-content :editor="editor" class="content" />
  </div>
</template>

<script setup>

  import { useEditor, EditorContent } from '@tiptap/vue-3'
  import {
    ref, computed, watch, provide, defineEmits, defineProps, getCurrentInstance, onUnmounted, inject, onMounted
  } from 'vue'
  import { toRefs, useDebounceFn } from '@vueuse/core'
  import EditorMenu from "./EditorMenu.vue"
  import { getExtensions } from "./contentConfigExtensions.js"
  import { getSchemaSpecFromConfig, serializeSchema } from "./schemaJson.js"

  import { live, path, useApi, inboxReader } from '@live-change/vue3-ssr'
  import ProseMirrorCollab from "./ProseMirrorCollab.js"
  import { sendableSteps, receiveTransaction, getVersion } from 'prosemirror-collab'
  import { Step } from 'prosemirror-transform'
  import RemoteAuthority from "./RemoteAuthority";

  const props = defineProps({
    targetType: {
      type: String,
      required: true
    },
    target: {
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
    },
  })

  const emit = defineEmits(['update:saveState', 'update:version'])

  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)

  const appContext = getCurrentInstance().appContext
  const api = useApi(appContext)
  const clientID = api.windowId

  const { targetType, target } = props

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const extensions = getExtensions(props.config)
  const authority = new RemoteAuthority(appContext, props.targetType, props.target, props.type, {
    purpose: props.purpose,
    initialContent: props.initialContent
  })

  const saveState = computed(() => authority.synchronizationState.value ?? 'loading')
  emit('update:saveState', saveState.value)
  watch(() => saveState.value, async (state) => {
    emit('update:saveState', state)
  })

  const version = ref()
  watch(() => version.value, async (v) => {
    emit('update:version', v)
  })

  authority.onNewSteps.push(() => {
    console.log("ON NEW STEPS!")
    const { state, view } = editor.value
    const currentVersion = getVersion(state)
    console.log("COLLAB VERSION", currentVersion)
    let { steps, clientIDs } = authority.stepsSince(currentVersion, state.schema)
    console.error("RECEIVE STEPS", steps, clientIDs, clientID)
    const transaction = receiveTransaction(state, steps, clientIDs)
    view.dispatch(transaction)
    version.value = authority.remoteVersion
  })
  authority.onResynchronization.push(async function () {
    const state = editor.value.reactiveState.value
    const sendable = sendableSteps(state)
    if (sendable) {
      console.error("SEND STEPS", sendable.steps, sendable.version)
      authority.receiveSteps(sendable.version, sendable.steps, sendable.clientID)
    }
  })

  onUnmounted(() => authority.dispose())
  const documentData = await authority.loadDocument()
  version.value = authority.remoteVersion

  //console.log("CONFIG", props.config, 'EXTENSIONS', extensions)
  //console.log("DOCUMENT DATA", documentData)
  const editor = useEditor({
    content: documentData.content,
    extensions: [
      ...extensions,
      ProseMirrorCollab.configure({
        version: documentData.version,
        clientID
      })
    ],
    onTransaction: ({ editor, transaction }) => {
      console.log("EDITOR UPDATE", editor, transaction)
      for(const step of transaction.steps) {
        window.lastStep = step
      }
      saveDebounced()
    }
  })

  const schemaSpec = editor.view
    ? serializeSchema(editor.view.state.schema.spec)
    : getSchemaSpecFromConfig(props.config)

  async function save() {
    const state = editor.value.reactiveState.value
    const sendable = sendableSteps(state)
    if (sendable) {
      console.error("SEND STEPS", sendable.steps, sendable.version)
      authority.receiveSteps(sendable.version, sendable.steps, sendable.clientID)
    }
  }
  const saveDebounced = useDebounceFn(save, 100)

  if(typeof window !== 'undefined') {
    window.editor = editor
    window.testStep = (json) => {
      const testStep = Step.fromJSON(schema, json)
      console.log("TS", testStep)
      const transaction = editor.value.view.state.tr
      transaction.step(testStep)
      console.log("TRANSACTION", transaction)
      transaction.apply(editor.value.view.state)
    }
  }
</script>

<style scoped>

</style>
