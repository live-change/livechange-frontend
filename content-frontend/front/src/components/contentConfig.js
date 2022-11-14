import { config } from "@live-change/wysiwyg-frontend"

const { basicMarks, richEditorNodes } = config

const contentConfig = {
  marks: {
    ...basicMarks
  },
  nodes: {
    //...messageNodes,
    ...richEditorNodes
  }
}

export default contentConfig
