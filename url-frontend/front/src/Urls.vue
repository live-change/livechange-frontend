<template>
  <div class="mb-4">
    <div v-if="canonical">

    </div>
    <div v-else>
      Generate Url
    </div>
    <div v-if="redirects.length > 0">
      <div v-for="url of redirects" :key="url.to"
           class="flex flex-row flex-wrap align-items-center">
        <div class="col-12 md:col-6 flex flex-row pr-0">
          <div>{{ url.domain }}</div>
          <div>{{ url.path }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

  import Button from "primevue/button"

  import { useToast } from 'primevue/usetoast'
  const toast = useToast()
  import { useConfirm } from 'primevue/useconfirm'
  const confirm = useConfirm()

  import { synchronized, synchronizedList } from "@live-change/vue3-components"

  import { computed, watch, ref, onMounted } from 'vue'

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

  import { path, live, actions } from '@live-change/vue3-ssr'
  const urlsApi = actions().url

  const [ canonical, redirects ] = await Promise.all([
    live(path().url.targetOwnedCanonical({ target, targetType })),
    live(path().url.targetOwnedRedirects({ target, targetType })
      .action('delete', ({ to, target, targetType }) =>
        path().url.deleteTargetOwnedRedirect({ redirect: to, target, targetType })
      )
    )
  ])

</script>

<style scoped>

</style>
