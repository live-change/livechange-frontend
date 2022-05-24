<template>
  <SimpleNotification :notification="notification">
    <div>
      <UserIdentification :ownerType="notification.fromType" :owner="notification.from"
                        :data="notification.fromIdentification" inline />
      Invited you to
    </div>
    <pre class="w-full overflow-hidden">{{ notification }}</pre>
  </SimpleNotification>
</template>

<script setup>
  import { SimpleNotification } from "@live-change/user-frontend"
  import { UserIdentification } from "@live-change/user-frontend"

  const { notification } = defineProps({
    notification: {
      type: Object,
      required: true
    }
  })
</script>

<style scoped>

</style>