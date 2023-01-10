import { TextSelection } from 'prosemirror-state'
import {
  EditorView, keymap as cmKeymap, drawSelection
} from "@codemirror/view"
import {javascript} from "@codemirror/lang-javascript"
import {defaultKeymap} from "@codemirror/commands"
import {syntaxHighlighting, defaultHighlightStyle} from "@codemirror/language"

import {exitCode} from "prosemirror-commands"
import {undo, redo} from "prosemirror-history"

class CodeBlockView {
  constructor(node, editor, getPos) {
    // Store for later
    this.node = node
    this.view = editor.view
    this.schema = editor.schema
    this.getPos = getPos

    this.language = node.attrs.language

    // Select language plugin
    let languagePlugins = []
    switch(this.language) {
      case 'javascript':
        languagePlugins.push(javascript())
        break
      default:
        break
    }

    // Create a CodeMirror instance
    this.cm = new EditorView({
      doc: this.node.textContent,
      extensions: [
        cmKeymap.of([
          ...this.codeMirrorKeymap(),
          ...defaultKeymap
        ]),
        drawSelection(),
        syntaxHighlighting(defaultHighlightStyle),
        ...languagePlugins,
        EditorView.updateListener.of(update => this.forwardUpdate(update))
      ]
    })
    // The editor's outer node is our DOM representation
    this.dom = this.cm.dom

    // This flag is used to avoid an update loop between the outer and
    // inner editor
    this.updating = false
  }

  forwardUpdate(update) {
    if (this.updating || !this.cm.hasFocus) return
    let offset = this.getPos() + 1, {main} = update.state.selection
    let selection = TextSelection.create(this.view.state.doc,
      offset + main.from, offset + main.to)
    if (update.docChanged || !this.view.state.selection.eq(selection)) {
      let tr = this.view.state.tr.setSelection(selection)
      update.changes.iterChanges((fromA, toA, fromB, toB, text) => {
        if (text.length)
          tr.replaceWith(offset + fromA, offset + toA,
            this.schema.text(text.toString()))
        else
          tr.delete(offset + fromA, offset + toA)
        offset += (toB - fromB) - (toA - fromA)
      })
      this.view.dispatch(tr)
    }
  }

  codeMirrorKeymap() {
    let view = this.view
    return [
      {key: "ArrowUp", run: () => this.maybeEscape("line", -1)},
      {key: "ArrowLeft", run: () => this.maybeEscape("char", -1)},
      {key: "ArrowDown", run: () => this.maybeEscape("line", 1)},
      {key: "ArrowRight", run: () => this.maybeEscape("char", 1)},
      {key: "Ctrl-Enter", run: () => {
          if (!exitCode(view.state, view.dispatch)) return false
          view.focus()
          return true
        }},
      {key: "Ctrl-z", mac: "Cmd-z",
        run: () => undo(view.state, view.dispatch)},
      {key: "Shift-Ctrl-z", mac: "Shift-Cmd-z",
        run: () => redo(view.state, view.dispatch)},
      {key: "Ctrl-y", mac: "Cmd-y",
        run: () => redo(view.state, view.dispatch)}
    ]
  }

  maybeEscape(unit, dir) {
    let {state} = this.cm, {main} = state.selection
    if (!main.empty) return false
    if (unit == "line") main = state.doc.lineAt(main.head)
    if (dir < 0 ? main.from > 0 : main.to < state.doc.length) return false
    let targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize)
    let selection = Selection.near(this.view.state.doc.resolve(targetPos), dir)
    let tr = this.view.state.tr.setSelection(selection).scrollIntoView()
    this.view.dispatch(tr)
    this.view.focus()
  }

  update(node) {
    if (node.type != this.node.type) return false
    if (node.attrs.language != this.language) return false
    if (this.updating) return true
    let newText = node.textContent, curText = this.cm.state.doc.toString()
    if (newText != curText) {
      let start = 0, curEnd = curText.length, newEnd = newText.length
      while (start < curEnd &&
      curText.charCodeAt(start) == newText.charCodeAt(start)) {
        ++start
      }
      while (curEnd > start && newEnd > start &&
      curText.charCodeAt(curEnd - 1) == newText.charCodeAt(newEnd - 1)) {
        curEnd--
        newEnd--
      }
      this.updating = true
      this.cm.dispatch({
        changes: {
          from: start, to: curEnd,
          insert: newText.slice(start, newEnd)
        }
      })
      this.updating = false
    }
    return true
  }

  selectNode() { this.cm.focus() }
  stopEvent() { return true }
}


export default CodeBlockView
