<template>
  <component v-if="inputConfig && visible" :is="inputConfig.component" v-bind="attributes"
             @update:modelValue="updateValue" :class="inputClass" :style="inputStyle" />
  <div v-else-if="visible" class="font-bold text-red-600">
    No input found for definition:
    <pre style="white-space: pre-wrap; word-wrap: break-word;">{{ JSON.stringify(definition, null, "  ") }}</pre>
  </div>
</template>

<script setup>
  import { inputs, types } from './config.js'
  import { computed, inject } from 'vue'
  import { toRefs } from '@vueuse/core'

  const props = defineProps({
    modelValue: {
    },
    definition: {
      type: Object
    },
    class: {},
    style: {},
    properties: {
      type: Object,
      default: () => ({})
    },
    rootValue: {
      type: Object,
      default: () => ({})
    },
    propName: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const { definition, modelValue } = toRefs(props)

  const inputConfig = computed(() => {
    if(definition.value.input) return inputs[definition.value.input]
    if(definition.value.type) return types[definition.value.type]
    return inputs.default
  })

  const definitionIf = computed(() => {
    if(definition.value?.if) {
      if(definition.value?.if.function) {
        return eval(`(${definition.value.if.function})`)
      }
    }
    return false
  })

  const visible = computed(() => {
    if(!definition.value) return false
    if(definitionIf.value) {
      return definitionIf.value({
        source: definition.value,
        props: props.rootValue,
        propName: props.propName
      })
    }
    return true
  })

  const configAttributes = computed(() => {
    const attributes = inputConfig.value?.attributes
    if(!attributes) return attributes
    if(typeof attributes == 'function') return attributes(definition.value)
    return attributes
  })

  const attributes = computed(() => ({
    ...(configAttributes.value),
    ...(props.attributes),
    ...(definition.value.inputAttributes),
    modelValue: modelValue.value,
    definition: definition.value,
    rootValue: props.rootValue,
    propName: props.propName
  }))

  const inputClass = computed(() => [inputConfig.value?.inputClass, definition.value?.inputClass, props.class])
  const inputStyle = computed(() => [inputConfig.value?.inputStyle, definition.value?.inputStyle, props.style])

  function updateValue(value) {
    emit('update:modelValue', value)
  }

</script>

<style scoped>

</style>
