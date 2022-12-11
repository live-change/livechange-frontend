<template>
  <UrlContent objectType="blog_Post" :path="urlPath" :class="clazz" :style="style" />
</template>

<script setup>

  import { toRefs } from "@vueuse/core"
  import UrlContent from "./UrlContent.vue";

  const props = defineProps({
    path: {
      type: String,
      required: true
    },
    class: {
      type: String,
      default: ''
    },
    style: {
      type: String,
      default: ''
    }
  })
  const { path: urlPath, class: clazz, style } = toRefs(props)

</script>

<style scoped>

</style>
