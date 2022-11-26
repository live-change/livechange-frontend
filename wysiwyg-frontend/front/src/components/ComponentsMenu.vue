<template>
  <div>
    <div class="px-2 pb-2">
      <span class="p-input-icon-left w-full flex">
          <i class="pi pi-search flex-shrink-0" />
          <InputText type="text" v-model="searchQuery" placeholder="Search" class="flex-grow-1" v-focus />
      </span>
    </div>
    <div class="overflow-auto" style="max-height: 75vh">
  <!--    <div v-for="i in [1,2,3,4,5,6,7,8,9,10]">-->
        <div v-for="([ name, component ], index) in searchResults" :key="name"
             class="flex flex-wrap relative cursor-pointer hover:surface-100"
             @click="() => emit('selected', name)" >
          <div class="w-3 ml-2 mr-2 my-1" style="aspect-ratio: 1/1">
            <div class="pointer-events-none w-6 absolute p-1"
                 style="aspect-ratio: 1/1; transform: scale(0.5); transform-origin: 0 0;">
              <ContentView :config="config" :content="getTestContent(name, component)" style="aspect-ratio: 1/1" />
            </div>
          </div>
          <div class="ml-2">
            <h3>{{ name[0].toUpperCase() + name.slice(1) }}</h3>
            <p>{{ component.description }}</p>
          </div>
        </div>
  <!--    </div>-->
    </div>
  </div>
</template>

<script setup>
  import InputText from "primevue/inputtext"

  import ContentView from "./ContentView.js"
  import components from "./components.js"

  import { ref, computed } from 'vue'

  const props = defineProps({
    config: {
      type: Object,
      required: true
    }
  })

  const { config } = props

  const emit = defineEmits(['selected'])

  const searchQuery = ref('')

  const searchResults = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if(!query) return Object.entries(components)
    const byName = Object.entries(components).filter(([name, component]) => {
      return name.toLowerCase().includes(query)
    })
    const byDescription = Object.entries(components).filter(([name, component]) => {
      return (component.description || '').toLowerCase().includes(query)
    }).filter(([name, component]) => !byName.find(([name2]) => name == name2))
    return [...byName, ...byDescription]
  })

  function getTestContent(name, component) {
    return {
      "type": 'component',
      "attrs": {
        "is": name,
        "attrs": {
          ...component.previewAttrs
        }
      },
      "content": component.previewContent ? [
        {
          "type": "heading",
          "attrs": {
            "level": 3
          },
          "content": [
            {
              "type": "text",
              "text": name[0].toUpperCase() + name.slice(1)
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": component.description
            }
          ]
        }
      ] : [
        {
          "type": "text",
          "text": component.description
        }
      ]
    }
  }

</script>

<style scoped>

</style>
