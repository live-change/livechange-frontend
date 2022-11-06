<template>
  <div class="relative">
    <slot v-if="editor" name="menu" :editor="editor">
      <EditorMenu :editor="editor" :config="config" />
    </slot>
    <editor-content :editor="editor" class="content" />
  </div>
</template>

<script setup>

  import { useEditor, EditorContent } from '@tiptap/vue-3'

  import { ref, computed, watch, provide, defineEmits, defineProps } from 'vue'
  import { toRefs } from '@vueuse/core'
  import EditorMenu from "./EditorMenu.vue"
  import { getExtensions } from "./contentConfigExtensions.js"
  import { getSchemaSpecFromConfig } from "./schemaJson.js"

  const props = defineProps({
    modelValue: {
      type: String,
      default: JSON.stringify({ type: 'doc', content: [ ] })
    },
    config: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const extensions = getExtensions(props.config)

  const editor = useEditor({
    content: JSON.parse(props.modelValue),
    extensions,
    onUpdate: ({ editor, transaction }) => {
      console.log("EDITOR UPDATE", editor, transaction)
      const editorJson = JSON.stringify(editor.getJSON())
      emit('update:modelValue', editorJson)
      emit('update', { editor, transaction })
    }
  })

  const { modelValue, config } = toRefs(props)

  watch(() => modelValue.value, value => {
    const editorJson = JSON.stringify(editor.value.getJSON())
    const isSame = editorJson === value
    if (isSame) return
    editor.commands.setContent(JSON.parse(value), false)
  })

  const schemaSpec = ref(getSchemaSpecFromConfig(props.config))

  provide('wysiwyg', {})

</script>

<style lang="scss">
  .ProseMirror {
    > * + * {
      margin-top: 0.75em;
    }

    code {
      display: block;
      white-space: pre-wrap;
      font-size: 0.8rem;
      padding: 0.75rem 1rem;
      background-color:#e9ecef;
      color: #495057;
    }
  }

  .content {
    padding: 1rem 0 0;

    h3 {
      margin: 1rem 0 0.5rem;
    }

    pre {
      border-radius: 5px;
      color: #333;
    }

    code {
      display: block;
      white-space: pre-wrap;
      font-size: 0.8rem;
      padding: 0.75rem 1rem;
      background-color:#e9ecef;
      color: #495057;
    }

    img {
      width: 100%;
    }

  }

</style>
