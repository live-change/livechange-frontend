<template>
  <div>
    <DocumentEditor targetType="Example" target="one" :type="'rich'" :purpose="'test'"
                    :initialContent="emptyContent"
                    :config="contentConfig" />
  </div>
</template>

<script setup>

  import DocumentEditor from "./components/DocumentEditor.vue"
  import { ref } from 'vue'
  import { basicMarks, messageNodes, richEditorNodes } from "./components/contentConfig.js"

  const contentConfig = {
    marks: {
      ...basicMarks
    },
    nodes: {
      //...messageNodes,
      ...richEditorNodes
    }
  }

  const document = 'testDocument'

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

<style scoped>

</style>
