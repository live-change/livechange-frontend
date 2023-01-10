<template>
<!--  <pre>{{ JSON.stringify(classInfo, null, "  ") }}</pre>-->
  <div class="flex flex-column flex-wrap w-full">
    <div v-if="editingPadding">
      <div class="flex flex-row align-items-center mb-2">
        <label class="mr-3" style="width: 4em">Padding:</label>
        <PaddingEditor :modelValue="classInfo.padding"
                       @update:modelValue="p => handleClassInfoUpdate({ padding: p })" />
      </div>
      <div class="flex flex-row align-items-center">
        <label class="mr-3" style="width: 4em">Margin:</label>
        <PaddingEditor :modelValue="classInfo.margin"
                       @update:modelValue="p => handleClassInfoUpdate({ margin: p })" />
      </div>
    </div>
    <div class="flex flex-column md:flex-row">
      <div class="flex-1 mr-2 flex flex-column">
        <div class="flex flex-row align-items-center flex-shrink-0">
          <label class="my-2 flex-grow-1">Classes:</label>
          <div class="flex flex-row align-items-center mr-4">
            <i class="pi pi-arrows-alt" style="font-size: 1.2rem"></i>
            <InputSwitch v-model="editingPadding" class="ml-2" />
          </div>
        </div>
        <AutoComplete :modelValue="classInfo.list"
                      @update:modelValue="l => handleClassInfoUpdate({ list: l })"
                      :separator="/ /" :multiple="true" :suggestions="classSuggestions"
                      @complete="ev => searchClasses(ev)"
                      class="autocomplete-w-full flex-grow-1" />
      </div>
      <div class="flex-1 flex flex-column">
        <div class="flex flex-row flex-shrink-0">
          <label class="my-2 flex-grow-1">Style:</label>
        </div>
        <prism-editor v-if="isMounted"
                      class="style-editor p-inputtext flex-grow-1" :highlight="highlightCss"
                      :style="{ height: (nodeStyleLines * 1.35 + 1.1) + 'em' }"
                      :modelValue="nodeStyle" @update:modelValue="handleStyleUpdate"
                      :readonly="false" :line-numbers="nodeStyleLines > 1" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import AutoComplete from "primevue/autocomplete"
  import InputSwitch from 'primevue/inputswitch';

  import PaddingEditor from "./PaddingEditor.vue"

  import 'vue-prism-editor/dist/prismeditor.min.css'
  import 'prismjs/themes/prism-coy.css'
  import * as Prism from 'prismjs/components/prism-core'
  import 'prismjs/components/prism-css'

  import { PrismEditor } from 'vue-prism-editor'

  import {ref, computed, watch, provide, defineEmits, defineProps, onMounted} from 'vue'
  import { toRefs } from '@vueuse/core'

  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)

  const props = defineProps({
    nodeControl: {
      type: Object,
      required: true
    }
  })

  const { nodeControl } = toRefs(props)

  const editingPadding = ref(false)

  function extract(info, regex, setter) {
    const rest = []
    const list = info.list
    for(let i = 0; i < list.length; i++) {
      const match = list[i].match(regex)
      if(match) setter(...match.slice(1))
        else rest.push(list[i])
    }
    info.list = rest
  }

  function extractClasses(info) {
    info.padding = { }
    if(editingPadding.value) {
      extract(info, /^p([xyltrb])?-(\d+)$/, (dir, size) => {
        if (dir) info.padding[dir] = size
        else info.padding.all = size
      })
      info.margin = {}
      extract(info, /^m([xyltrb])?-(\d+)$/, (dir, size) => {
        if (dir) info.margin[dir] = size
        else info.margin.all = size
      })
    }
  }
  function recombinePadding(list, padding, prefix = 'p') {
    if(padding.all !== undefined) list.push(`${prefix}-${padding.all}`)
    if(padding.x !== undefined) list.push(`${prefix}x-${padding.x}`)
    if(padding.y !== undefined) list.push(`${prefix}y-${padding.y}`)
    if(padding.t !== undefined) list.push(`${prefix}t-${padding.t}`)
    if(padding.r !== undefined) list.push(`${prefix}r-${padding.r}`)
    if(padding.b !== undefined) list.push(`${prefix}b-${padding.b}`)
    if(padding.l !== undefined) list.push(`${prefix}l-${padding.l}`)
  }
  function recombineClasses(info) {
    const { padding, margin, list } = info
    if(editingPadding.value) {
      recombinePadding(list, padding, 'p')
      recombinePadding(list, margin, 'm')
    }
  }

  const insertableClasses = ['flex', 'flex-grow-1']
  const nodeClass = computed(() => {
    console.log("nodeControl", nodeControl.value)
    return nodeControl.value.attrs.class
  })
  const classInfo = computed(() => {
    const list = nodeClass.value ? nodeClass.value.split(' ') : []
    const info = { list }
    extractClasses(info)
    return info
  })
  const classSuggestions = ref()
  function searchClasses(event) {
    const query = event.query.toLowerCase()
    console.log("SEARCH CLASSES", query)
    classSuggestions.value = [
      ...(insertableClasses.find(c => c == event.query) ? [] : [event.query]),
      ...(insertableClasses.filter((c) => {
        return c.toLowerCase().startsWith(query)
      }))
    ]
  }
  function handleClassInfoUpdate(change) {
    let info = JSON.parse(JSON.stringify(classInfo.value))
    info = { ...info, ...change }
    recombineClasses(info)
    console.log("INFO", info)
    nodeControl.value.updateAttributes({ attrs: {
      ...nodeControl.value.attrs,
      class: info.list.join(' ')
    }})
  }

  const nodeStyle = computed(() => {
    return nodeControl.value.attrs.style
  })
  const nodeStyleLines = computed(() => (nodeStyle.value || '').split('\n').length)
  function highlightCss(code) {
    return Prism.highlight(code, Prism.languages.css, "css")
  }
  function handleStyleUpdate(style) {
    console.log("NC", nodeControl.value)
    nodeControl.value.updateAttributes({ attrs: {
      ...nodeControl.value.attrs,
      style
    }})
  }

</script>

<style lang="scss">
  .autocomplete-w-full > ul {
    width: 100%;
  }
  .prism-editor__textarea {
    outline: 0 none;
    outline-offset: 0;
  }
  .style-editor:focus-within {
    box-shadow: 0 0 0 0.2rem #b7e0b8;
    border-color: #4CAF50;
  }
</style>
