<template>
  <div class="w-full sm:w-9 md:w-8 lg:w-6 surface-card p-4 shadow-2 border-round">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">
        Access Control
      </div>
    </div>

    <div>
      <Button label="Invite with email" icon="pi pi-envelope" class="p-button mb-4" @click="inviteDialog = true" />
    </div>
    <Dialog v-if="isMounted" v-model:visible="inviteDialog" :modal="true" class="w-full sm:w-9 md:w-8 lg:w-6">
      <template #header>
        <h3>Invite user with email</h3>
      </template>

      <command-form service="accessControl" action="inviteEmail"
                    ref="inviteForm"
                    v-slot="{ data }"
                    :parameters="{ objectType, object }"
                    :initialValues="{ roles: defaultInviteRoles }"
                    @done="handleInvited" keepOnDone>

        <div class="flex flex-row flex-wrap align-items-center" style="margin-left: -0.5rem; margin-right: -0.5rem;">
          <div class="col-12 md:col-6 py-1">
            <div class="p-field mb-3">
              <label for="email" class="block text-900 font-medium mb-2">
                Email address
              </label>
              <InputText id="email" type="text" class="w-full"
                         aria-describedby="email-help" :class="{ 'p-invalid': data.emailError }"
                         v-model="data.email" />
              <small id="email-help" class="p-error">{{ data.emailError }}</small>
            </div>
          </div>
          <div class="col-12 md:col-6">
            <div class="p-field mb-3">
              <label for="inviteAccess" class="block text-900 font-medium mb-2">
                Roles
              </label>
              <Dropdown v-if="!multiRole" id="inviteAccess" class="w-14em w-full"
                        :options="['none'].concat(availableRoles)"
                        :optionLabel="optionLabel"
                        :modelValue="data.roles?.[0] ?? 'none'"
                        @update:modelValue="newValue => data.roles = [newValue]"
                        :feedback="false" toggleMask />
              <MultiSelect v-if="multiRole" id="inviteAccess" class="w-full"
                           :options="availableRoles"
                           :optionLabel="optionLabel"
                           v-model="data.roles"
                           :feedback="false" toggleMask />
              <small id="email-help" class="p-error">{{ data.rolesError }}</small>
            </div>

          </div>
        </div>
        <div class="p-field mb-1">
          <label for="inviteMessage" class="block text-900 font-medium mb-2">
            Message ( optional )
          </label>
          <Textarea id="inviteMessage" v-model="data.message" :autoResize="true" rows="3" class="w-full" />
        </div>

      </command-form>

      <template #footer>
        <Button label="Invite" icon="pi pi-envelope" autofocus @click="inviteForm.submit()" />
      </template>
    </Dialog>

    <div v-if="synchronizedAccessRequests.length > 0" class="mb-4">
      <div class="text-900 font-medium text-xl mb-2">Access Requests</div>
      <div v-for="access of synchronizedAccessRequests" class="flex flex-row flex-wrap align-items-center">
        <div class="col-12 md:col-6 py-1">
          <UserIdentification :ownerType="access.sessionOrUserType" :owner="access.sessionOrUser"
                              :data="access.identification" />
        </div>
        <div class="col-12 md:col-6 flex flex-row pr-0" v-if="isMounted">
          <Dropdown v-if="!multiRole && (access.roles?.length ?? 0) <= 1" id="userPublicAccess" class="w-14em"
                    style="width: calc(100% - 4.714rem) !important"
                    :options="['none'].concat(availableRoles)"
                    :optionLabel="optionLabel"
                    :modelValue="access.roles?.[0] ?? 'none'"
                    @update:modelValue="newValue => access.roles = [newValue]"
                    :feedback="false" toggleMask />
          <MultiSelect v-else id="userPublicAccess"
                       style="width: calc(100% - 4.714rem) !important"
                       :options="availableRoles"
                       :optionLabel="optionLabel"
                       v-model="access.roles"
                       :feedback="false" toggleMask />
          <Button @click="acceptAccessRequest(access)" icon="pi pi-check"
                  class="p-button-rounded p-button-text p-button-plain ml-2 px-3"
                  style="padding-top: 0.77rem" />
          <Button @click="deleteAccessRequest(access)" icon="pi pi-times"
                  class="p-button-rounded p-button-text p-button-plain px-3"
                  style="padding-top: 0.77rem" />
        </div>
      </div>
    </div>

    <div v-if="synchronizedAccessInvitations.length > 0" class="mb-4">
      <div class="text-900 font-medium text-xl mb-2">Access Invitations</div>
      <div v-for="access of synchronizedAccessInvitations"
           :key="access.to"
           class="flex flex-row flex-wrap align-items-center">
        <div class="col-12 md:col-6 py-1">
          <UserIdentification :ownerType="access.contactOrUserType" :owner="access.contactOrUser"
                              :data="access.identification" />
        </div>
        <div class="col-12 md:col-6 flex flex-row pr-0" v-if="isMounted">
          <Dropdown v-if="!multiRole && (access.roles?.length ?? 0) <= 1" id="userPublicAccess" class="w-14em"
                    style="width: calc(100% - 2.357rem) !important"
                    :options="['none'].concat(availableRoles)"
                    :optionLabel="optionLabel"
                    :modelValue="access.roles?.[0] ?? 'none'"
                    @update:modelValue="newValue => access.roles = [newValue]"
                    :feedback="false" toggleMask />
          <MultiSelect v-else id="userPublicAccess"
                       style="width: calc(100% - 2.357rem) !important"
                       :options="availableRoles"
                       :optionLabel="optionLabel"
                       v-model="access.roles"
                       :feedback="false" toggleMask />
          <Button @click="deleteAccessInvitation(access)" icon="pi pi-times"
                  class="p-button-rounded p-button-text p-button-plain ml-2 px-3"
                  style="padding-top: 0.77rem" />
        </div>
      </div>
    </div>

    <div v-if="synchronizedAccesses.length > 0" class="mb-4">
      <div class="text-900 font-medium text-xl mb-2">Authorized</div>
      <div v-for="access of synchronizedAccesses" class="flex flex-row flex-wrap align-items-center">
        <div class="col-12 md:col-6 py-1">
          <UserIdentification :ownerType="access.sessionOrUserType" :owner="access.sessionOrUser"
                              :data="access.identification" />
        </div>
        <div class="col-12 md:col-6 flex flex-row pr-0" v-if="isMounted">
          <Dropdown v-if="!multiRole && (access.roles?.length ?? 0) <= 1"
                    id="userPublicAccess" class="w-14em"
                    style="width: calc(100% - 2.357rem) !important"
                    :options="['none'].concat(availableRoles)"
                    :optionLabel="optionLabel"
                    :modelValue="access.roles?.[0] ?? 'none'"
                    @update:modelValue="newValue => access.roles = [newValue]"
                    :feedback="false" toggleMask />
          <MultiSelect v-else id="userPublicAccess"
                       style="width: calc(100% - 2.357rem) !important"
                       :options="availableRoles"
                       :optionLabel="optionLabel"
                       v-model="access.roles"
                       :feedback="false" toggleMask />
          <Button @click="deleteAccess(access)" icon="pi pi-times"
                  class="p-button-rounded p-button-text p-button-plain ml-2 px-3"
                  style="padding-top: 0.77rem" />
        </div>
      </div>
    </div>

    <div class="grid formgrid p-fluid mb-2">
      <div class="p-field field mb-4 col-12 md:col-6" v-if="isMounted && sessionRolesVisible">
        <label for="publicAccess" class="block text-900 font-medium mb-2">Public access:</label>
        <Dropdown v-if="!multiRole && (synchronizedPublicAccess.sessionRoles?.length ?? 0) <= 1"
                  id="publicAccess" class="w-full" inputClass="w-full"
                  :options="['none'].concat(availablePublicSessionRoles ?? availablePublicRoles ?? availableRoles)"
                  :optionLabel="optionLabel"
                  :modelValue="synchronizedPublicAccess.sessionRoles?.[0] ?? 'none'"
                  @update:modelValue="newValue => synchronizedPublicAccess.sessionRoles = [newValue]"
                  :feedback="false" toggleMask />
        <MultiSelect v-else
                     id="publicAccess" class="w-full" inputClass="w-full"
                     :options="availablePublicSessionRoles ?? availablePublicRoles ?? availableRoles"
                     :optionLabel="optionLabel"
                     v-model="synchronizedPublicAccess.sessionRoles"
                     :feedback="false" toggleMask />
      </div>
      <div class="p-field field mb-4 col-12 md:col-6" v-if="isMounted && userRolesVisible">
        <label for="userPublicAccess" class="block text-900 font-medium mb-2">Public access for users:</label>
        <Dropdown v-if="!multiRole && (synchronizedPublicAccess.userRoles?.length ?? 0) <= 1"
                  id="userPublicAccess" class="w-full" inputClass="w-full"
                  :options="['none'].concat(availablePublicUserRoles ?? availablePublicRoles ?? availableRoles)"
                  :optionLabel="optionLabel"
                  :modelValue="synchronizedPublicAccess.userRoles?.[0] ?? 'none'"
                  @update:modelValue="newValue => synchronizedPublicAccess.userRoles = [newValue]"
                  :feedback="false" toggleMask />
        <MultiSelect v-else id="userPublicAccess" class="w-full" inputClass="w-full"
                     :options="availablePublicUserRoles ?? availablePublicRoles ?? availableRoles"
                     :optionLabel="optionLabel"
                     v-model="synchronizedPublicAccess.userRoles"
                     :feedback="false" toggleMask />
      </div>
      <div class="p-field field mb-4 col-12" v-if="isMounted && requestedRolesVisible">
        <label for="availablePublicAccess" class="block text-900 font-medium mb-2">Roles available to request:</label>
        <MultiSelect id="userPublicAccess" class="w-full" inputClass="w-full"
                     :options="availableRequestedRoles ?? availableRoles"
                     :optionLabel="optionLabel"
                     v-model="synchronizedPublicAccess.availableRoles"
                     :feedback="false" toggleMask />
      </div>
    </div>


    <div>
<!--      <h2>publicAccess:</h2>
      <pre>{{ JSON.stringify(publicAccess, null, "  ") }}</pre>-->
<!--      <h2>accesses:</h2>
      <pre>{{ JSON.stringify(accesses, null, "  ") }}</pre>-->
      <!--<h2>accessRequests:</h2>
      <pre>{{ JSON.stringify(accessRequests, null, "  ") }}</pre>-->

<!--      <h2>accesseInvitations:</h2>
      <pre>{{ JSON.stringify(accessInvitations, null, "  ") }}</pre>-->
    </div>
  </div>
</template>

<script setup>
  import Button from "primevue/button"
  import Dropdown from "primevue/dropdown"
  import MultiSelect from "primevue/multiselect"

  import Dialog from 'primevue/dialog'
  import InputText from 'primevue/inputtext'
  import Textarea from 'primevue/textarea'

  import { UserIdentification } from "@live-change/user-frontend"

  import { synchronized, synchronizedList } from "@live-change/vue3-components"

  import { useToast } from 'primevue/usetoast'
  import { useConfirm } from 'primevue/useconfirm'
  const confirm = useConfirm()
  const toast = useToast()

  const {
    object, objectType, paths,
    availableRoles, availablePublicSessionRoles, availablePublicUserRoles, availableRequestedRoles,
    defaultInviteRoles,
    multiRole,
    sessionRolesVisible, userRolesVisible, requestedRolesVisible
  } = defineProps({
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
    availableRoles: {
      type: Array,
      default: () => ['administrator', 'moderator', 'writer', 'reader']
    },
    availablePublicRoles: {
      type: Array,
      default: () => ['writer', 'reader']
    },
    availablePublicSessionRoles: {
      type: Array
    },
    availablePublicUserRoles: {
      type: Array
    },
    availableRequestedRoles: {
      type: Array
    },
    defaultInviteRoles: {
      type: Array,
      default: () => ['reader']
    },
    multiRole: {
      type: Boolean,
      default: false
    },
    sessionRolesVisible: {
      type: Boolean,
      default: true
    },
    userRolesVisible: {
      type: Boolean,
      default: true
    },
    requestedRolesVisible: {
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

  const [ publicAccess, accesses, accessRequests, accessInvitations ] = await Promise.all([
    live(path().accessControl.objectOwnedPublicAccess({ object, objectType })),
    live(path().accessControl.objectOwnedAccesses({ object, objectType })
        .with(access => path().userIdentification.sessionOrUserOwnedIdentification({
          sessionOrUserType: access.sessionOrUserType, sessionOrUser: access.sessionOrUser
        }).bind('identification'))
    ),
    live(path().accessControl.objectOwnedAccessRequests({ object, objectType })
        .with(access => path().userIdentification.sessionOrUserOwnedIdentification({
          sessionOrUserType: access.sessionOrUserType, sessionOrUser: access.sessionOrUser
        }).bind('identification'))
    ),
    live(path().accessControl.objectOwnedAccessInvitations({ object, objectType })
        .with(access => path().userIdentification.sessionOrUserOwnedIdentification({
          sessionOrUserType: access.contactOrUserType, sessionOrUser: access.contactOrUser
        }).bind('identification'))
    )
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
    update: accessControlApi.updateSessionOrUserAndObjectOwnedAccess,
    delete: accessControlApi.resetSessionOrUserAndObjectOwnedAccess,
    identifiers: { object, objectType },
    objectIdentifiers: ({ to, sessionOrUser, sessionOrUserType }) =>
        ({ access: to, sessionOrUser, sessionOrUserType, object, objectType }),
    onSave: () => toast.add({ severity: 'info', summary: 'Access saved', life: 1500 }),
    recursive: true
  })
  const synchronizedAccesses = synchronizedAccessesList.value

  function deleteAccess(access) {
    console.log("DELETE ACCESS", access)
    confirm.require({
      target: event.currentTarget,
      message: `Do you want to revoke user "${access.identification.name}" access?`,
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      accept: async () => {
        await synchronizedAccessesList.delete(access)
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


  const synchronizedAccessRequestsList = synchronizedList({
    source: accessRequests,
    update: accessControlApi.updateSessionOrUserAndObjectOwnedAccessRequest,
    delete: accessControlApi.resetSessionOrUserAndObjectOwnedAccessRequest,
    identifiers: { object, objectType },
    objectIdentifiers: ({ to, sessionOrUser, sessionOrUserType }) =>
        ({ accessRequest: to, sessionOrUser, sessionOrUserType, object, objectType }),
    onSave: () => toast.add({ severity: 'info', summary: 'Access request saved', life: 1500 }),
    recursive: true
  })
  const synchronizedAccessRequests = synchronizedAccessRequestsList.value

  function deleteAccessRequest(accessRequest) {
    console.log("DELETE ACCESS REQUEST", accessRequest)
    confirm.require({
      target: event.currentTarget,
      message: `Do you want to delete user "${accessRequest.identification.name}" access request?`,
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      accept: async () => {
        await synchronizedAccessRequestsList.delete(accessRequest)
        /*await accessControlApi.deleteObjectRelatedAccess({
          access: access.to, object: access.object, objectType: access.objectType
        })*/
        toast.add({ severity:'info', summary: 'Access Request Deleted', life: 1500 })
      },
      reject: () => {
        toast.add({ severity:'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
      }
    })
  }

  async function acceptAccessRequest(accessRequest) {
    console.log("ACCEPT ACCESS REQUEST", accessRequest)
    await accessControlApi.acceptAccessRequest({
      ...accessRequest, access: accessRequest.to
    })
    toast.add({ severity:'info', summary: 'Access Request accepted', life: 1500 })
  }


  const synchronizedAccessInvitationsList = synchronizedList({
    source: accessInvitations,
    update: accessControlApi.updateContactOrUserAndObjectOwnedAccessInvitation,
    delete: accessControlApi.resetContactOrUserAndObjectOwnedAccessInvitation,
    identifiers: { object, objectType },
    objectIdentifiers: ({ to, sessionOrUser, sessionOrUserType }) =>
        ({ accessInvitation: to, sessionOrUser, sessionOrUserType, object, objectType }),
    onSave: () => toast.add({ severity: 'info', summary: 'Access invite saved', life: 1500 }),
    recursive: true
  })
  const synchronizedAccessInvitations = synchronizedAccessInvitationsList.value

  function deleteAccessInvitation(accessInvitation) {
    console.log("DELETE ACCESS INVITE", accessInvitation)
    confirm.require({
      target: event.currentTarget,
      message: `Do you want to delete user "${accessInvitation?.identification?.name ?? accessInvitation.to}" invitation?`,
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      accept: async () => {
        await synchronizedAccessInvitationsList.delete(accessInvitation)
        /*await accessControlApi.deleteObjectRelatedAccess({
          access: access.to, object: access.object, objectType: access.objectType
        })*/
        toast.add({ severity:'info', summary: 'Invitation Deleted', life: 1500 })
      },
      reject: () => {
        toast.add({ severity:'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
      }
    })
  }

  const inviteDialog = ref(false)
  const inviteForm = ref()
  function handleInvited() {
    inviteDialog.value = false
    toast.add({ severity:'info', summary: 'Invitation sent!', life: 1500 })
    console.log("INVITED", arguments)
  }

</script>
