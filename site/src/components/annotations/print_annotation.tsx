import { WidgetType } from "@codemirror/view"

export class PrintAnnotationWidget extends WidgetType {
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
