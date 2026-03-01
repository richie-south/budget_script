import { WidgetType } from "@codemirror/view"
import { ResponsivePie } from "@nivo/pie"
import { createRoot } from "react-dom/client"
import { CollapsibleBox } from "./box"

export interface PieChartDataItem {
  label: string
  value: number
}
const pieChartColors = [
  "#6ee7b7", // accent
  "#34d399", // accent-dim
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
]

export class PieChartAnnotationWidget extends WidgetType {
  private id: string

  constructor(readonly data: PieChartDataItem[], readonly line: number) {
    super()
    // Create a stable ID based on line and data hash
    this.id = `pie-${line}-${this.hashData()}`
  }

  private hashData(): string {
    return this.data.map((d) => `${d.label}:${d.value}`).join(",")
  }

  toDOM() {
    const wrap = document.createElement("div")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-annotation-wrapper"

    // Transform data for Nivo format
    const chartData = this.data.map((item, index) => ({
      id: item.label,
      label: item.label ?? String(item.value),
      value: item.value,
      color: pieChartColors[index % pieChartColors.length],
    }))

    // Render React component into the DOM element
    const root = createRoot(wrap)
    root.render(
      <CollapsibleBox id={this.id} title="Pie Chart">
        <div className="cm-piechart-anno">
          <Pie chartData={chartData} />
        </div>
      </CollapsibleBox>
    )

    return wrap
  }

  ignoreEvent() {
    return true
  }

  destroy(dom: HTMLElement) {
    // Note: In a production app, you'd want to properly unmount the React root
    // For simplicity, we're letting React handle cleanup
  }
}

function Pie({
  chartData,
}: {
  chartData: {
    id: string
    label: string
    value: number
    color: string
  }[]
}) {
  return (
    <div style={{ width: 480, height: 200 }}>
      <ResponsivePie
        data={chartData}
        margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
        innerRadius={0.5}
        padAngle={2}
        cornerRadius={4}
        activeOuterRadiusOffset={4}
        colors={{ datum: "data.color" }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.3]] }}
        enableArcLinkLabels={true}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="var(--text-secondary)"
        arcLinkLabelsThickness={1}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2.5]] }}
        theme={{
          text: {
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
          },
          tooltip: {
            container: {
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontSize: 12,
              borderRadius: 6,
              border: "1px solid var(--border)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            },
          },
        }}
      />
    </div>
  )
}
