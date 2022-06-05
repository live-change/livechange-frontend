<template>
<!--  <pre>{{ JSON.stringify(upload.serverUpload, null, '  ') }}</pre>-->
  <div class="surface-card" v-if="upload.serverUpload">
    <ProgressBar :value="upload.serverUpload.progress.percentage.toFixed()" />
    <div v-if="upload.serverUpload.state != 'done'" class="flex mt-2">
      <div class="flex-grow-1">
        {{ prettyBytes(upload.serverUpload.progress.transferred) }}
        /
        {{ prettyBytes(upload.serverUpload.progress.length) }}
      </div>
      <div class="text-right ml-2" v-if="upload.serverUpload.progress.eta">
        eta: {{ Duration.fromMillis(upload.serverUpload.progress.eta).toHuman({  unitDisplay: "short" }) }}
      </div>

    </div>
    <div v-else class="text-center">
      Uploaded {{ prettyBytes(upload.serverUpload.progress.length) }}
    </div>
  </div>
</template>

<script setup>

  import ProgressBar from "primevue/progressbar"

  import { toRefs } from "@vueuse/core"

  import prettyBytes from 'pretty-bytes';

  import { Duration } from 'luxon'

  const props = defineProps({
    upload: {
      type: Object,
      required: true
    },
    cancelable: {
      type: Boolean,
      default: false
    }
  })

  const { upload, cancelable } = toRefs(props)

</script>

<style scoped>

</style>