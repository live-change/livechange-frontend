<template>
  <div class="w-full lg:w-6 md:w-9" v-shared-element:form="{ duration: '300ms', includeChildren: true }">

    <div class="surface-card p-4 shadow-2 border-round">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">Delete account</div>
      </div>

      <div>
        <p>
          Account deletion is irreversible, check the box below only if you are
          100% sure that you want to delete your account.
        </p>
        <div class="p-field-checkbox mb-3">
          <Checkbox id="deleteCheckbox" v-model="wantDelete" :binary="true" />
          <label for="deleteCheckbox" class="ml-2">I want to delete my account.</label>
        </div>

        <Button id="delete" label="Delete account" icon="pi pi-user-minus" class="p-button-lg"
                :disabled="!wantDelete" @click="deleteUser" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import Checkbox from "primevue/checkbox"
  import Button from "primevue/button"

  import { actions } from "@live-change/vue3-ssr"
  import { inject, ref } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()

  const workingZone = inject('workingZone')

  const wantDelete = ref(false)

  const { deleteMe } = actions().user

  function deleteUser() {
    if(!wantDelete.value) return
    workingZone.addPromise('deleteMe', (async () => {
      await deleteMe()
      router.push({ name: 'user:deleteFinished' })
    })())
  }

</script>

<style>

</style>
