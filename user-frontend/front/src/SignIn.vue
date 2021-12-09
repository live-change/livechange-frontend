<template>
  <div class="w-full lg:w-6 md:w-9" v-shared-element:form="{ duration: '300ms', includeChildren: true }">
    <div class="surface-card p-4 shadow-2 border-round">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">Welcome Back</div>
        <span class="text-600 font-medium line-height-3">Don't have an account?</span>
        <router-link :to="{ name: 'user:signUp' }"
                     class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
          Create today!</router-link>
      </div>

      <div>

        <div class="p-field mb-3">
          <label for="email" class="block text-900 font-medium mb-2">
            >Email address<
          </label>
          <InputText id="email" type="text" class="w-full p-invalid" aria-describedby="email-help" />
          <small id="email-help" class="p-error">email not found.</small>
        </div>

        <div class="p-field mb-3">
          <label for="password" class="block text-900 font-medium mb-2">Password (optional)</label>
          <Password id="password" class="w-full p-invalid" inputClass="w-full" toggleMask />

          <small id="password-help" class="p-error">password-error.</small>
        </div>

        <div class="flex align-items-center justify-content-between mb-6">
          <div class="flex align-items-center">
            <Checkbox id="rememberme" :binary="true" class="mr-2"></Checkbox>
            <label for="rememberme">Remember me</label>
          </div>
          <router-link :to="{ name: 'user:resetPassword' }"
                       class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
            Forgot password?
          </router-link>
        </div>

        <Button label="Sign In" icon="pi pi-user" class="w-full"></Button>

        <Divider align="center" class="my-4">
          <span class="text-600 font-normal text-sm">OR</span>
        </Divider>

        <Button label="Sign In with GitHub" icon="pi pi-github" class="w-full p-button-secondary mb-2"></Button>
        <Button label="Sign In with Google" icon="pi pi-google" class="w-full p-button-secondary mb-1"></Button>

      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  import InputText from "primevue/inputtext"
  import Checkbox from "primevue/checkbox"
  import Button from "primevue/button"
  import Divider from "primevue/divider"
  import Password from "primevue/password"



</script>

<style>

</style>
