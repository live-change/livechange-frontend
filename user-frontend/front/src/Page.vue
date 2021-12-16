<template>
  <div class="min-h-screen flex flex-column surface-ground">
    <NavBar></NavBar>
    <div class="relative h-0 w-full">
      <ProgressBar v-if="loading || working" mode="indeterminate" style="height: .2em" />
    </div>
    <div class="p-5 flex flex-column flex-auto align-items-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  import ProgressBar from "primevue/progressbar"

  import NavBar from "./NavBar.vue"

  console.log("SETUP PAGE!!!")

  const { working, loading } = defineProps({
    working: {
      type: Boolean
    },
    loading: {
      type: Boolean
    }
  })
</script>
