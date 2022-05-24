<template>
  <SimpleNotification :notification="notification">
    <div class="text-xl">
      You are invited
    </div>
    <pre class="w-full overflow-hidden">{{ notification }}</pre>
  </SimpleNotification>
</template>

<script setup>
  import { SimpleNotification } from "@live-change/user-frontend"

  const { notification } = defineProps({
    notification: {
      type: Object,
      required: true
    }
  })
</script>

<style scoped>

</style>