'use client'

import Editor from '@monaco-editor/react'
import { useTheme } from 'next-themes'

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  readOnly?: boolean
  placeholder?: string
}

export function JsonEditor({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  placeholder,
}: JsonEditorProps) {
  const { resolvedTheme } = useTheme()

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={(v) => onChange(v || '')}
      theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        readOnly,
        placeholder,
      }}
    />
  )
}
