<template>
  <img :src="url" :width="width" :height="height" @load="ev => $emit('load', ev)" :title="title">
</template>

<script setup>

  import { api as useApi } from '@live-change/vue3-ssr'
  const api = useApi()

  import { ref, computed, watch } from 'vue'
  import { imageUploads } from "./imageUploads.js";

  const props = defineProps({
    image: {
      type: String,
      required: true
    },
    imageData: {
      type: Object
    },
    circle: {
      type: Boolean,
      default: false
    },
    original: {
      type: Boolean,
      default: false
    },
    reactive: {
      type: Boolean,
      default: false
    },
    width: {
    },
    height: {
    },
    noResize: {
    },
    empty: {
      type: String,
      default: "/static/images/empty-photo.svg"
    },
    title: {
      type: String,
      default: null
    }
  })

  const upload = computed(() => {
    return imageUploads.value.find(upload => upload.id == props.image)
  })

  const imageData = ref(props.imageData)
  const reloadImageDataTimeout = 500

  let loadImagePromise = null
  async function loadImageData() {
    if(!loadImagePromise) loadImagePromise = (async () => {
      const loaded = await api.get(['image', 'image', { image: props.image }])
      console.log("IM DATA", loaded)
      loadImagePromise = null
      if(loaded) {
        const { width, height } = loaded
        size.value = { width, height }
        imageData.value = loaded
      }
      if(!imageData.value && !upload.value) {
        setTimeout(loadImageData, reloadImageDataTimeout)
      }
    })()
    return loadImagePromise
  }

  const url = ref("/images/empty-photo.svg")
  const size = ref()

  const dpr = (typeof window == 'undefined') ? 1.0 : window.devicePixelRatio


  function getSuffix() {
    if(props.noResize) return ''
    if(props.width && props.height) return `/rect-${(props.width*dpr)|0}-${(props.height*dpr)|0}`
    if(props.width) return `/width-${(props.width*dpr)|0}`
    if(props.height) return `/height-${(props.height*dpr)|0}`
    return ''
  }

  function updateUrl() {
    console.log("UPDATE URL!", upload.value)
    if(upload.value && upload.value.url) { // available upload
      size.value = { ...upload.value.size }
      url.value = upload.value.url
      return
    }
    if(!imageData.value) {
      loadImageData()
      return
    } else {
      const suffix = getSuffix()
      url.value = `/api/image/image/${props.image}${suffix}`
    }
  }

  if(!imageData.value) updateUrl()

  watch(() => upload.value && upload.value.url, () => updateUrl())
  watch(() => imageData.value, () => updateUrl())

  // TODO: support real dimmensions with clientWidth
</script>
