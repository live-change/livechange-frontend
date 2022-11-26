<template>
  <div class="wysiwyg">
    <DocumentEditor targetType="Example" :target="target" :type="'page'" :purpose="'test'"
                    :initialContent="emptyContent"
                    :config="contentConfig" />
  </div>
</template>

<script setup>

  import DocumentEditor from "./components/DocumentEditor.vue"
  import { ref } from 'vue'
  import { basicMarks, messageNodes, richEditorNodes, pageNodes } from "./components/contentConfig.js"
  import { toRefs } from '@vueuse/core'

  const props = defineProps({
    target: {
      type: String,
      default: 'one'
    }
  })

  const { target } = toRefs(props)

  const contentConfig = {
    marks: {
      ...basicMarks
    },
    nodes: {
      //...messageNodes,
      //...richEditorNodes
      ...pageNodes
    }
  }

  const emptyContent = {
    "type": "doc",
    "content": [].concat(new Array(2).fill(
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "test"
          },
          {
            "type": "text",
            "marks": [
              {
                "type": "bold"
              }
            ],
            "text": "est"
          }
        ]
      }
    ))
  }

</script>

<style lang="scss">
  .wysiwyg {

    .ProseMirror:focus {
      outline: none;
    }

  }
</style>
