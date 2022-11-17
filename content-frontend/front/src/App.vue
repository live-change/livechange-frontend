<template>
  <view-root>
    <template #navbar>
      <NavBar />
    </template>
  </view-root>
</template>

<script setup>
  import 'primevue/resources/themes/saga-green/theme.css'
  import "@fortawesome/fontawesome-free/css/all.min.css"

  import ViewRoot from "@live-change/frontend-base/ViewRoot.vue"
  import NavBar from "./NavBar.vue"

  import { useI18n } from 'vue-i18n'
  const i18n = useI18n()

  import { useMeta } from 'vue-meta'
  const { meta } = useMeta({
    title: 'Title',
    htmlAttrs: {
      lang: i18n.locale.value,
      amp: true
    }
  })

  import { watch } from 'vue'
  import { client as useClient } from '@live-change/vue3-ssr'
  const client = useClient()
  watch(client, (newClient, oldClient) => {
    console.log("WATCH CLIENT", oldClient, '=>', newClient)
  })

  import { useApi } from '@live-change/vue3-ssr'
  const api = useApi()
  import emailValidator from "@live-change/email-service/clientEmailValidator.js"
  import passwordValidator from "@live-change/password-authentication-service/clientPasswordValidator.js"
  api.validators.email = emailValidator
  api.validators.password = passwordValidator

</script>
