import { WidgetType } from "@codemirror/view"
import { createRoot } from "react-dom/client"
import { CollapsibleBox } from "./box"
import { ErrorBoundary } from "../error"

export class ProgressAnnotationWidget extends WidgetType {
  private id: string

  constructor(readonly values: any[], readonly line: number) {
    super()
    this.id = `progress-${line}`
  }

  toDOM() {
    const wrap = document.createElement("div")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-annotation-wrapper"

    const value = this.values[0]?.value ?? 0
    const max = this.values[1]?.value ?? 100

    const root = createRoot(wrap)
    root.render(
      <ErrorBoundary fallback={<div className="error-ui">Failed to render progress.</div>}>
        <CollapsibleBox id={this.id} title="Progress">
          <div className="cm-progress-anno">
            <progress value={value} max={max} />
          </div>
        </CollapsibleBox>
      </ErrorBoundary>
    )

    return wrap
  }
}
