<template>
  <div class="w-full lg:w-6 md:w-9" v-shared-element:form="{ duration: '300ms', includeChildren: true }">
    <div class="surface-card p-4 shadow-2 border-round">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">Delete account</div>
      </div>

      <div>
        <p>
          Account deletion is irreversible, check the box below only if you are
          100% sure that you want to delete your account.
        </p>
        <div class="p-field-checkbox mb-3">
          <Checkbox id="delete" v-model="wantDelete" :binary="true" />
          <label for="delete">&nbsp; I want to delete my account.</label>
        </div>

        <Button label="Delete account" icon="pi pi-user-plus" class="p-button-lg" :disabled="!wantDelete" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import InputText from "primevue/inputtext"
  import Checkbox from "primevue/checkbox"
  import Button from "primevue/button"
  import Divider from "primevue/divider"

  import { ref } from 'vue'
  const wantDelete = ref(false)

</script>

<style>

</style>
