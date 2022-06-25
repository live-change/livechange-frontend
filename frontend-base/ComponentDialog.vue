<template>
  <component :is="component" v-bind="props" @update:modelValue="value => data.value = value" @close="handleClose" />
</template>

<script setup>

  import { inject, ref } from 'vue'

  const data = ref()

  const dialogRef = inject('dialogRef')

  const { component, props } = dialogRef.value.data

  function handleClose() {
    dialogRef.value.close(data)
  }

</script>

<style scoped>

</style>
