<template>
  <div class="w-full sm:w-9 md:w-8 lg:w-6 surface-card p-4 shadow-2 border-round">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">
        Upload Test
      </div>
    </div>

<!--    <pre>{{ JSON.stringify(upload, null, "  ") }}</pre>-->

    <FileInput @input="handleUpload" class="inline-block">
      <Button label="Upload File" icon="pi pi-upload"></Button>
    </FileInput>

<!--    <UploadView v-if="upload" :upload="upload" cancelable class="surface-card shadow-2 border-round p-4 mt-3" />-->
  </div>
</template>

<script setup>
  import Button from "primevue/button"
  import { ref, getCurrentInstance } from 'vue'
  import { Upload, UploadView, FileInput } from "@live-change/upload-frontend"
  import { uploadImage } from "./imageUploads.js"

  const upload = ref()
  const appContext = getCurrentInstance().appContext

  async function handleUpload(file) {
    console.log("FILE", file)
    upload.value = uploadImage('test', { file },
        { preparedPreview: true, appContext })

    await upload.value.upload()

    console.log("UPLOADED", upload.value)
    //upload.value = null
  }

</script>

<style scoped>

</style>
