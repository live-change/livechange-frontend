<template>
  <view-root>
    <template #navbar>
      <NavBar />
    </template>
  </view-root>
</template>

<script setup>
  import 'primevue/resources/themes/vela-orange/theme.css'

  import NavBar from "./NavBar.vue"
  import ViewRoot from "@live-change/frontend-base/ViewRoot.vue"

  import { useMeta } from 'vue-meta'
  const { meta } = useMeta({
    title: 'Title',
    htmlAttrs: {
      lang: 'en',
      amp: true
    }
  })

  import { watch } from 'vue'
  import { client as useClient } from '@live-change/vue3-ssr'
  const client = useClient()
  watch(client, (newClient, oldClient) => {
    console.log("WATCH CLIENT", oldClient, '=>', newClient)
  })

</script>
