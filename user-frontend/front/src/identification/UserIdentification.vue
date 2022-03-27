<template>
  <span>
    <router-link v-if="ownerType == 'user_User' && profileRouteExists"
                 :to="{ name: 'user:profile', params: { user: owner } }"
                 v-ripple
                 class="flex align-items-center cursor-pointer text-700 hover:surface-100 border-round p-ripple">
      <span v-if="userData?.image" class="mr-2">reactive image not implemented!</span>
      <img v-else :src="identiconUrl" class="mr-2" style="width: 28px; height: 28px"/>
      <span class="font-medium">{{ userData?.name }}</span>
    </router-link>
    <span v-else class="flex align-items-center cursor-pointer text-700 hover:surface-100 border-round p-ripple">
      <span v-if="userData?.image" class="mr-2">reactive image not implemented!</span>
      <img v-else :src="identiconUrl" class="mr-2" style="width: 28px; height: 28px"/>
      <span class="font-medium">{{ userData?.name }}</span>
    </span>
  </span>
</template>

<script setup>

  const props = defineProps({
    ownerType: {
      type: String,
      required: true
    },
    owner: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      default: null
    }
  })

  import { toRefs } from "@vueuse/core"
  const { data } = toRefs(props)
  const { ownerType, owner } = props

  import { useRouter } from 'vue-router'
  const router = useRouter()
  const profileRouteExists = router.hasRoute('user:profile')

  import { path, live, actions } from '@live-change/vue3-ssr'

  const dataPromise = data !== undefined ? Promise.resolve(data)
      : live(path().userIdentification.Identification({ ownerType, owner }))

  const identiconUrl = `/api/identicon/jdenticon/${ownerType}:${owner}/28.svg`

  const [ userData ] = await Promise.all([ dataPromise ])

</script>

<style scoped>

</style>