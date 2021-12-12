<template>
  <router-view v-slot="{ route, Component }">
    <template v-if="route?.meta?.raw">
      <component :is="Component" />
    </template>
    <loading-zone v-else suspense>
      <template v-slot:loading>
        <div class="loading">Loading! Please wait!</div>
      </template>
      <page>
        <working-zone>
          <template v-slot:working>
            <div class="loading">Working! Please wait!</div>
          </template>
          <component :is="Component" />
        </working-zone>
      </page>
    </loading-zone>
  </router-view>
</template>

<script setup>
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import { useMeta } from 'vue-meta'
import Page from "./Page.vue"

const { meta } = useMeta({
  title: 'Title',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport',
      content: "user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1," +
          " width=device-width, viewport-fit=cover" }
  ],
  htmlAttrs: {
    lang: 'en',
    amp: true
  }
})

import { onMounted } from 'vue'
import isClientSide from "./isClientSide.js"
onMounted(() => isClientSide.value = true)

</script>

<style>
  body {
    margin: 0;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--surface-a);
    font-family: var(--font-family);
    font-weight: 400;
    color: var(--text-color);
  }
</style>
