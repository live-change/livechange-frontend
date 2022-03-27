<template>
  <div class="surface-card p-4 shadow-2 border-round">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">
        Access Control
      </div>
    </div>
    <div class="p-field mb-3" v-if="isMounted && sessionRolesVisible">
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
    <div class="p-field mb-3" v-if="isMounted && userRolesVisible">
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

    <DataTable :value="synchronizedAccesses" responsiveLayout="scroll" v-if="isMounted">
      <Column field="user" header="User">
        <template #body="slotProps">
          <UserIdentification :ownerType="slotProps.data.ownerType" :owner="slotProps.data.owner"
                              :data="slotProps.data[identificationSymbol]" />
        </template>
      </Column>
      <Column field="access" header="Access">
        <template #body="slotProps">
          <Dropdown v-if="!multiRole" id="userPublicAccess" class="w-full" inputClass="w-full"
                    :options="['none'].concat(availableRoles)"
                    :optionLabel="optionLabel"
                    :modelValue="slotProps.data.roles?.[0] ?? 'none'"
                    @update:modelValue="newValue => slotProps.data.roles = [newValue]"
                    :feedback="false" toggleMask />
          <MultiSelect v-if="multiRole" id="userPublicAccess" class="w-full" inputClass="w-full"
                       :options="availableRoles"
                       :optionLabel="optionLabel"
                       v-model="slotProps.data.roles"
                       :feedback="false" toggleMask />
        </template>
      </Column>
      <Column>
        <template #body="slotProps">

        </template>
      </Column>
    </DataTable>

    <div>
<!--      <h2>publicAccess:</h2>
      <pre>{{ JSON.stringify(publicAccess, null, "  ") }}</pre>-->
      <h2>accesses:</h2>
      <pre>{{ JSON.stringify(accesses, null, "  ") }}</pre>
      <h2>accessRequests:</h2>
      <pre>{{ JSON.stringify(accessRequests, null, "  ") }}</pre>
    </div>
  </div>
</template>

<script setup>
  import Dropdown from "primevue/dropdown"
  import MultiSelect from "primevue/multiselect"

  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import ColumnGroup from 'primevue/columngroup';

  import { UserIdentification } from "@live-change/user-frontend";

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

  const identificationSymbol = Symbol('identification')

  const [ publicAccess, accesses, accessRequests ] = await Promise.all([
    live(path().accessControl.objectOwnedPublicAccess({ object, objectType })),
    live(path().accessControl.objectRelatedAccesses({ object, objectType })
        .with(access => path().userIdentification.ownerOwnedIdentification({
          ownerType: access.ownerType, owner: access.owner
        }).bind(identificationSymbol))
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
    remove: accessControlApi.deleteObjectRelatedAccess,
    objectIdentifiers: source => ({ access: source.to, object, objectType }),
    onSave: () => toast.add({ severity: 'info', summary: 'Public access saved', life: 1500 }),
    recursive: true
  })
  const synchronizedAccesses = synchronizedAccessesList.value
  /// TODO: synchronizedAccesses with synchronizedArray

</script>
