<template>
  <ResolveUrl targetType="content_Page" :path="urlPath" :fetchMore="urlMore">
    <template #default="{ target, style, class: clazz }">
      <LimitedAccess :requiredRoles="['writer']" objectType="content_Page" :object="target" hidden>
        <div class="absolute top-0 right-0 pr-4 max-h-0 flex align-items-center z-5" :style="style" :class="clazz">
          <router-link :to="{ name: 'content:pageEditor', params: { pageId: target } }" class="no-underline">
            <Button icon="pi pi-pencil"
                    class="p-button p-button-icon-only p-button-rounded p-button-warning mr-2" />
          </router-link>
          <Button icon="pi pi-trash"
                  class="p-button p-button-icon-only p-button-rounded p-button-danger"
                  @click="deletePage(target)" />
        </div>
      </LimitedAccess>
      <Content objectType="content_Page" :object="target" />
    </template>
    <template #notFound="{ path, style, class: clazz }">
      <NotFound :style="style" :class="clazz" />
    </template>
  </ResolveUrl>
</template>

<script setup>
  import Button from "primevue/button"
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
    path: {
      type: String,
      required: true
    }
  })
  const { path: urlPath, class: clazz, style } = toRefs(props)

  import { useToast } from 'primevue/usetoast'
  const toast = useToast()
  import { useConfirm } from 'primevue/useconfirm'
  const confirm = useConfirm()

  function deletePage(page) {
    confirm.require({
      target: event.currentTarget,
      message: `Do you want to remove page ${urlPath.value} ?`,
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      accept: async () => {
        await api.actions.content.deletePage({ page })
        toast.add({ severity:'info', summary: 'Page deleted', life: 1500 })
      },
      reject: () => {
        toast.add({ severity:'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
      }
    })
  }

</script>

<style scoped>

</style>
