import { WidgetType } from "@codemirror/view"
import { ResponsiveBar } from "@nivo/bar"
import { createRoot } from "react-dom/client"
import { CollapsibleBox } from "./box"
import { ErrorBoundary } from "../error"

export interface BarChartDataItem {
  label: string
  value: number
}

const barChartColors = [
  "#6ee7b7", // accent
  "#34d399", // accent-dim
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
]

export class BarChartAnnotationWidget extends WidgetType {
  private id: string

  constructor(
    readonly data: BarChartDataItem[],
    readonly line: number,
  ) {
    super()
    // Create a stable ID based on line and data hash
    this.id = `bar-${line}-${this.hashData()}`
  }

  private hashData(): string {
    return this.data.map((d) => `${d.label}:${d.value}`).join(",")
  }

  toDOM() {
    const wrap = document.createElement("div")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-annotation-wrapper"

    // Transform data for Nivo Bar format
    // Each item is an object, and we use 'label' as the index and 'value' as the key
    const chartData = this.data.map((item, index) => ({
      label: item.label ?? String(item.value),
      value: item.value,
      color: barChartColors[index % barChartColors.length],
    }))

    const root = createRoot(wrap)
    root.render(
      <ErrorBoundary fallback={<div className="error-ui">Failed to render bar chart.</div>}>
        <CollapsibleBox id={this.id} title="Bar Chart">
          <div className="cm-barchart-anno">
            <Bar chartData={chartData} />
          </div>
        </CollapsibleBox>
      </ErrorBoundary>,
    )

    return wrap
  }

  ignoreEvent() {
    return true
  }

  destroy(dom: HTMLElement) {
    // React handles cleanup in modern versions, but root.unmount()
    // is recommended if storing the root reference
  }
}

function Bar({
  chartData,
}: {
  chartData: {
    label: string
    value: number
    color: string
  }[]
}) {
  return (
    <div style={{ width: 480, height: 200 }}>
      <ResponsiveBar
        data={chartData}
        keys={["value"]}
        indexBy="label"
        margin={{ top: 20, right: 30, bottom: 40, left: 50 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ data }) => data.color}
        borderRadius={4}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.3]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        enableLabel={true}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 2.5]] }}
        theme={{
          text: {
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            fill: "var(--box-text-secondary)",
          },
          axis: {
            ticks: {
              line: { stroke: "var(--border)" },
              text: { fill: "var(--box-text-secondary)" },
            },
            domain: {
              line: { stroke: "var(--border)" },
            },
          },
          grid: {
            line: {
              stroke: "var(--border)",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            },
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
        role="application"
        ariaLabel="Bar chart representation"
      />
    </div>
  )
}
