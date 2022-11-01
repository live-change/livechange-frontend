<template>
  <slot v-if="url" :url="url" :target="url.target" :class="clazz" :style="style">
    <div class="w-full surface-card p-4 shadow-2 border-round">
      <h2>Url resolved:</h2>
      <pre>{{ JSON.stringify(url, null, "  ") }}</pre>
    </div>
  </slot>
  <slot v-else name="notFound" :path="urlPath" :class="clazz" :style="style">
    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
      <div style="background: radial-gradient(50% 109137.91% at 50% 50%, rgba(233, 30, 99, 0.1) 0%, rgba(254, 244, 247, 0) 100%);" class="text-center">
        <span class="bg-white text-pink-500 font-bold text-2xl inline-block px-3">404</span>
      </div>
      <div class="mt-6 mb-5 font-bold text-6xl text-900 text-center">Page Not Found</div>
      <p class="text-700 text-3xl mt-0 mb-6 text-center">Sorry, we couldn't find the page.</p>
      <div class="text-center">
        <Button class="p-button-text mr-2" label="Go Back" icon="pi pi-arrow-left" />
        <Button label="Go to Dashboard" icon="pi pi-home" />
      </div>
    </div>
  </slot>
</template>

<script setup>

  import Button from "primevue/button"

  import { computed, watch, ref, onMounted } from 'vue'
  import { toRefs } from "@vueuse/core"
  import { useHost } from "@live-change/frontend-base"

  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)

  const props = defineProps({
    path: {
      type: String,
      required: true
    },
    targetType: {
      type: String,
      default: 'content_Page'
    },
    fetchMore: {
      type: Array,
      default: () => []
    },
    class: {},
    style: {}
  })
  const { path: urlPath, targetType, fetchMore, class: clazz, style } = toRefs(props)

  const urlDomain = useHost()

  import { path, live } from '@live-change/vue3-ssr'
  import { useRouter, useRoute } from 'vue-router'
  const router = useRouter()
  const route = useRoute()

  const p = path()

  const liveUrlPath = (targetType, domain, urlPath, more) => {
    let fetchPath = p.url.urlsByTargetAndPath({targetType, domain, path: urlPath})
      //.with(url => p.url.targetOwnedCanonical({ targetType, target: url.target }).bind('canonical'))
      .with(url => url.type.$switch({
        'canonical': null,
        'redirect': p.url.targetOwnedCanonical({targetType, target: url.target})
      }).$bind('canonical'))
    for (let fetch of more) {
      fetchPath = fetchPath.with(url => fetch(url))
    }
    return fetchPath
  }


  const livePathWithDomain = computed(
    () => liveUrlPath(targetType.value, urlDomain, urlPath.value, fetchMore.value)
  )
  const livePathWithoutDomain = computed(
    () => liveUrlPath(targetType.value, '', urlPath.value, fetchMore.value)
  )
  const [domainUrls, globalUrls] = await Promise.all([
    live(livePathWithDomain),
    live(livePathWithoutDomain)
  ])
  const url = computed(() => {
    if(domainUrls.value.length > 0) return domainUrls.value[0]
    if(globalUrls.value.length > 0) return globalUrls.value[0]
    return null
  })

  if(typeof window != 'undefined') {
    watch(() => url && isMounted.value, async () => {
      if (url.value) {
        if (url.value.type == 'redirect') {
          const canonical = url.value.canonical
          const next = {
            name: route.name,
            params: {
              path: canonical.path,
            },
            hash: route.hash,
            query: route.query
          }
          if (canonical.domain && url.value.canonical.domain != urlDomain) {
            const href = router.resolve(next).href
            window.location.href = `${document.location.protocol}//${canonical.domain}${href}`
          } else {
            router.push(next)
          }
        }
      }
    })
  }

</script>

<style scoped>

</style>
