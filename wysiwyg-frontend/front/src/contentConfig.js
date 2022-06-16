import { h } from 'vue'
import { Image } from "@live-change/image-frontend"

export const basicMarks = {
  bold: (m, c) => h('strong', {}, [ c ]),
  italic: (m, c) => h('em', {}, [ c ]),
  underline: (m, c) => h('u', {}, [ c ]),
  strike: (m, c) => h('s', {}, [ c ]),
}

export const plainTextNodes = {
  doc: ({ content }, r) => h('div', { 'class': 'content' }, r(content)),

  paragraph: ({ content }, r) => h('p', { }, r(content)),

  text({ text, marks: ms }, r, marks) {
    let res = text
    if(ms) for(const mark of ms) {
      const renderer = marks[mark.type]
      if(!renderer) {
        res = h('span', { style: 'color: red' }, `[unknown mark type ${mark.type}]`)
      } else {
        res = renderer(mark, res)
      }
    }
    return res
  }
}

export const messageNodes = {
  ...plainTextNodes,

  hardBreak: ({ content }) => h('br')
}

export const richEditorNodes = {
  horizontalRule: ({ content }) => h('hr'),

  heading: ({ content, attrs }, r) => h('h'+(+attrs.level), { }, r(content)),
  blockquote: ({ content }, r) => h('blockquote', { }, r(content)),
  codeBlock:  ({ content }, r) => h('pre', { }, h('code', { }, r(content))),

  bulletList: ({ content }, r) => h('ul', { }, r(content)),
  orderedList: ({ content }, r) => h('ol', { }, r(content)),
  listItem: ({ content }, r) => h('li', { }, r(content)),

  image: ({ attrs }) => h(Image, { domResize: 'width', width: 100, ...attrs }),

  ...messageNodes
}