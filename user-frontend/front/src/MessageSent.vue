<template>
  <div class="w-full lg:w-6 md:w-9" v-shared-element:form="{ duration: '300ms', includeChildren: true }">
    <div class="surface-card border-round shadow-2 p-4">
      <div class="text-900 font-medium mb-3 text-xl">Message sent</div>
      <p class="mt-0 mb-1 p-0 line-height-3">We sent special secret message to your email.</p>
      <p class="mt-0 mb-4 p-0 line-height-3">Click on the link or enter the code you found in that message.</p>
      <div class="flex justify-content-center">
        <div class="p-field mr-1">
          <label for="code" class="p-sr-only">Code</label>
          <InputMask id="code"  class="p-inputtext-lg" mask="999999" slotChar="######" placeholder="Enter code"
                     v-model="code" />
        </div>
        <Button label="OK" class="p-button-lg"></Button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue"
  import InputMask from "primevue/inputmask"
  import Button from "primevue/button"

  const { message } = defineProps({
    message: {
      type: String,
      required: true
    },
  })

  const code = ref("")
</script>

<style>

</style>
