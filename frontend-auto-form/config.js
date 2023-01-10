import { defineAsyncComponent } from 'vue'

export const inputs = {
}
export const types = {
}

export function input(src, config) {
  return {
    component: src && defineAsyncComponent(src),
    ...config,
    with(config) {
      return { component: this.component, ...config }
    }
  }
}

types.String = inputs.decimal = input( () => import('primevue/inputtext'))
inputs.textarea = input(() => import('primevue/textarea'), { attributes: { autoResize: true } })

inputs.password = input(() => import('primevue/password'))

const number = input(() => import('primevue/inputnumber'))
inputs.integer = number
types.Number = inputs.decimal = number.with({ attributes: { mode: 'decimal' } })

types.Object = inputs.object = input(() => import('./AutoEditor.vue'), {
  fieldComponent: defineAsyncComponent(() => import('./GroupField.vue'))
})

types.Array = inputs.list = input(() => import('./ArrayInput.vue'), {
  fieldComponent: defineAsyncComponent(() => import('./GroupField.vue'))
})

types.Date = inputs.datetime = input(() => import('primevue/calendar'), { attributes: { showTime: true } })

inputs.select = input(() => import('primevue/dropdown'), {
  attributes: (config) => {
    const { definition, i18n, t } = config
    console.log("SELECT", config)
    return {
      options: definition.options,
      optionLabel: option => t(i18n + ':options.' + option)
    }
  }
})

inputs.duration = input(() => import('primevue/inputmask'), {
  attributes: { mask: '99:99:99' }
})
