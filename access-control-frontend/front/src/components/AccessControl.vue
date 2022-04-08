<template>
  <div class="w-full sm:w-9 md:w-8 lg:w-6 surface-card p-4 shadow-2 border-round">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">
        Access Control
      </div>
    </div>
    <div class="grid formgrid p-fluid mb-2">
      <div class="p-field field mb-4 col-12 md:col-6" v-if="isMounted && sessionRolesVisible">
        <label for="publicAccess" class="block text-900 font-medium mb-2">Public access:</label>
        <Dropdown v-if="!multiRole" id="publicAccess" class="w-full" inputClass="w-full"
                  :options="['none'].concat(availableRoles)"
                  :optionLabel="optionLabel"
                  :modelValue="synchronizedPublicAccess.sessionRoles?.[0] ?? 'none'"
                  @update:modelValue="newValue => synchronizedPublicAccess.sessionRoles = [newValue]"
                  :feedback="false" toggleMask />
        <MultiSelect v-if="multiRole" id="publicAccess" class="w-full" inputClass="w-full"
                  :options="availableRoles"
                  :optionLabel="optionLabel"
                  v-model="synchronizedPublicAccess.sessionRoles"
                  :feedback="false" toggleMask />
      </div>
      <div class="p-field field mb-4 col-12 md:col-6" v-if="isMounted && userRolesVisible">
        <label for="userPublicAccess" class="block text-900 font-medium mb-2">Public access for users:</label>
        <Dropdown v-if="!multiRole" id="userPublicAccess" class="w-full" inputClass="w-full"
                  :options="['none'].concat(availableRoles)"
                  :optionLabel="optionLabel"
                  :modelValue="synchronizedPublicAccess.userRoles?.[0] ?? 'none'"
                  @update:modelValue="newValue => synchronizedPublicAccess.userRoles = [newValue]"
                  :feedback="false" toggleMask />
        <MultiSelect v-if="multiRole" id="userPublicAccess" class="w-full" inputClass="w-full"
                     :options="availableRoles"
                     :optionLabel="optionLabel"
                     v-model="synchronizedPublicAccess.userRoles"
                     :feedback="false" toggleMask />
      </div>
    </div>

    <div class="text-900 font-medium text-xl mb-3">Users</div>
    <div v-for="access of synchronizedAccesses" class="flex flex-row flex-wrap align-items-center">
      <div class="col-12 md:col-6 py-1">
        <UserIdentification :ownerType="access.ownerType" :owner="access.owner"
                            :data="access.identification" />
      </div>
      <div class="col-12 md:col-6 flex flex-row pr-0" v-if="isMounted">
        <Dropdown v-if="!multiRole" id="userPublicAccess" class="w-14em" inputClass="w-full"
                  :options="['none'].concat(availableRoles)"
                  :optionLabel="optionLabel"
                  :modelValue="slotProps.data.roles?.[0] ?? 'none'"
                  @update:modelValue="newValue => slotProps.data.roles = [newValue]"
                  :feedback="false" toggleMask />
        <MultiSelect v-if="multiRole" id="userPublicAccess" class="w-full" inputClass="w-full"
                     :options="availableRoles"
                     :optionLabel="optionLabel"
                     v-model="access.roles"
                     :feedback="false" toggleMask />
        <Button @click="deleteAccess(access)" icon="pi pi-times"
                class="p-button-rounded p-button-text p-button-plain ml-2 px-3"
                style="padding-top: 0.77rem" />
      </div>
    </div>

    <div>
<!--      <h2>publicAccess:</h2>
      <pre>{{ JSON.stringify(publicAccess, null, "  ") }}</pre>-->
      <h2>accesses:</h2>
      <pre>{{ JSON.stringify(accesses, null, "  ") }}</pre>
      <!--<h2>accessRequests:</h2>
      <pre>{{ JSON.stringify(accessRequests, null, "  ") }}</pre>-->
    </div>
  </div>
</template>

<script setup>
  import Button from "primevue/button"
  import Dropdown from "primevue/dropdown"
  import MultiSelect from "primevue/multiselect"

  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import ColumnGroup from 'primevue/columngroup'

  import { UserIdentification } from "@live-change/user-frontend"

  import { synchronized, synchronizedList } from "@live-change/vue3-components"

  import { useToast } from 'primevue/usetoast'
  import { useConfirm } from 'primevue/useconfirm'
  const confirm = useConfirm()
  const toast = useToast()

  const { object, objectType, paths, availableRoles, multiRole, sessionRolesVisible, userRolesVisible } = defineProps({
    object: {
      type: String,
      required: true
    },
    objectType: {
      type: String,
      required: true
    },
    paths: {
      type: Object,
      default: () => ({
        session_Session: (p, { session }) => p.userIdentification_Info({ session }),
        user_User: (p, { user }) => p.userIdentification_Info({ user })
      })
    },
    availablePublicRoles: {
      type: Array,
      default: () => ['writer', 'reader']
    },
    availableRoles: {
      type: Array,
      default: () => ['administrator', 'moderator', 'writer', 'reader']
    },
    multiRole: {
      type: Boolean,
      default: true
    },
    sessionRolesVisible: {
      type: Boolean,
      default: true
    },
    userRolesVisible: {
      type: Boolean,
      default: true
    }
  })

  function optionLabel(option) {
    if(option == 'none') return 'none'
    return option
  }

  import { computed, watch, ref, onMounted } from 'vue'

  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)


  import { path, live, actions } from '@live-change/vue3-ssr'

  const accessControlApi = actions().accessControl

  const [ publicAccess, accesses, accessRequests ] = await Promise.all([
    live(path().accessControl.objectOwnedPublicAccess({ object, objectType })),
    live(path().accessControl.objectRelatedAccesses({ object, objectType })
        .with(access => path().userIdentification.ownerOwnedIdentification({
          ownerType: access.ownerType, owner: access.owner
        }).bind('identification'))
    ),
    live(path().accessControl.objectRelatedAccessRequests({ object, objectType }))
  ])

  const synchronizedPublicAccess = synchronized({
    source: publicAccess,
    update: accessControlApi.setOrUpdateObjectOwnedPublicAccess,
    identifiers: { object, objectType },
    recursive: true,
    onSave: () => toast.add({ severity: 'info', summary: 'Public access saved', life: 1500 })
  }).value

  const synchronizedAccessesList = synchronizedList({
    source: accesses,
    update: accessControlApi.updateObjectRelatedAccess,
    delete: accessControlApi.deleteObjectRelatedAccess,
    identifiers: { object, objectType },
    objectIdentifiers: source => ({ access: source.to, object, objectType }),
    onSave: () => toast.add({ severity: 'info', summary: 'Public access saved', life: 1500 }),
    recursive: true
  })
  const synchronizedAccesses = synchronizedAccessesList.value

  watch(() => JSON.stringify(accesses.value, null, "  "), json => console.log("ACCESSES CHANGED!", json))


  function deleteAccess(access) {
    console.log("DELETE ACCESS", access)
    confirm.require({
      target: event.currentTarget,
      message: `Do you want to revoke user ${access.identification.name} access?`,
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      accept: async () => {
        await synchronizedAccessesList.delete({ access: access.to })
        /*await accessControlApi.deleteObjectRelatedAccess({
          access: access.to, object: access.object, objectType: access.objectType
        })*/
        toast.add({ severity:'info', summary: 'Access Revoked', life: 1500 })
      },
      reject: () => {
        toast.add({ severity:'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
      }
    })
  }

</script>
