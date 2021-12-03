<template>
  <div class="w-full lg:w-6" v-shared-element:form="{ duration: '300ms', includeChildren: true }">
    <div class="surface-card p-4 shadow-2 border-round" v-shared-element:form>
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">Reset password</div>
      </div>

      <div>

        <div class="p-field mb-3">
          <label for="email" class="block text-900 font-medium mb-2">
            Email or phone number
          </label>
          <InputText id="email" type="text" class="w-full p-invalid" aria-describedby="email-help" />
          <small id="email-help" class="p-error">email not found.</small>
        </div>

        <Button label="Reset password" icon="pi pi-key" class="w-full"></Button>

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
