<template>
  <div class="absolute top-0 right-0 pr-4 max-h-0 flex align-items-center z-5">
    <Button icon="pi pi-plus"
            class="p-button p-button-icon-only p-button-rounded p-button-danger"
            @click="createPage" />
  </div>
</template>

<script setup>
  import Button from 'primevue/button'

  const props = defineProps({
    path: {
      type: String,
      required: true
    }
  })

  import { toRefs } from "@vueuse/core"

  import { useHost } from "@live-change/frontend-base"
  const host = useHost()

  const { path } = toRefs(props)

  import { useToast } from 'primevue/usetoast'
  const toast = useToast()
  import { useConfirm } from 'primevue/useconfirm'
  const confirm = useConfirm()

  import { useRouter } from 'vue-router'
  const router = useRouter()

  function createPage() {
    confirm.require({
      target: event.currentTarget,
      message: `Do you want to create page at ${host}/${path.value} ?`,
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      accept: async () => {
        const pageId = await api.actions.content.createPage()
        await api.actions.url.takeUrl({
          target: pageId, targetType: 'content_Page', path: path.value, domain: host, redirect: false
        })
        toast.add({ severity:'success', summary: 'Page created', life: 1500 })
        setTimeout(() => {
          router.push({ name: 'content:pageEditor', params: { pageId } })
        }, 200)
      },
      reject: () => {
        toast.add({ severity:'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
      }
    })
  }

</script>

<style scoped>

</style>
