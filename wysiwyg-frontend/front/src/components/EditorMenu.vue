<template>
  <div class="sticky" style="top: 90px; z-index: 1">
    <slot name="before" />
    <div class="surface-card p-1 shadow-2 border-round flex flex-row flex-wrap">

      <slot name="begin" />

      <div class="p-buttonset mr-1 mb-1">
        <Button v-if="config.marks.bold" label="B" class="p-button-sm font-bold"
                :class="{ 'p-button-outlined': !editor.isActive('bold')  }"
                @click="editor.chain().focus().toggleBold().run()" />
        <Button v-if="config.marks.italic" label="I" class="p-button-sm font-italic"
                :class="{ 'p-button-outlined': !editor.isActive('italic')  }"
                @click="editor.chain().focus().toggleItalic().run()" />
        <Button v-if="config.marks.underline" label="U" class="p-button-sm underline"
                :class="{ 'p-button-outlined': !editor.isActive('underline')  }"
                @click="editor.chain().focus().toggleUnderline().run()" />
        <Button v-if="config.marks.strike" label="S" class="p-button-sm line-through"
                :class="{ 'p-button-outlined': !editor.isActive('strike')  }"
                @click="editor.chain().focus().toggleStrike().run()" />
      </div>

      <div class="p-buttonset mr-1 mb-1">
        <Button v-if="config.nodes.bulletList" icon="fa-solid fa-list-ul" class="p-button-sm"
                :class="{ 'p-button-outlined': !editor.isActive('bulletlist')  }"
                @click="editor.chain().focus().toggleBulletList().run()" />
        <Button v-if="config.nodes.orderedList" icon="fa-solid fa-list-ol" class="p-button-sm"
                :class="{ 'p-button-outlined': !editor.isActive('orderedlist')  }"
                @click="editor.chain().focus().toggleOrderedList().run()" />
      </div>

      <div v-if="config.nodes.heading" class="p-buttonset mr-1 mb-1">
        <Button label="H1" class="p-button-sm"
                :class="{ 'p-button-outlined': !editor.isActive('heading', { level: 1 })  }"
                @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" />
        <Button label="H2" class="p-button-sm"
                :class="{ 'p-button-outlined': !editor.isActive('heading', { level: 2 })  }"
                @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" />
        <Button label="H3" class="p-button-sm"
                :class="{ 'p-button-outlined': !editor.isActive('heading', { level: 3 })  }"
                @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" />
        <Button label="H4" class="p-button-sm"
                :class="{ 'p-button-outlined': !editor.isActive('heading', { level: 4 })  }"
                @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" />
        <Button label="H5" class="p-button-sm"
                :class="{ 'p-button-outlined': !editor.isActive('heading', { level: 5 })  }"
                @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" />
        <Button label="H6" class="p-button-sm"
                :class="{ 'p-button-outlined': !editor.isActive('heading', { level: 6 })  }"
                @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" />
      </div>

      <div class="p-buttonset mr-1 mb-1">
        <Button v-if="config.nodes.blockquote" icon="fa-solid fa-quote-left" class="p-button-sm"
                :class="{ 'p-button-outlined': !editor.isActive('blockquote')  }"
                @click="editor.chain().focus().toggleBlockquote().run()" />
        <Button v-if="config.nodes.codeBlock" icon="fa-solid fa-code" class="p-button-sm"
                :class="{ 'p-button-outlined': !editor.isActive('codeblock')  }"
                @click="editor.chain().focus().toggleCodeBlock().run()" />
      </div>

      <div class="p-buttonset mr-1 mb-1">
        <Button v-if="config.nodes.hardBreak" label="BR" class="p-button-sm p-button-outlined"
                @click="editor.chain().focus().setHardBreak().run()" />
        <Button v-if="config.nodes.horizontalRule" label="HR" class="p-button-sm p-button-outlined"
                @click="editor.chain().focus().setHorizontalRule().run()" />
      </div>

  <!--    <div class="p-buttonset mr-1 mb-1">-->
  <!--      <Button v-if="config.nodes.hardBreak" icon="pi pi-image" class="p-button-sm"
                :class="{ 'p-button-outlined': true }"
                @click="editor.chain().focus().setImage().run()" />-->
        <FileInput @input="handleImageUpload" class="inline-block"
                   accept="image/png,image/jpeg,image/webp,.jpg,.jpeg,.png,.webp">
          <Button v-if="config.nodes.image" icon="pi pi-image" class="p-button-sm p-button-outlined mr-1 mb-1" />
        </FileInput>
  <!--    </div>-->

      <Button v-if="config.nodes.component" label="Component"
              class="p-button-sm p-button-primary p-button-outlined inline-block mr-1 mb-1"
              @click="openComponentMenu" />

      <span v-if="saveState"
            class="p-button p-component p-button-sm p-button-outlined p-button-secondary cursor-auto
             inline-block mr-1 mb-1"
            style="width: 100px">
        <span v-if="saveState == 'saving'" class="inline-block mr-2 relative" style="width: 20px">
          &nbsp;
          <ProgressSpinner class="absolute"
                           style="width: 22px; height: 22px; top: -2px; left: 0"
                           strokeWidth="4" fill="var(--surface-ground)" animationDuration=".5s" />
        </span>

        <span v-else class="pi pi-check p-button-icon p-button-icon-left"></span>
        <span class="p-button-label">{{ saveState[0].toUpperCase() + saveState.slice(1) }}</span>
      </span>

      <slot name="end" />

    </div>
    <slot name="after" />
    <OverlayPanel ref="insertComponentOverlay" style="width: 450px" :breakpoints="{'960px': '75vw'}">
      <ComponentsMenu :config="config" @selected="(n,c) => handleComponentSelected(n,c)" />
    </OverlayPanel>
<!--    <div class="surface-card p-1 shadow-2" style="width: 450px">
      <h3>components:</h3>
      <ComponentsMenu :config="config" />
    </div>-->
  </div>
</template>

<script setup>
  import Button from "primevue/button"
  import ProgressSpinner from "primevue/progressspinner"
  import OverlayPanel from 'primevue/overlaypanel'

  import ComponentsMenu from "./ComponentsMenu.vue"
  import { inject, getCurrentInstance, ref } from "vue"
  import { toRefs } from "@vueuse/core"
  import { uploadImage } from "@live-change/image-frontend"
  import { FileInput } from "@live-change/upload-frontend"

  const appContext = getCurrentInstance().appContext
  const workingZone = inject('workingZone')

  const props = defineProps({
    editor: {
      type: Object,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    saveState: {
      type: String,
      default: null
    },
    availableComponents: {
      type: Array,
      default: () => []
    }
  })

  const { editor, config, saveState } = toRefs(props)

  async function handleImageUpload(file) {
    const upload = uploadImage('test', { file },
        { preparedPreview: true, appContext, generateId: true })
    await workingZone.addPromise('disconnectContact', (async () => {
      editor.value.chain().focus().setImage({ image: upload.id }).run()
      await upload.prepare()
    })())
    console.log("START UPLOAD!")
    await upload.upload()
  }

  const insertComponentOverlay = ref()
  function openComponentMenu(event) {
    insertComponentOverlay.value.show(event)
  }
  function handleComponentSelected(name, component) {
    insertComponentOverlay.value.hide()
    editor.value.chain().focus().insertContent({
      type: 'component',
      attrs: {
        is: name,
        attrs: component.initialAttrs
      },
      content: [
        { type: 'paragraph', content: [
            { type: 'text', text: 'test' }
        ] }
      ]
    }).run()
    //editor.value.chain().focus().setNode('component', { is: component }).run()
  }

  if(typeof window != 'undefined') window.editor = editor.value
</script>

<style scoped>
  .p-buttonset .p-button:not(:last-child) { /* buttonset bug fix */
    border-right: 0 none !important;
  }
</style>
