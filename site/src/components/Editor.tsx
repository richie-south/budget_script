import { memo, useEffect, useRef } from "react"
import {
  EditorView,
  Decoration,
  ViewPlugin,
  WidgetType,
  DecorationSet,
  ViewUpdate,
} from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { basicSetup } from "codemirror"
import {
  budgetScript,
  ParseError,
  EvaluatorError,
  parser,
} from "../../../lang/src/index"

// ============ CodeMirror Widgets ============
class AnnotationWidget extends WidgetType {
  constructor(readonly val: any) {
    super()
  }
  toDOM() {
    let wrap = document.createElement("span")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-budget-anno"
    wrap.textContent = `${this.val} kr`
    return wrap
  }
}

class ErrorAnnotationWidget extends WidgetType {
  constructor(readonly val: string) {
    super()
  }
  toDOM() {
    let wrap = document.createElement("span")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-error-anno"
    wrap.textContent = `${this.val}`
    return wrap
  }
}

class ProgressAnnotationWidget extends WidgetType {
  constructor(readonly values: any[]) {
    super()
  }
  toDOM() {
    let wrap = document.createElement("div")

    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-progress-anno"

    let progress = document.createElement("progress")
    progress.setAttribute("value", (this.values[0]?.value ?? 0).toString())
    progress.setAttribute("max", (this.values[1]?.value ?? 100).toString())
    wrap.appendChild(progress)

    return wrap
  }
}

const budgetPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet
    constructor(view: EditorView) {
      this.decorations = this.getDecorations(view)
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.getDecorations(update.view)
      }
    }
    getDecorations(view: EditorView) {
      const widgets: any[] = []
      const docText = view.state.doc.toString()

      try {
        // We run the parser and evaluator here.
        // In a real app with heavy computation, this might need to be async or debounced,
        // but for this scale it's fine on every keystroke/update.
        // Note: We are using the imported functions from the lang package.
        // Ensure that the imports are correct and available.
        // Also handling if parser/budgetScript throws or returns unexpected.

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const ast = parser(docText)
        const evaluated = budgetScript(docText)

        const prints = evaluated.filter((a: any) => a.type === "print")
        const progress = evaluated.filter((a: any) => a.type === "progress")

        for (const result of prints) {
          try {
            // result.line is 0-indexed in the evaluator?
            // The original code used result.line + 1 for view.state.doc.line(),
            // which expects 1-based index.
            const line = view.state.doc.line(result.line + 1)
            widgets.push(
              Decoration.widget({
                widget: new AnnotationWidget(result.value.value),
                side: 1,
              }).range(line.to)
            )
          } catch (e) {
            console.log("e", e)
          }
        }

        for (const result of progress) {
          try {
            const line = view.state.doc.line(result.line + 1)
            widgets.push(
              Decoration.widget({
                widget: new ProgressAnnotationWidget(result.value),
                side: 1,
              }).range(line.to)
            )
          } catch (e) {
            console.log("e", e)
          }
        }
        return Decoration.set(widgets, true)
      } catch (error: any) {
        if (
          error instanceof ParseError ||
          error instanceof EvaluatorError
        ) {
           try {
              const line = view.state.doc.line(error.line + 1)
              widgets.push(
                Decoration.widget({
                  widget: new ErrorAnnotationWidget(error.message),
                  side: 1,
                }).range(line.to)
              )
           } catch(e) {
               // If error line is out of bounds (e.g. while typing)
               console.log("Error annotation out of bounds", e)
           }
        }
        return Decoration.set(widgets, true)
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  }
)

interface EditorProps {
  initialContent: string
  onChange: (content: string) => void
  onMetricsChange: (charCount: number, lineCount: number) => void
}

export const Editor = memo(function Editor({ initialContent, onChange, onMetricsChange }: EditorProps) {
  const editorContainer = useRef<HTMLDivElement>(null)
  const editorView = useRef<EditorView | null>(null)

  // We use a ref to track if we should update the editor content from props
  // to avoid loops if the update comes from the editor itself.
  // But actually, we usually just initialize once per note ID (handled by key in parent).

  useEffect(() => {
    if (!editorContainer.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const content = update.state.doc.toString()
        onChange(content)
        onMetricsChange(content.length, update.state.doc.lines)
      }
    })

    const theme = EditorView.theme({
      "&": {
        backgroundColor: "transparent",
        height: "100%",
      },
      ".cm-scroller": {
        fontFamily: "'JetBrains Mono', monospace",
        padding: "24px",
      },
      ".cm-gutters": {
        backgroundColor: "transparent",
        color: "var(--text-muted)",
        border: "none",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "transparent",
      },
      ".cm-activeLine": {
        backgroundColor: "rgba(255, 255, 255, 0.02)",
      },
      ".cm-cursor": {
        borderLeftColor: "var(--accent)",
      },
      ".cm-selectionBackground": {
        backgroundColor: "rgba(110, 231, 183, 0.15) !important",
      },
      "&.cm-focused": {
        outline: "none !important",
      },
    })

    const state = EditorState.create({
      doc: initialContent,
      extensions: [
        basicSetup,
        budgetPlugin,
        EditorView.lineWrapping,
        updateListener,
        theme,
      ],
    })

    const view = new EditorView({
      state,
      parent: editorContainer.current,
    })

    editorView.current = view

    // Initial metrics
    onMetricsChange(initialContent.length, initialContent.split("\n").length)

    return () => {
      view.destroy()
    }
    // We strictly want this to run only when mounting this component instance
    // The parent should change the `key` of this component when switching notes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className="editor-container" ref={editorContainer} />
}, () => true) // Never re-render - props are only used on mount, key change handles note switching
