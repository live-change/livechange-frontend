import { defineAsyncComponent } from 'vue'

export const inputs = {
}
export const types = {
}

export function input(src, params) {
  return {
    component: defineAsyncComponent(src),
    params,
    with(params) {
      return { component: this.component, params }
    }
  }
}

types.String = inputs.decimal = input( () => import('primevue/inputtext'))
inputs.password = input(() => import('primevue/password'))

const number = input(() => import('primevue/inputnumber'))
inputs.integer = number
types.Number = inputs.decimal = number.with({ mode: 'decimal' })

