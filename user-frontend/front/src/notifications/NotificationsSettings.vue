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
        <div class="flex flex-wrap">
          <div class=" sm:flex-order-1 md:flex-order-1  lg:flex-order-1 col-6 md:col-4 lg:col-4">
            <h3>email</h3>
          </div>
          <div class=" sm:flex-order-2 md:flex-order-4  lg:flex-order-4 col-6 md:col-4 lg:col-4">
            <p></p><InputSwitch v-model="checked"/>
          </div>
          <div class=" sm:flex-order-3 md:flex-order-2 lg:flex-order-2 col-6 md:col-4 lg:col-4">
            <h3>web</h3>
          </div>
          <div class="sm:flex-order-4 md:flex-order-5 lg:flex-order-5 col-6 md:col-4 lg:col-4">
            <p></p><InputSwitch v-model="checked"/>
          </div>
          <div class="sm:flex-order-5 md:flex-order-3 lg:flex-order-3 col-6 md:col-4 lg:col-4">
            <h3>sms</h3>
          </div>
          <div class="sm:flex-order-6 md:flex-order-6 lg:flex-order-6 col-6 md:col-4 lg:col-4">
            <p></p> <InputSwitch v-model="checked"/>
          </div>
        </div>
        <div>
          <div>
            <h2>Messages</h2>
          </div>
          <div  class="flex flex-wrap ">
            <div class=" sm:flex-order-1 md:flex-order-1  lg:flex-order-1 col-6 md:col-4 lg:col-4">
              <h3>email</h3>
            </div>
            <div class=" sm:flex-order-2 md:flex-order-4  lg:flex-order-4 col-6 md:col-4 lg:col-4">
              <p></p><InputSwitch v-model="checked"/>
            </div>
            <div class=" sm:flex-order-3 md:flex-order-2 lg:flex-order-2 col-6 md:col-4 lg:col-4">
              <h3>web</h3>
            </div>
            <div class="sm:flex-order-4 md:flex-order-5 lg:flex-order-5 col-6 md:col-4 lg:col-4">
              <p></p><InputSwitch v-model="checked"/>
            </div>
            <div class="sm:flex-order-5 md:flex-order-3 lg:flex-order-3 col-6 md:col-4 lg:col-4">
              <h3>sms</h3>
            </div>
            <div class="sm:flex-order-6 md:flex-order-6 lg:flex-order-6 col-6 md:col-4 lg:col-4">
              <p></p> <InputSwitch v-model="checked"/>
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