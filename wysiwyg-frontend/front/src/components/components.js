import { h } from 'vue'

const components = {
  card: {
    description: 'PrimeVUE card',
    previewContent: true,
    attrs: [],
    initialAttrs: {
      class: 'surface-card py-1 px-3 shadow-2'
    },
    render: ({ content, attrs }, r) => h('div', { ...attrs.attrs }, r(content)),
    editor: (attrs, { slots }) => h('div', { ...attrs }, slots.default()),
    async: true
  }
}

export default components
