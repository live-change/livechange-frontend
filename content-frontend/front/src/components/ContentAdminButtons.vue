<template>
  <div class="absolute top-0 right-0 pr-4 max-h-0 flex align-items-center z-5">
    <router-link :to="{ name: 'content:pageEditor', params: { pageId: page } }" class="no-underline">
      <Button icon="pi pi-pencil"
              class="p-button p-button-icon-only p-button-rounded p-button-warning mr-2" />
    </router-link>
    <Button icon="pi pi-trash"
            class="p-button p-button-icon-only p-button-rounded p-button-danger"
            @click="deletePage" />
  </div>
</template>

<script setup>
  import Button from 'primevue/button'

  const props = defineProps({
    page: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: ""
    }
  })

  import { toRefs } from "@vueuse/core"

  const { page, name } = toRefs(props)

  import { useToast } from 'primevue/usetoast'
  const toast = useToast()
  import { useConfirm } from 'primevue/useconfirm'
  const confirm = useConfirm()

  function deletePage() {
    confirm.require({
      target: event.currentTarget,
      message: `Do you want to remove page ${name} ?`,
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
