import React, { useState } from 'react'
import { Controlled as CodeMirrorControlled } from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

function JsonEditor ({ jsonText, onChange }) {
  const [value, setValue] = useState(jsonText || '')
  const options = {
    lineNumbers: true,
    mode: 'javascript',
    smartIndent: true,
    readOnly: false,
    tabSize: 2,
    lineWrapping: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
    autoCursor: true,
    autoScroll: true
  }
  return (
    <CodeMirrorControlled
      value={value}
      onBeforeChange={(_editor, _editorChange, string) => { setValue(string) }}
      onChange={onChange}
      options={options}
      autoFocus
    />
  )
}

export default JsonEditor
