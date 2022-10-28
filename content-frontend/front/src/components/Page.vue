<template>
  <ResolveUrl targetType="content_Page" :path="urlPath" :fetchMore="urlMore">
    <template #default="{ target }">
      <LimitedAccess :requiredRoles="['writer']" objectType="content_Page" :object="target" hidden>
        <div class="absolute top-0 right-0 pr-4 max-h-0 flex align-items-center z-5">
          <Button icon="pi pi-pencil"
                  class="p-button p-button-icon-only p-button-rounded p-button-warning mr-2"
                  @click="editPage(target)" />
          <Button icon="pi pi-trash"
                  class="p-button p-button-icon-only p-button-rounded p-button-danger"
                  @click="deletePage(target)" />
        </div>
      </LimitedAccess>
      <Content objectType="content_Page" :object="target" />
    </template>
    <template #notFound="{ path }">
      <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div style="background: radial-gradient(50% 109137.91% at 50% 50%, rgba(233, 30, 99, 0.1) 0%, rgba(254, 244, 247, 0) 100%);" class="text-center">
          <span class="bg-white text-pink-500 font-bold text-2xl inline-block px-3">404</span>
        </div>
        <div class="mt-6 mb-5 font-bold text-6xl text-900 text-center">Page Not Found</div>
        <p class="text-700 text-3xl mt-0 mb-6 text-center">Sorry, we couldn't find the page.</p>
        <div class="text-center">
          <Button class="p-button-text mr-2" label="Go Back" icon="pi pi-arrow-left"></Button>
          <Button label="Go to Dashboard" icon="pi pi-home"></Button>
        </div>
      </div>
    </template>
  </ResolveUrl>
</template>

<script setup>
  import Button from "primevue/button"
  import { ResolveUrl } from "@live-change/url-frontend"
  import {LimitedAccess} from "@live-change/access-control-frontend";
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
  const { path: urlPath } = toRefs(props)

  import { useToast } from 'primevue/usetoast'
  const toast = useToast()
  import { useConfirm } from 'primevue/useconfirm'
  const confirm = useConfirm()

  function editPage(page) {

  }
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
