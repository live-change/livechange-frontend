<template>
  <div class="w-full lg:w-6 md:w-9">
    <div class="surface-card p-4 shadow-2 border-round">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">
          Identification
        </div>
      </div>

      <div class="flex flex-wrap">
        <div class="relative" @click="openImageEditor">
          <Image v-if="userData?.image" :image="userData.image" class="mr-2 border-circle profile-image" domResize
                 width="200" height="200" />
          <img v-else :src="identiconUrl" class="mr-2 border-circle profile-image">
        </div>
        <div>
          <h2>Test</h2>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
  import { FileInput } from "@live-change/upload-frontend"
  import { ComponentDialog } from "@live-change/frontend-base"
  import { ImageEditor, Image } from "@live-change/image-frontend"
  import { useDialog } from 'primevue/usedialog'
  const dialog = useDialog()

  import { shallowRef } from 'vue'
  import { path, live, actions,  api as useApi } from '@live-change/vue3-ssr'

  const api = useApi()
  const [ ownerType, owner ] = api.client.value.user
      ? ['user_User', api.client.value.user]
      : ['session_Session', api.client.value.session]

  const dataPromise = live(path().userIdentification.sessionOrUserOwnedIdentification({
    sessionOrUserType: ownerType, sessionOrUser: owner
  }))

  const identiconUrl = `/api/identicon/jdenticon/${ownerType}:${owner}/28.svg`

  import { computed } from 'vue'

  function openImageEditor() {
    dialog.open(ComponentDialog, {
      props: {
        header: 'Image Editor',
        style: {
          width: '50vw',
        },
        breakpoints:{
          '960px': '75vw',
          '640px': '90vw'
        },
        modal: true,
        contentClass: "p-0"
      },
      data: {
        component: shallowRef(ImageEditor),
        props: {

        }
      }
    })
  }

  const [ userData ] = await Promise.all([ dataPromise ])

</script>

<style scoped>
  .profile-image {
    aspect-ratio: 1/1;
    width: 200px;
    max-width: 100%;
    height: auto;
    border: 1px solid gray;
  }
</style>
