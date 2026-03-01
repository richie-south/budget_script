import { memo, useEffect, useRef } from "react"
import { EditorView, Decoration, DecorationSet } from "@codemirror/view"
import { EditorState, StateField } from "@codemirror/state"
import { basicSetup } from "codemirror"
import {
  budgetScript,
  ParseError,
  EvaluatorError,
} from "../../../lang/src/index"
import { ProgressAnnotationWidget } from "./annotations/progress_annotation"
import { ErrorAnnotationWidget } from "./annotations/error_annotation"
import { PrintAnnotationWidget } from "./annotations/print_annotation"
import {
  PieChartAnnotationWidget,
  PieChartDataItem,
} from "./annotations/pie_annotation"
import { LineChartAnnotationWidget } from "./annotations/predict_annotation"
import {
  BarChartAnnotationWidget,
  BarChartDataItem,
} from "./annotations/bar_annotation"
import { budgetHighlightStyle, budgetLanguage } from "../lib/syntax"
import { syntaxHighlighting } from "@codemirror/language"

function getDecorations(state: EditorState): DecorationSet {
  const widgets: any[] = []
  const docText = state.doc.toString()

  try {
    const evaluated = budgetScript(docText)

    const prints = evaluated.filter((a) => a.dataType === "print")
    const progress = evaluated.filter((a) => a.dataType === "progress")
    const pieCharts = evaluated.filter((a) => a.dataType === "pie")
    const predictCharts = evaluated.filter((a) => a.dataType === "predict")
    const barCharts = evaluated.filter((a) => a.dataType === "bar")

    for (const result of prints) {
      try {
        // result.line is 0-indexed in the evaluator
        const line = state.doc.line(result.line + 1)
        widgets.push(
          Decoration.widget({
            widget: new PrintAnnotationWidget((result.value as any).value),
            side: 1,
          }).range(line.to),
        )
      } catch (e) {
        console.log("e", e)
      }
    }

    for (const result of progress) {
      try {
        const line = state.doc.line(result.line + 1)
        widgets.push(
          Decoration.widget({
            widget: new ProgressAnnotationWidget(
              result.value as any,
              result.line,
            ),
            side: 1,
          }).range(line.to),
        )
      } catch (e) {
        console.log("e", e)
      }
    }

    for (const result of pieCharts) {
      try {
        const line = state.doc.line(result.line + 1)

        if (Array.isArray(result.value)) {
          const pieData: PieChartDataItem[] = result.value.map((item: any) => ({
            label: String(item.identifier ?? item.value),
            value: Number(item.value),
          }))

          widgets.push(
            Decoration.widget({
              widget: new PieChartAnnotationWidget(pieData, result.line),
              side: 1,
              block: true,
            }).range(line.to),
          )
        }
      } catch (e) {
        console.log("pie chart error", e)
      }
    }

    for (const result of predictCharts) {
      try {
        const line = state.doc.line(result.line + 1)

        if (Array.isArray(result.value)) {
          widgets.push(
            Decoration.widget({
              widget: new LineChartAnnotationWidget(result.value, result.line),
              side: 1,
              block: true,
            }).range(line.to),
          )
        }
      } catch (e) {
        console.log("pie chart error", e)
      }
    }

    for (const result of barCharts) {
      try {
        const line = state.doc.line(result.line + 1)

        if (Array.isArray(result.value)) {
          const pieData: BarChartDataItem[] = result.value.map((item: any) => ({
            label: String(item.identifier ?? item.value),
            value: Number(item.value),
          }))

          widgets.push(
            Decoration.widget({
              widget: new BarChartAnnotationWidget(pieData, result.line),
              side: 1,
              block: true,
            }).range(line.to),
          )
        }
      } catch (e) {
        console.log("bar chart error", e)
      }
    }

    return Decoration.set(widgets, true)
  } catch (error: any) {
    if (error instanceof ParseError || error instanceof EvaluatorError) {
      try {
        const line = state.doc.line(error.line + 1)
        widgets.push(
          Decoration.widget({
            widget: new ErrorAnnotationWidget(error.message),
            side: 1,
          }).range(line.to),
        )
      } catch (e) {
        // If error line is out of bounds (e.g. while typing)
        console.log("Error annotation out of bounds", e)
      }
    }
    return Decoration.set(widgets, true)
  }
}

const budgetPlugin = StateField.define<DecorationSet>({
  create(state) {
    return getDecorations(state)
  },
  update(decorations, tr) {
    if (tr.docChanged) {
      return getDecorations(tr.state)
    }
    return decorations
  },
  provide: (f) => EditorView.decorations.from(f),
})

interface EditorProps {
  initialContent: string
  onChange: (content: string) => void
  onMetricsChange: (charCount: number, lineCount: number) => void
}

export const Editor = memo(
  function Editor({ initialContent, onChange, onMetricsChange }: EditorProps) {
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
          color: "var(--box-text-muted)",
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
          budgetLanguage,
          syntaxHighlighting(budgetHighlightStyle),
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
  },
  () => true,
) // Never re-render - props are only used on mount, key change handles note switching
