<template>

  <ContentPreview objectType="blog_Post" :object="blogId" :style="style" :class="clazz" />

</template>

<script setup>

  import ContentPreview from "./ContentPreview.vue";
  import { toRefs } from "@vueuse/core"

  const props = defineProps({
    postId: {
      type: String,
      required: true
    },
    class: {},
    style: {}
  })
  const { blogId, class: clazz, style } = toRefs(props)

</script>

<style scoped>

</style>
