<template>
  <component v-if="inputConfig" :is="inputConfig.component" v-bind="properties" @update:modelValue="updateValue"
             :class="props.class" :style="props.style"  />
  <div v-else class="font-bold text-red-600">No input found for definition {{ JSON.stringify(definition) }}</div>
</template>

<script setup>
  import { inputs, types } from './config.js'
  import { computed, inject } from 'vue'

  const props = defineProps({
    modelValue: {
    },
    definition: {
      type: Object
    },
    name: {
      type: String
    },
    class: {
      type: String
    },
    style: {
      type: String
    },
    properties: {
      type: Object,
      default: () => ({})
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const form = inject('form')

  const value = computed(() => props.name ? form.getFieldValue(props.name) : props.modelValue)
  const definition = computed(() => props.name ? form.getFieldDefinition(props.name) : props.definition)
  const inputConfig = computed(() => {
    console.log("definition", definition.value)
    if(definition.value.input) return inputs[definition.value.input]
    if(definition.value.type) return types[definition.value.type]
    return inputs.default
  })

  const properties = computed(() => ({
    ...(inputConfig.value.properties),
    ...(props.properties),
    modelValue: value.value
  }))

  function updateValue(value) {
    if(props.name) form.setFieldValue(props.name, value)
    emit('update:modelValue', value)
  }

</script>

<style scoped>

</style>
