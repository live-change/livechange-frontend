<template>
  <li class="px-3 py-2 flex align-items-start
             justify-content-between flex-column hover:surface-100">
      <slot></slot>
    <span class="block text-500 font-medium mt-2">
      {{ DateTime.fromISO(notification.time).toRelative({ base: DateTime.fromMillis(now) })  }}
    </span>
  </li>
</template>

<script setup>

  const props = defineProps({
    notification: {
      type: Object,
      required: true
    },
    image: {
      type: String
    }
  })

  import { useTimestamp, toRefs } from '@vueuse/core'

  const { notification, image } = toRefs(props)

  const now = useTimestamp({ interval: 1000 })
  import { DateTime } from 'luxon'

  const units = [
    'year',
    'month',
    'week',
    'day',
    'hour',
    'minute',
    'second',
  ]

  const timeAgo = (dateTime) => {
    const diff = dateTime.diffNow().shiftTo(...units);
    const unit = units.find((unit) => diff.get(unit) !== 0) || 'second'
    const relativeFormatter = new Intl.RelativeTimeFormat('en', {
      numeric: 'auto',
    })
    return relativeFormatter.format(Math.trunc(diff.as(unit)), unit)
  }

  console.log("REL", DateTime.fromISO(notification.value.time).toRelative())

</script>

<style scoped>

</style>