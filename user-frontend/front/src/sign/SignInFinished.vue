<template>
  <div class="w-full lg:w-6 md:w-9" v-shared-element:form="{ duration: '300ms', includeChildren: true }">
    <div class="surface-card border-round shadow-2 p-4">
      <div class="text-900 font-medium mb-3 text-xl mb-4">Signed In</div>
      <p class="mt-0 p-0 line-height-3">Congratulations! You have successfully logged in to your account.</p>
      <div v-if="afterSignIn" class="flex flex-row align-items-center">
        <router-link :to="afterSignIn" class="no-underline">
          <Button label="Next" v-ripple />
        </router-link>

      </div>
    </div>
  </div>
</template>

<script setup>
  import Button from 'primevue/button'

  import { onMounted, ref } from 'vue'
  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)

  import { computed } from 'vue'

  const afterSignIn = computed( () => isMounted.value && localStorage.redirectAfterSignIn )
</script>

<style>

</style>
