<template>
  <div class="w-full lg:w-6" v-shared-element:form="{ duration: '300ms', includeChildren: true }">
    <div class="surface-card border-round shadow-2 p-4">
      <div class="text-900 font-medium mb-3 text-xl">Link expired</div>
      <p class="mt-0 mb-4 p-0 line-height-3">Your secret link already expired. To send another link click button below.</p>
      <Button label="Resend" class="p-button-lg"></Button>
    </div>
    <div class="surface-card border-round shadow-2 p-4">
      <div class="text-900 font-medium mb-3 text-xl">Unknown link</div>
      <p class="mt-0 mb-2 p-0 line-height-3">We can't find your secret link. Check if you copied the address correctly.</p>
    </div>
    <div class="surface-card border-round shadow-2 p-4">
      <div class="text-900 font-medium mb-3 text-xl">Link used</div>
      <p class="mt-0 mb-2 p-0 line-height-3">This link was already used.</p>
    </div>
  </div>
</template>

<script setup>
  import Button from "primevue/button"

  const contact = defineProps({
    message: {
      type: String,
      required: true
    }
  })


</script>

<style>

</style>
