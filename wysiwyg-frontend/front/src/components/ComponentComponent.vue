<template>
  <node-view-wrapper>
    <ComponentEditor>
      <node-view-content class="content" />
    </ComponentEditor>
  </node-view-wrapper>
</template>

<script setup>
  import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
  import components from "./components.js";

  const props = defineProps(nodeViewProps)

  const { is, attrs } = props.node.attrs

  const ComponentEditor = components[is].editor
</script>

<style scoped>

</style>
