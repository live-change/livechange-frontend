const { parser: javascriptParser } = require("@lezer/javascript")
const { parser: htmlParser } = require("@lezer/html")
const { parser: markdownParser } = require("@lezer/markdown")
const { parser: cssParser } = require("@lezer/css")
const { parser: jsonParser } = require("@lezer/json")
const { parser: cppParser } = require("@lezer/cpp")
const { parser: sassParser } = require("@lezer/sass")
const { parser: javaParser } = require("@lezer/java")
const { parser: pythonParser } = require("@lezer/python")
const { parser: phpParser } = require("@lezer/php")
const { parser: rustParser } = require("@lezer/rust")

const { highlightTree } = require("@lezer/highlight")
const { defaultHighlightStyle } = require("@codemirror/language")

const parsers = {
  javascript: javascriptParser,
  html: htmlParser,
  markdown: markdownParser,
  css: cssParser,
  json: jsonParser,
  cpp: cppParser,
  sass: sassParser,
  java: javaParser,
  python: pythonParser,
  php: phpParser,
  rust: rustParser,
  scss: sassParser,
  less: cssParser,
  stylus: cssParser,
  ts: javascriptParser,
  tsx: javascriptParser,
  jsx: javascriptParser,
  vue: htmlParser,
}

function hightlight(code, language) {
  //console.log("HIGHLIGHT", language, code)
  const parser = parsers[language]
  if(parser) {
    const tree = parser.parse(code)
    let pos = 0
    const output = []
    highlightTree(tree, defaultHighlightStyle, (from, to, classes) => {
      if (from > pos) output.push(`<span>${
          code.slice(pos, from).replace(/</g, "&lt;").replace(/>/g, "&gt;")
      }</span>`)
      console.log("HIGHLIGHT", from, to, classes, code.slice(from, to))
      output.push(`<span class="${classes}">${
          code.slice(from, to).replace(/</g, "&lt;").replace(/>/g, "&gt;")
      }</span>`)
      pos = to
    })
    if (code.length > pos) output.push(`<span>${
        code.slice(pos).replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }</span>`)
    return `<pre class="code${language ? ' code-language-'+language : ''}">${output.join('')}</pre>`
  }
}

module.exports = {
  parsers, hightlight
}