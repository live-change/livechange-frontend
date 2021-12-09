<template>
  <div class="w-full lg:w-6 md:w-9" v-shared-element:form="{ duration: '300ms', includeChildren: true }">
    <div class="surface-card p-4 shadow-2 border-round">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">Connect account</div>
      </div>

      <div>

        <div class="p-field mb-3">
          <label for="email" class="block text-900 font-medium mb-2">
            Email address
          </label>
          <InputText id="email" type="text" class="w-full p-invalid" aria-describedby="email-help" />
          <small id="email-help" class="p-error">email not found.</small>
        </div>

        <Button label="Connect" icon="pi pi-user" class="w-full"></Button>

        <Divider align="center" class="my-4">
          <span class="text-600 font-normal text-sm">OR</span>
        </Divider>

        <Button label="Connect GitHub account" icon="pi pi-github" class="w-full p-button-secondary mb-2"></Button>
        <Button label="Connect Google account" icon="pi pi-google" class="w-full p-button-secondary mb-1"></Button>

      </div>
    </div>
  </div>
</template>

<script setup>
  import InputText from "primevue/inputtext"
  import Checkbox from "primevue/checkbox"
  import Button from "primevue/button"
  import Divider from "primevue/divider"

</script>

<style>

</style>
