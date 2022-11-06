<template>

  <LimitedAccess :requiredRoles="['writer']" objectType="content_Page" :object="pageId" hidden>
    <div class="absolute top-0 right-0 pr-4 max-h-0 flex align-items-center z-5">
      <Badge severity="warning" value="This is page preview" class="mr-2" />
      <router-link :to="{ name: 'content:pageEditor', params: { pageId } }" class="no-underline">
        <Button icon="pi pi-pencil"
                class="p-button p-button-icon-only p-button-rounded p-button-warning mr-2" />
      </router-link>
    </div>
    <Content objectType="content_Page" :object="pageId" :style="style" :class="clazz" preview />
  </LimitedAccess>

</template>

<script setup>
  import Button from "primevue/button"
  import Badge from "primevue/badge"

  import { ResolveUrl, NotFound } from "@live-change/url-frontend"
  import { LimitedAccess } from "@live-change/access-control-frontend";
  import Content from "./Content.vue"

  import { computed, watch, ref, onMounted } from 'vue'
  import { toRefs } from "@vueuse/core"
  import { useHost } from "@live-change/frontend-base"

  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)

  import { path, live, useApi } from '@live-change/vue3-ssr'
  const api = useApi()
  const p = path()

  const urlMore = [
    url => p.content.page({ page: url.target })
  ]

  const props = defineProps({
    pageId: {
      type: String,
      required: true
    },
    class: {
      type: String,
      default: ''
    },
    style: {
      type: String,
      default: ''
    }
  })
  const { pageId, class: clazz, style } = toRefs(props)

</script>

<style scoped>

</style>
