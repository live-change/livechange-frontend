import { h, ref } from 'vue'
import Button from "primevue/button"

function Experiment1(props, context) {
  const randomNames = ['frajerów', 'debili', 'dzbanów', 'kretynów']
  return h('div', {}, [
      h('h1', {}, 'Test dynamicznych szablonów'),
      h({
        template: `
          <p>Chmura jest dla {{ randomName }}.</p>
          <Button label="Zobacz" @click="nextName" />
          <p>Dedyki są dla ludzi z charakterem jak używasz chmury jesteś kolego {{ zerem }}.</p>
        `,
        setup() {
          const zerem = "zerem"
          const randomName = ref()
          let nameId = 0
          function nextName() {
            nameId = (nameId + 1) % randomNames.length
            randomName.value = randomNames[nameId]
          }
          nextName()
          return { zerem, randomName, nextName }
        },
        components: {
          Button
        }
      })
    ])
}

export default Experiment1