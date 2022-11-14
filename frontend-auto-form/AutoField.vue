<template>
  <component v-if="fieldComponent && visible" :is="fieldComponent" v-bind="attributes"
             @update:modelValue="value => emit('update:modelValue', value)" />
  <div v-else-if="visible" class="field" :class="fieldClass" :style="fieldStyle">
    <label :for="uid">{{ label }}</label>
    <slot>
      <auto-input :modelValue="modelValue" :definition="definition"
                  :class="props.inputClass" :style="props.inputStyle"
                  :attributes="props.inputAttributes"
                  @update:modelValue="value => emit('update:modelValue', value)"
                  :id="uid" />
    </slot>
    <small v-if="validationResult" class="p-error">{{ validationResult }}</small>
  </div>
</template>

<script setup>

  import AutoInput from "./AutoInput.vue"

  import { inputs, types } from './config.js'
  import { computed, getCurrentInstance } from 'vue'
  import { toRefs } from '@vueuse/core'

  const props = defineProps({
    modelValue: {},
    error: {
      type: String
    },
    definition: {
      type: Object
    },
    name: {
      type: String
    },
    label: {
      type: String
    },
    class: {},
    style: {},
    inputClass: {},
    inputStyle: {},
    attributes: {
      type: Object,
      default: () => ({})
    },
    inputAttributes: {
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

  const uid = 'field_'+getCurrentInstance().uid.toFixed().padStart(6, '0')

  const emit = defineEmits(['update:modelValue'])

  const { error, definition, modelValue } = toRefs(props)

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

  import { validateData } from "@live-change/vue3-components"

  const validationResult = computed(() => {
    const validationResult = validateData(definition.value, modelValue.value, 'validation')
    const softValidationResult = validateData(definition.value, modelValue.value, 'softValidation')
    return validationResult || softValidationResult || error.value
  })

  const inputConfig = computed(() => {
    if(definition.value.input) return inputs[definition.value.input]
    if(definition.value.type) return types[definition.value.type]
    return inputs.default
  })

  const label = computed(() => props.label || definition.value.label || props.name)

  const fieldClass = computed(() => [inputConfig.value?.fieldClass, definition.value?.fieldClass, props.class, {
    'p-invalid': !!error.value
  }])
  const fieldStyle = computed(() => [inputConfig.value?.fieldStyle, definition.value?.fieldStyle, props.style])

  const configAttributes = computed(() => {
    const attributes = inputConfig.value?.fieldAttributes
    if(!attributes) return attributes
    if(typeof attributes == 'function') return attributes(definition.value)
    return attributes
  })

  const attributes = computed(() => ({
    ...(configAttributes.value),
    ...(props.attributes),
    label: props.label,
    modelValue: props.modelValue,
    definition: props.definition,
    class: fieldClass.value,
    style: fieldStyle.value,
    inputClass: [props.inputClass, { 'p-invalid': !!validationResult.value }],
    inputStyle: props.inputStyle,
    rootValue: props.rootValue,
    propName: props.propName,
  }))

  const fieldComponent = computed(() => inputConfig.value?.fieldComponent)


</script>

<style scoped>

</style>
