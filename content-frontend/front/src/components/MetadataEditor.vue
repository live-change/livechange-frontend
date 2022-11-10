<template>
  <auto-input v-model="editable.title" :definition="properties.title" />

</template>

<script setup>

  import AutoInput from '@live-change/frontend-auto-form/AutoInput.vue'

  import { computed, watch, ref, onMounted, inject } from 'vue'
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

  const metadata = await live(p.content.objectOwnedMetadata({ objectType, object }))

  const synchronizedMetadata = synchronized({
    source: metadata,
    update: api.actions.content.setOrUpdateObjectOwnedMetadata,
    identifiers: { object, objectType },
    recursive: true,
    autoSave: false,
    onSave: () => toast.add({ severity: 'info', summary: 'Public access saved', life: 1500 })
  }).value

  const editable = synchronizedMetadata.value
  const save = synchronizedMetadata.save
  const changed = synchronizedMetadata.changed

</script>

<style scoped>

</style>
