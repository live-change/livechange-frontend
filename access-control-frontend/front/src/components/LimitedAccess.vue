<template>
  <slot v-if="!authorized" name="blocked" :authorized="authorized" :roles="accessRoles" :accesses="accesses">
    <div class="flex align-items-start p-4 bg-pink-100 border-round border-1 border-pink-300 mb-4">
      <i class="pi pi-times-circle text-pink-900 text-2xl mr-3" />
      <div class="mr-3">
        <div class="text-pink-900 font-medium text-xl mb-3 line-height-1">Not authorized</div>
        <p class="m-0 p-0 text-pink-700">
          You do not have sufficient privileges to use this feature of this object.
        </p>
      </div>
    </div>
  </slot>
  <BlockUI :blocked="!authorized">
    <slot :authorized="authorized" :roles="accessRoles" :accesses="accesses"></slot>
  </BlockUI>
</template>

<script setup>

  import BlockUI from 'primevue/blockui'

  const props = defineProps({
    objectType: {
      type: String,
      default: null
    },
    object: {
      type: String,
      default: null
    },
    objects: {
      type: Array,
      default: () => []
    },
    requiredRoles: {
      type: Array,
      default: () => []
    },
    styleClass: {
      default: ""
    }
  })

  const { objectType, object, objects, requiredRoles } = props

  const allObjects = ((objectType && object) ? [{ objectType, object }] : []).concat(objects || [])

  import { provide, computed } from 'vue'
  import { live, path } from '@live-change/vue3-ssr'

  const [ accesses ] = await Promise.all([
    live(
      path().accessControl.myAccessesTo({ objects: allObjects })
    )
  ])

  const accessRoles = computed(() => {
    const accessesList = accesses.value.slice()
    const firstAccess = accessesList.shift()
    let roles = firstAccess.roles
    for(const access of accessesList) {
      roles = roles.filter(role => access.roles.includes(role))
    }
    return roles
  })

  const authorized = computed(() => {
    const clientRoles = accessRoles.value
    for(const requiredRolesOption of requiredRoles) {
      if((Array.isArray(requiredRolesOption) ? requiredRolesOption : [requiredRolesOption])
        .every(role => clientRoles.includes(role))
      ) return true
    }
    return false
  })

</script>

<style scoped>

</style>
