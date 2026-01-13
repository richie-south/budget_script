import { WidgetType } from "@codemirror/view"

export class ErrorAnnotationWidget extends WidgetType {
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
