<template>
  <div class="w-full sm:w-12 md:w-9 lg:w-7 surface-card p-4 shadow-2 border-round">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">
        Urls
      </div>
    </div>

    <Urls if="" :targetType="targetType" :target="target" />
  </div>
</template>

<script setup>
  import Urls from "./Urls.vue"
  import { useApi } from '@live-change/vue3-ssr'

  const api = useApi()

  const { target, targetType } = defineProps({
    target: {
      type: String,
      required: true
    },
    targetType: {
      type: String,
      required: true
    }
  })
</script>

<style scoped>

</style>
