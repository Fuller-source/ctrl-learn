import { useEffect, useRef, useState, useCallback } from "react"
import { EditorState } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { python } from "@codemirror/lang-python"
import { oneDark } from "@codemirror/theme-one-dark"

export function useCodeMirror(initialCode: string, onChange: (code: string) => void) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const [editorView, setEditorView] = useState<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current || editorView) return // Prevent reinitialization

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
  }, []) // Empty dependency array ensures this only runs once

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

