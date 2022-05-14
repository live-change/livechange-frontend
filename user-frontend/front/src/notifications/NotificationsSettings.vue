<template>
  <div class="w-full lg:w-6 md:w-9" v-shared-element:form="{ duration: '300ms', includeChildren: true }">
    <div class="surface-card p-4 shadow-2 border-round">
      <div>
        <h1>Notifications settings</h1>
      </div>
      <div>
        <div>
          <h2>Invities</h2>
        </div>
        <div class="md:flex md:flex-row">
          <div class="flex flex-row md:flex-column align-items-center mb-3 md:col-4">
            <div class="flex-grow-1 md:mb-2">
              <i class="pi pi-at"></i>
              <span class="ml-2">Email</span>
            </div>
            <div class="">
              <InputSwitch v-model="checked"/>
            </div>
          </div>

          <div class="flex flex-row md:flex-column align-items-center mb-3 md:col-4">
            <div class="flex-grow-1 md:mb-2">
              <i class="pi pi-globe"></i>
              <span class="ml-2">Web</span>
            </div>
            <div class="">
              <InputSwitch v-model="checked"/>
            </div>
          </div>
          <div class="flex flex-row md:flex-column align-items-center mb-3 md:col-4">
            <div class="flex-grow-1 md:mb-2">
              <i class="pi pi-phone"></i>
              <span class="ml-2">SMS</span>
            </div>
            <div class="">
              <InputSwitch v-model="checked"/>
            </div>
          </div>
        </div>
        <div>
          <div>
            <h2>Messages</h2>
          </div>
          <div class="md:flex md:flex-row">
            <div class="flex flex-row md:flex-column align-items-center mb-3 md:col-4">
              <div class="flex-grow-1 md:mb-2">
                <i class="pi pi-at"></i>
                <span class="ml-2">Email</span>
              </div>
              <div class="">
                <InputSwitch v-model="checked"/>
              </div>
            </div>
            <div class="flex flex-row md:flex-column align-items-center mb-3 md:col-4">
              <div class="flex-grow-1 md:mb-2">
                <i class="pi pi-globe"></i>
                <span class="ml-2">Web</span>
              </div>
              <div class="">
                <InputSwitch v-model="checked"/>
              </div>
            </div>
            <div class="flex flex-row md:flex-column align-items-center mb-3 md:col-4">
              <div class="flex-grow-1 md:mb-2">
                <i class="pi pi-phone"></i>
                <span class="ml-2">SMS</span>
              </div>
              <div class="">
                <InputSwitch v-model="checked"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';
</script>