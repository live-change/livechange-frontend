import { h } from 'vue'

const components = {
  card: {
    description: 'PrimeVUE card',
    previewContent: true,
    attrs: [],
    render: ({ content, attrs }, r) => h('div', { 'class': 'surface-card py-1 px-3 shadow-2 w-full' }, r(content)),
    editor: (props, { slots }) => h('div', { 'class': 'surface-card py-1 px-3 shadow-2 w-full' }, slots.default()),
    async: true
  }
}


export default components
