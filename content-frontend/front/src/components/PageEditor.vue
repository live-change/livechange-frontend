<template>
  <Accordion :multiple="true" class="w-full">
    <AccordionTab>
      <template #header>
        <UrlsInfo targetType="content_Page" :target="pageId" class="w-full" />
      </template>
      <Urls :key="pageId" targetType="content_Page" :target="pageId" />
    </AccordionTab>
<!--<AccordionTab header="Header II">
      Content
    </AccordionTab>
    <AccordionTab header="Header III">
      Content
    </AccordionTab>-->
  </Accordion>

  <div class="surface-card p-1 shadow-2 border-round sticky flex flex-row flex-wrap mt-1 mb-1 w-full">

  </div>

  <DocumentEditor :document="document" :config="contentConfig" type="content" />
</template>

<script setup>

  import Accordion from 'primevue/accordion'
  import AccordionTab from 'primevue/accordiontab'

  import { UrlsInfo, Urls } from '@live-change/url-frontend'
  import { DocumentEditor } from "@live-change/wysiwyg-frontend"
  import contentConfig from "./contentConfig.js";

  import { computed, watch, ref, onMounted } from 'vue'
  import { toRefs } from "@vueuse/core"


  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)

  const props = defineProps({
    pageId: {
      type: String,
      required: true
    },
    class: {},
    style: {}
  })
  const { pageId, class: clazz, style } = toRefs(props)

  const document = computed(() => `${JSON.stringify('content_Page')}:${JSON.stringify(pageId.value)}`)

  import { path, live } from '@live-change/vue3-ssr'
  const p = path()


</script>

<style scoped>

</style>
