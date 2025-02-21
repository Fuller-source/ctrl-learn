"use client"

import { useEffect, useRef, useState } from "react"
import { EditorState } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { python } from "@codemirror/lang-python"
import { oneDark } from "@codemirror/theme-one-dark"

export function useCodeMirror(initialCode: string, onChange: (code: string) => void) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const [editorView, setEditorView] = useState<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        keymap.of(defaultKeymap),
        python(),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString())
          }
        }),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    setEditorView(view)

    return () => {
      view.destroy()
    }
  }, [initialCode, onChange]) // Removed editorRef from dependencies

  useEffect(() => {
    if (editorView) {
      const currentCode = editorView.state.doc.toString()
      if (currentCode !== initialCode) {
        editorView.dispatch({
          changes: { from: 0, to: currentCode.length, insert: initialCode },
        })
      }
    }
  }, [initialCode, editorView])

  return editorRef
}

