<template>
  <div class="w-full lg:w-6 md:w-9" v-shared-element:form="{ duration: '300ms', includeChildren: true }">
    <SettingsTabs />
    <div class="surface-card border-round shadow-2 p-4">
      <div class="text-900 font-medium mb-3 text-xl">Connected accounts</div>

      <ul class="list-none p-0 m-0 mt-5 mb-4">
        <li class="flex flex-row align-items-center justify-content-between mb-2">
          <div class="flex flex-row align-items-center">
            <i class="pi pi-envelope mr-2"></i>
            <span class="block text-900 font-medium text-lg">m8@em8.pl</span>
          </div>
          <Button class="p-button-text p-button-plain p-button-rounded mr-1" icon="pi pi-times"></Button>
        </li>
        <li class="flex flex-row align-items-center justify-content-between mb-2">
          <div class="flex flex-row align-items-center">
            <i class="pi pi-envelope mr-2"></i>
            <span class="block text-900 font-medium text-lg">michal@laszczewski.pl</span>
          </div>
          <Button class="p-button-text p-button-plain p-button-rounded mr-1" icon="pi pi-times"></Button>
        </li>
        <li class="flex flex-row align-items-center justify-content-between mb-2">
          <div class="flex flex-row align-items-center">
            <i class="pi pi-phone mr-2"></i>
            <span class="block text-900 font-medium text-lg">+27 123 456 789</span>
          </div>
          <Button class="p-button-text p-button-plain p-button-rounded mr-1" icon="pi pi-times"></Button>
        </li>
        <li class="flex flex-row align-items-center justify-content-between mb-2">
          <div class="flex flex-row align-items-center">
            <i class="pi pi-google mr-2"></i>
            <span class="block text-900 font-medium text-lg">michal8.m8@gmail.com</span>
          </div>
          <Button class="p-button-text p-button-plain p-button-rounded mr-1" icon="pi pi-trash"></Button>
        </li>
      </ul>

      <div class="flex flex-row">
        <router-link :to="{ name: 'user:connectAccount' }" class="mr-2 no-underline">
          <Button label="Connect Account" icon="pi pi-user-plus" class="p-button-lg"></Button>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import Button from "primevue/button"
import isClientSide from "./isClientSide.js"
import SettingsTabs from "./SettingsTabs.vue"


</script>

<style>

</style>
