<template>
  <div class="w-full lg:w-6" v-shared-element:form="{ duration: '300ms', includeChildren: true }">
    <SettingsTabs />

    <div class="surface-card p-4 shadow-2 border-round">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">Change password</div>
      </div>

      <div v-if="isClientSide">
        <div class="p-field mb-3">
          <label for="password" class="block text-900 font-medium mb-2">Current password</label>
          <Password id="password" class="w-full p-invalid" inputClass="w-full" toggleMask />
          <small id="password-help" class="p-error">password-error.</small>
        </div>

        <div class="p-field mb-3">
          <label for="password" class="block text-900 font-medium mb-2">New password</label>
          <Password id="password" class="w-full p-invalid" inputClass="w-full" toggleMask>
            <template #footer>
              <Divider />
              <p class="p-mt-2">Suggestions</p>
              <ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
              </ul>
            </template>
          </Password>
          <small id="password-help" class="p-error">password-error.</small>
        </div>

        <div class="p-field mb-3">
          <label for="reenterPassword" class="block text-900 font-medium mb-2">Re-enter password</label>
          <Password  id="reenterPassword" class="w-full p-invalid" inputClass="w-full"
                     :feedback="false" toggleMask />
          <small id="reenterPassword-help" class="p-error">password-error.</small>
        </div>

        <Button label="Change password" icon="pi pi-key" class="w-full"></Button>

      </div>
    </div>


  </div>
</template>

<script setup>
import isClientSide from "./isClientSide.js"

import InputText from "primevue/inputtext"
import Checkbox from "primevue/checkbox"
import Button from "primevue/button"
import Divider from "primevue/divider"
import Password from "primevue/password"
import SettingsTabs from "./SettingsTabs.vue"

</script>

<style>

</style>
