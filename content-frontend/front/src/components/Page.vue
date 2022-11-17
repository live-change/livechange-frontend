<template>
  <ResolveUrl targetType="content_Page" :path="urlPath" :fetchMore="urlMore">
    <template #default="{ target, style, class: clazz }">
      <Metadata objectType="content_Page" :object="target" />
      <LimitedAccess :requiredRoles="['writer']" objectType="content_Page" :object="target" hidden>
        <PageAdminButtons :page="target" :style="style" :class="clazz" :name="urlPath.value" />
      </LimitedAccess>
      <Content objectType="content_Page" :object="target" />
    </template>
    <template #notFound="{ path, style, class: clazz }">
      <NotFoundAdminButtons v-if="canCreatePage" :path="urlPath" :style="style" :class="clazz" />
      <NotFound :style="style" :class="clazz" />
    </template>
  </ResolveUrl>
</template>

<script setup>
  import Button from "primevue/button"
  import PageAdminButtons from "./PageAdminButtons.vue"
  import NotFoundAdminButtons from "./NotFoundAdminButtons.vue"

  import { ResolveUrl, NotFound } from "@live-change/url-frontend"
  import { LimitedAccess } from "@live-change/access-control-frontend";
  import Content from "./Content.vue"
  import Metadata from "./Metadata.vue"

  import { computed, watch, ref, onMounted } from 'vue'
  import { toRefs } from "@vueuse/core"

  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)

  import { path, live, useApi } from '@live-change/vue3-ssr'
  const api = useApi()
  const p = path()

  const urlMore = [
    url => p.content.page({ page: url.target }),
    url => p.content.content({ objectType: 'content_Page', object: url.target }),
    url => p.content.objectOwnedMetadata({ objectType: 'content_Page', object: url.target }),
    url => p.url.targetOwnedCanonical({ targetType: 'content_Page', target: url.target })
  ]

  const canCreatePage = computed(() => api.client.value.roles.includes('writer'))

  const props = defineProps({
    path: {
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
  const { path: urlPath, class: clazz, style } = toRefs(props)

</script>

<style scoped>

</style>
