<template>
  <Accordion v-if="pageData" :multiple="true" class="w-full">
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

  <DocumentEditor v-if="pageData" targetType="content_Page" :target="pageId"
                  :config="contentConfig" type="content" v-model:saveState="saveState" v-model:version="version">
    <template #menuEnd="{}">

      <Button icon="pi pi-eye" label="Preview" class="p-button-secondary p-button-sm mr-1 mb-1" />

      <div class="p-buttonset mr-1 mb-1 border-round">
        <button type="button"
                class="p-button p-component p-button-sm p-button-outlined p-button-secondary cursor-auto inline-block"
                :class="{ 'p-disabled': saveState == 'saving' }">
          <span class="pi p-button-icon p-button-icon-left"
                :class="[stateSave == 'saving' ? 'pi-sync' : 'pi-hashtag' ]" />
          <span class="p-button-label">{{ ( version ?? 0 ).toFixed().padStart(10, '0') }}</span>
        </button>
        <Button icon="pi pi-save" label="Publish" class="p-button-success p-button-sm" type="button"
                :disabled="saveState == 'saving'" @click="publish" />
      </div>

    </template>
  </DocumentEditor>

  <NotFound v-if="pageData === null" />
</template>

<script setup>

  import Accordion from 'primevue/accordion'
  import AccordionTab from 'primevue/accordiontab'
  import Button from 'primevue/button'

  import { UrlsInfo, Urls, NotFound } from '@live-change/url-frontend'
  import { DocumentEditor, EditorMenu } from "@live-change/wysiwyg-frontend"
  import contentConfig from "./contentConfig.js";

  import { computed, watch, ref, onMounted, inject } from 'vue'
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

  const saveState = ref()
  const version = ref()

  import { useToast } from 'primevue/usetoast'
  const toast = useToast()
  import { useConfirm } from 'primevue/useconfirm'
  const confirm = useConfirm()

  const workingZone = inject('workingZone')

  import { useApi, path, live } from '@live-change/vue3-ssr'

  const api = useApi()

  const p = path()

  const livePagePath = computed(
    () =>  p.content.page({ page: pageId.value })
  )
  const liveCanonicalUrlPath = computed(
    () =>  p.url.targetOwnedCanonical({ targetType: 'content_Page', target: pageId.value })
  )
  const [pageData, canonicalUrlData] = await Promise.all([
    live(livePagePath),
    live(liveCanonicalUrlPath)
  ])

  function publish() {
    const snapshotVersion = version.value

    confirm.require({
      target: event.currentTarget,
      message: `Do you want to publish this content version ${snapshotVersion} to page `+
        `${canonicalUrlData.value.domain ?? '*'}/${canonicalUrlData.value.path}?`,
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      accept: async () => {
        api.actions.content.publish({
          objectType: 'content_Page', object: pageId.value, version: snapshotVersion, type: 'content'
        }).then(() => {
          toast.add({ severity: 'success', summary: 'Published', detail: 'Page published', life: 3000 })
        }).catch(e => {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Error publishing page', life: 3000 })
        })
      },
      reject: () => {
        toast.add({ severity:'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
      }
    })


  }

</script>

<style scoped>

</style>
