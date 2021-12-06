<template>
  <div class="w-full lg:w-6" v-shared-element:form="{ duration: '300ms', includeChildren: true }">
    <SettingsTabs />
    <div class="surface-card border-round shadow-2 p-4">
      <div class="text-900 font-medium mb-3 text-xl">Settings</div>

    </div>

    <div v-if="isClientSide">
      <Dropdown v-model="selectedCity1" :options="cities" optionLabel="name" optionValue="code" placeholder="Select a City" />
    </div>
  </div>
</template>

<script setup>
import isClientSide from "./isClientSide.js"

import SettingsTabs from "./SettingsTabs.vue"
import Dropdown from "primevue/dropdown"

const cities = [
  {name: 'New York', code: 'NY'},
  {name: 'Rome', code: 'RM'},
  {name: 'London', code: 'LDN'},
  {name: 'Istanbul', code: 'IST'},
  {name: 'Paris', code: 'PRS'}
]
</script>

<style>

</style>
