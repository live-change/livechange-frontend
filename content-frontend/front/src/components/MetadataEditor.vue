<template>
  <pre style="white-space: pre-wrap; word-wrap: break-word;">{{ JSON.stringify(editable, null, '  ') }}</pre>
  <auto-editor :definition="definition" v-model="editable" :rootValue="editable" />
  <Button label="Save metadata" icon="pi pi-save" :disabled="!changed" @click="save" />
</template>

<script setup>
  import Button from 'primevue/button'
  import { AutoInput, AutoField, AutoEditor } from '@live-change/frontend-auto-form'

  import { computed, watch, ref, onMounted, onUnmounted, inject } from 'vue'
  import { toRefs } from "@vueuse/core"

  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)

  const props = defineProps({
    objectType: {
      type: String,
      required: true
    },
    object: {
      type: String,
      required: true
    }
  })

  const { objectType, object } = props

  import { useApi, path, live } from '@live-change/vue3-ssr'
  const api = useApi()
  const p = path()

  const definition = api.getServiceDefinition('content').models.Metadata
  const properties = definition.properties

  import { synchronized } from "@live-change/vue3-components"

  import { useToast } from 'primevue/usetoast'
  const toast = useToast()
  import { useConfirm } from 'primevue/useconfirm'
  const confirm = useConfirm()

  const metadata = await live(p.content.objectOwnedMetadata({ objectType, object }))

  const synchronizedMetadata = synchronized({
    source: metadata,
    update: api.actions.content.setOrUpdateObjectOwnedMetadata,
    identifiers: { object, objectType },
    recursive: true,
    autoSave: false,
    onSave: () => toast.add({ severity: 'info', summary: 'Metadata saved', life: 1500 })
  })

  const editable = synchronizedMetadata.value
  const save = synchronizedMetadata.save
  const changed = synchronizedMetadata.changed



  function beforeUnload(ev) {
    if(changed.value) return ev.returnValue = "You have some unsaved changes!"
  }
  onMounted(() => window.addEventListener('beforeunload', beforeUnload))
  onUnmounted(() => window.removeEventListener('beforeunload', beforeUnload))

</script>

<style scoped>

</style>
