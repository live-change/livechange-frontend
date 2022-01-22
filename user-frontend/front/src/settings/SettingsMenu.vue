<template>
  <div class="flex flex-column h-full">
    <div class="overflow-y-auto">
      <ul class="list-none p-2 m-0">
        <li>
          <div class="p-3 text-500 font-medium">SETTINGS</div>
        </li>

        <li class="hidden md:block">
          <router-link :to="{ name: 'user:settings' }"
                       :class="route.name == 'user:settings' ? 'text-blue-500' : 'text-700'"
                       v-ripple
                       class="flex align-items-center cursor-pointer p-3 hover:surface-100
                          border-round transition-colors transition-duration-150 p-ripple no-underline">
            <i class="pi pi-id-card mr-2"></i>
            <span class="font-medium">General Settings</span>
          </router-link>
        </li>

        <li>
          <a v-ripple class="flex align-items-center cursor-pointer p-3 hover:surface-100
                  border-round transition-colors transition-duration-150 p-ripple">
            <i class="pi pi-exclamation-circle mr-2"></i>
            <span class="font-medium">Notifications</span>
          </a>
        </li>

      </ul>

      <ul class="list-none p-2 m-0 border-top-1 surface-border">
        <li>
          <div class="p-3 text-500 font-medium">AUTHORIZATION</div>
        </li>
        <li>
          <router-link :to="{ name: 'user:connected' }"
                       :class="route.name == 'user:connected' ? 'text-blue-500' : 'text-700'"
                       v-ripple
                       class="flex align-items-center cursor-pointer p-3 text-700 hover:surface-100
                         border-round transition-colors transition-duration-150 p-ripple  no-underline">
            <i class="pi pi-user mr-2"></i>
            <span class="font-medium">Connected Accounts</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'user:changePassword' }"
                       :class="route.name == 'user:changePassword' ? 'text-blue-500' : 'text-700'"
                       v-ripple
                       class="flex align-items-center cursor-pointer p-3 text-700 hover:surface-100
                         border-round transition-colors transition-duration-150 p-ripple no-underline">
            <i class="pi pi-key mr-2"></i>
            <span class="font-medium">Change Password</span>
          </router-link>
        </li>
      </ul>

      <ul class="list-none p-2 m-0 border-top-1 surface-border">
        <li>
          <router-link :to="{ name: 'user:delete' }"
                       :class="route.name == 'user:delete' ? 'text-blue-500' : 'text-700'"
                       v-ripple
                       class="flex align-items-center cursor-pointer p-3 text-700 hover:surface-100
                             border-round transition-colors transition-duration-150 p-ripple no-underline">
            <i class="pi pi-trash mr-2"></i>
            <span class="font-medium">Delete Account</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!--        <div class="p-2 mt-auto border-top-1 surface-border">
              <ul class="list-none p-2 m-0 hidden origin-bottom animation-duration-150">
                <li>
                  <a v-ripple class="flex align-items-center cursor-pointer p-3 text-700 hover:surface-100
                      border-round transition-colors transition-duration-150 p-ripple">
                    <i class="pi pi-user mr-2"></i>
                    <span class="font-medium">Profile</span>
                  </a>
                </li>
                <li>
                  <a v-ripple class="flex align-items-center cursor-pointer p-3 text-700 hover:surface-100
                      border-round transition-colors transition-duration-150 p-ripple">
                    <i class="pi pi-cog mr-2"></i>
                    <span class="font-medium">Settings</span>
                  </a>
                </li>
                <li>
                  <a v-ripple class="flex align-items-center cursor-pointer p-3 text-700 hover:surface-100
                      border-round transition-colors transition-duration-150 p-ripple">
                    <i class="pi pi-sign-out mr-2"></i>
                    <span class="font-medium">Sign Out</span>
                  </a>
                </li>
              </ul>
              <a v-ripple class="p-3 flex align-items-center cursor-pointer text-700 hover:surface-100
                  border-round transition-colors transition-duration-150 p-ripple"
                 v-styleclass="{ selector: '@prev', enterClass: 'hidden', enterActiveClass: 'scalein',
                   leaveToClass: 'hidden', leaveActiveClass: 'fadeout' }">
                <img src="/images/empty-user-photo.svg" class="mr-2 border-circle" style="width: 28px; height: 28px"/>
                <span class="font-medium">Amy Elsner</span>
                <i class="pi pi-chevron-up ml-auto"></i>
              </a>
            </div>-->
  </div>
</template>

<script setup>

  import { useRoute } from 'vue-router'
  const route = useRoute()

</script>

<style scoped>

</style>