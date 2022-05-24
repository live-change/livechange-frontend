<template>
  <div class="notification-buttons">
    <Button @click="markRead()"
            icon="pi pi-eye" class="p-button-rounded p-button-outlined" />
    <Button @click="deleteNotification()"
            icon="pi pi-times" class="p-button-rounded p-button-outlined ml-1" />
  </div>
</template>

<script setup>
  import Button from "primevue/button"
  import Menu from "primevue/menu"

  import { useToast } from 'primevue/usetoast'
  import { useConfirm } from 'primevue/useconfirm'
  const confirm = useConfirm()
  const toast = useToast()

  import { actions } from "@live-change/vue3-ssr"

  const { notification } = defineProps({
    notification: {
      type: Object,
      required: true
    }
  })

  import { inject } from "vue"

  const workingZone = inject('workingZone')

  const notificationApi = actions().notification

  function markRead() {
    workingZone.addPromise('markNotification', (async () => {
      await notificationApi.mark({ notification: notification.to || notification.id, state: 'read' })
      toast.add({
        severity: 'success', summary:' Notification read',
        detail:'Notification has been marked as read', life: 3000
      })
    })())
  }

  function deleteNotification() {
    workingZone.addPromise('markNotification', (async () => {
      await notificationApi.delete({ notification: notification.to || notification.id })
      toast.add({
        severity: 'warn', summary: 'Notification deleted',
        detail: 'Notification has been deleted', life: 3000
      })
    })())
  }

</script>

<style scoped>

</style>