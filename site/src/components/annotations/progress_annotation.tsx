import { WidgetType } from "@codemirror/view"

export class ProgressAnnotationWidget extends WidgetType {
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
