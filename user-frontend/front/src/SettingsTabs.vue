<template>
  <ul class="surface-card p-0 m-0 list-none flex overflow-x-auto select-none">
    <li v-for="tab in tabs">
      <router-link v-ripple :to="{ name: tab.route }"
         class="cursor-pointer px-4 py-3 flex align-items-center border-bottom-2 hover:border-500
                transition-colors transition-duration-150 p-ripple"
         :class="isActive(tab) ? 'border-blue-500 text-blue-500 hover:border-blue-500': 'text-700 border-transparent'"
         style="text-decoration: none">
        <i class="pi mr-2" :class="tab.icon"></i>
        <span class="font-medium">{{ tab.title }}</span>
      </router-link>
    </li>
  </ul>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [{
  title: "Connected accounts",
  route: 'user:connected',
  icon: 'pi-user'
}, {
  title: "Change password",
  route: 'user:changePassword',
  icon: 'pi-key'
}]

function isActive(tab) {
  return route.name == tab.route
}

</script>

<style>

</style>
