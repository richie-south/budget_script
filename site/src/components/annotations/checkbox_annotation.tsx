import { EditorSelection } from "@codemirror/state"
import { EditorView, WidgetType } from "@codemirror/view"
import { ChangeEvent } from "react"
import { createRoot } from "react-dom/client"

export class CheckboxWidget extends WidgetType {
  constructor(
    readonly checked: boolean,
    readonly pos: number,
  ) {
    super()
  }

  toDOM(view: EditorView) {
    const wrap = document.createElement("span")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-annotation-checkbox"

    const onCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked
      const currentPos = view.posAtDOM(wrap)

      if (currentPos < 0) return

      const checkboxText = isChecked ? "[x]" : "[ ]"

      const insertText = checkboxText
      const nextPos = currentPos + 3

      view.dispatch({
        changes: {
          from: currentPos,
          to: nextPos,
          insert: insertText,
        },
        selection: EditorSelection.cursor(nextPos, 1),
        userEvent: "input",
      })
    }

    const root = createRoot(wrap)
    root.render(
      <input type="checkbox" onChange={onCheckChange} checked={this.checked} />,
    )

    return wrap
  }

  ignoreEvent(event: Event) {
    if (event.type === "change" || event.type === "click") return false
    return true
  }
}
