<template>
  <div class="mb-4">
    <div v-if="isAccessible">
      <div  class="mb-4">
        <div class="text-900 text-xl font-medium mb-2">
          Canonical Url
        </div>
        <div v-if="canonical">
          <div class="w-full flex flex-wrap flex-row align-items-center" v-for="url of redirects" :key="url.to">
            <span class="text-right overflow-hidden text-overflow-ellipsis mr-1">
              {{ canonical.domain || '*' }}
            </span>
            <span class="flex-grow-1">
              /{{ canonical.path }}
            </span>
            <Button icon="pi pi-pencil" label="Edit" class="p-button-warning" @click="" />
          </div>
        </div>
        <div v-else>
          <command-form service="url" action="takeUrl" v-slot="{ data }" :parameters="{ target, targetType }"
                        @done="handleTaken" keepOnDone v-if="isMounted">

            <div class="p-field mb-3">
              <label for="path" class="block text-900 font-medium mb-2">
                Path
              </label>
              <InputText id="url" type="text" class="w-full"
                         aria-describedby="email-help" :class="{ 'p-invalid': data.pathlError }"
                         placeholder="enter/absolute/path"
                         v-model="data.path" />
              <small id="path-help" class="p-error">{{ data.pathError }}</small>
            </div>
            <div class="p-field mb-3">
              <label for="domain" class="block text-900 font-medium mb-2">
                Domain (optional)
              </label>
              <InputText id="domain" type="text" class="w-full"
                         aria-describedby="email-help" :class="{ 'p-invalid': data.domainError }"
                         placeholder="any"
                         v-model="data.domain" />
              <small id="domain-help" class="p-error">{{ data.domainError }}</small>
            </div>

            <div class="flex flex-row flex-wrap">
              <Button label="Take Url" icon="pi pi-save" class="mr-2" type="submit" />
              <Button label="Generate Url" icon="pi pi-plus" type="button" @click="() => showGenerateDialog(data)"/>
            </div>

          </command-form>
        </div>
      </div>

      <div v-if="redirects.length > 0">
        <div class="text-900 text-xl font-medium mb-2">
          Redirects
        </div>
        <div class="w-full flex flex-wrap flex-row align-items-center" v-for="url of redirects" :key="url.to">
          <span class="text-right overflow-hidden text-overflow-ellipsis mr-1">
            {{ url.domain || '*' }}
          </span>
          <span class="flex-grow-1">
            /{{ url.path }}
          </span>
          <Button icon="pi pi-trash" label="Delete" class="p-button-danger" />
        </div>
      </div>
    </div>
    <div v-else>
      Urls editor access denied
    </div>
  </div>
</template>

<script setup>

  import Button from "primevue/button"
  import InputText from "primevue/inputtext"

  import { useToast } from 'primevue/usetoast'
  const toast = useToast()
  import { useConfirm } from 'primevue/useconfirm'
  const confirm = useConfirm()

  import { synchronized, synchronizedList } from "@live-change/vue3-components"

  import { computed, watch, ref, onMounted } from 'vue'

  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)

  const { target, targetType } = defineProps({
    target: {
      type: String,
      required: true
    },
    targetType: {
      type: String,
      required: true
    }
  })

  import { path, live, actions, serviceDefinition } from '@live-change/vue3-ssr'
  const urlsApi = actions().url

  const isAccessible = serviceDefinition('url').views.targetOwnedCanonical
  const isEditable = serviceDefinition('url').views.resetTargetOwnedCanonical

  function showGenerateDialog(data) {
    console.log("D", data)
  }

  function handleTaken(data) {
    console.log("TAKEN", data)
  }

  const [ canonical, redirects ] = isAccessible ? (await Promise.all([
    live(path().url.targetOwnedCanonical({ target, targetType })),
    live(path().url.targetOwnedRedirects({ target, targetType })
      .action('delete', ({ to, target, targetType }) =>
        path().url.deleteTargetOwnedRedirect({ redirect: to, target, targetType })
      )
    )
  ])) : [null, []]

</script>

<style scoped>

</style>
