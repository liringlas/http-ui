'use client'

import Editor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

interface JsonViewerProps {
  value: string
  language?: string
}

export function JsonViewer({ value, language = 'json' }: JsonViewerProps) {
  const { resolvedTheme } = useTheme()

  const formattedValue = useMemo(() => {
    if (language !== 'json') return value
    try {
      const parsed = JSON.parse(value)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return value
    }
  }, [value, language])

  return (
    <Editor
      height="100%"
      language={language}
      value={formattedValue}
      theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        readOnly: true,
      }}
    />
  )
}
