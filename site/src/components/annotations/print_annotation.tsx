import { WidgetType } from "@codemirror/view"

export class PrintAnnotationWidget extends WidgetType {
  constructor(
    readonly val: any,
    readonly unit?: string,
  ) {
    super()
  }
  toDOM() {
    let wrap = document.createElement("span")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-budget-anno"
    wrap.textContent = this.unit ? `${this.val} ${this.unit}` : `${this.val}`
    return wrap
  }
}
