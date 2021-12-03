<template>
  <div class="min-h-screen flex flex-column surface-ground">
    <NavBar></NavBar>
    <div class="p-5 flex flex-column flex-auto align-items-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  import NavBar from "./NavBar.vue"

  console.log("SETUP PAGE!!!")
</script>

<style scoped>

</style>