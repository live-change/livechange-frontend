<template>
  <div class="absolute top-0 right-0 pr-4 max-h-0 flex align-items-center z-5">
    <router-link :to="{ name: 'content:pageEditor', params: { pageId: target } }" class="no-underline">
      <Button icon="pi pi-pencil"
              class="p-button p-button-icon-only p-button-rounded p-button-warning mr-2" />
    </router-link>
  </div>
</template>

<script setup>
  import Button from 'primevue/button'

  const props = defineProps({
    path: {
      type: String,
      required: true
    },
    target: {
      type: String,
      required: true
    }
  })

  import { toRefs } from "@vueuse/core"

  const { target } = toRefs(props)

</script>

<style scoped>

</style>
