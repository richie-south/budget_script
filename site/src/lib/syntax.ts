import { HighlightStyle } from "@codemirror/language"
import { tags as t } from "@lezer/highlight"
import { StreamLanguage } from "@codemirror/language"
import { Tag } from "@lezer/highlight"

const customTags = {
  unit: Tag.define(),
  month: Tag.define(),
  command: Tag.define(),
  recurrence: Tag.define(),
}

export const budgetHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#a1a1aa" },
  { tag: customTags.month, color: "#a1a1aa" },
  { tag: customTags.recurrence, color: "#a1a1aa" },
  { tag: customTags.command, color: "#34d399", fontWeight: "bold" },

  { tag: t.number, color: "white", fontWeight: "bold" },
  { tag: t.operator, color: "#c7c7cc" },
  { tag: customTags.unit, color: "#a1a1aa", fontStyle: "italic" },
])

export const budgetLanguage = StreamLanguage.define({
  token(stream) {
    // Commands
    if (stream.match(/^#(progress|pie|predict)\b/)) return "command"

    // Keywords
    if (stream.match(/\b(in|from)\b/)) return "keyword"

    // Months
    if (stream.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/))
      return "month"

    // Months
    if (stream.match(/(?:\/month|\/day|\/year)\b/)) return "recurrence"

    // Numbers
    if (stream.match(/\d+/)) return "number"

    // Units
    if (stream.match(/[a-zA-Z]+/, false)) {
      if (/\d/.test(stream.string[stream.pos - 1])) {
        stream.match(/[a-zA-Z]+/)
        return "unit"
      }
    }

    // Operators
    if (stream.match(/[=+\-*\/]/)) return "operator"

    stream.next()
    return null
  },

  tokenTable: {
    unit: customTags.unit,
    month: customTags.month,
    command: customTags.command,
    recurrence: customTags.recurrence,
    number: t.number,
    operator: t.operator,
    comment: t.comment,
  },
})
