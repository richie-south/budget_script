import { WidgetType } from "@codemirror/view"
import { ResponsiveLine } from "@nivo/line"
import { createRoot } from "react-dom/client"
import { CollapsibleBox } from "./box"
import { ErrorBoundary } from "../error"

export class LineChartAnnotationWidget extends WidgetType {
  private id: string

  constructor(
    readonly data: any[],
    readonly line: number,
  ) {
    super()
    // Create a stable ID based on line
    this.id = `predict-${line}`
  }

  ignoreEvent() {
    return true
  }

  toDOM() {
    const wrap = document.createElement("div")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-annotation-wrapper"

    const root = createRoot(wrap)

    // Calculate tick density:
    // If there is a lot of data, we only show roughly 6-10 labels on the X-axis.
    const firstSeries = this.data[0]?.data || []
    const dataLength = firstSeries.length
    let tickValues: any = undefined // Default: show all

    if (dataLength > 10) {
      try {
        tickValues = [
          firstSeries[0].x,
          firstSeries[firstSeries.length / 2].x,
          firstSeries[firstSeries.length - 1].x,
        ]
      } catch (error) {}
    }

    const chartTheme = {
      background: "transparent",
      text: {
        fontSize: 11,
        fill: "#8888a0",
        fontFamily: "'JetBrains Mono', monospace",
      },
      axis: {
        domain: {
          line: { stroke: "#2a2a38", strokeWidth: 1 },
        },
        legend: {
          text: { fill: "#55556a", fontWeight: 600 },
        },
        ticks: {
          line: { stroke: "#2a2a38", strokeWidth: 1 },
          text: { fill: "#8888a0" },
        },
      },
      grid: {
        line: { stroke: "#1f1f2a", strokeWidth: 1 },
      },
      tooltip: {
        container: {
          background: "#1a1a24",
          color: "#f0f0f5",
          fontSize: 12,
          borderRadius: 6,
          border: "1px solid #2a2a38",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        },
      },
      crosshair: {
        line: {
          stroke: "#6ee7b7",
          strokeWidth: 1,
          strokeDasharray: "4 4",
        },
      },
    }

    root.render(
      <ErrorBoundary fallback={<div className="error-ui">Failed to render prediction chart.</div>}>
        <CollapsibleBox id={this.id} title="Prediction Chart">
          <div
            className="cm-piechart-anno"
            style={{ height: "260px", width: "100%" }}
          >
            <div style={{ width: "100%", height: "100%" }}>
              <ResponsiveLine
                data={this.data}
                theme={chartTheme}
                colors={["#6ee7b7", "#34d399", "#fbbf24"]}
                margin={{ top: 20, right: 30, bottom: 80, left: 50 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: false,
                  reverse: false,
                }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Time",
                  legendOffset: 40,
                  legendPosition: "middle",
                  tickValues: tickValues,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Value",
                  legendOffset: -40,
                  legendPosition: "middle",
                }}
                enableGridX={false}
                enableGridY={true}
                pointSize={dataLength > 50 ? 0 : 6}
                pointColor="#1a1a24"
                pointBorderWidth={2}
                pointBorderColor={{ from: "seriesColor" }}
                useMesh={true}
                enableArea={true}
                areaOpacity={0.05}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 70,
                    itemsSpacing: 10,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 10,
                    symbolShape: "circle",
                    itemTextColor: "#8888a0",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemBackground: "rgba(255, 255, 255, .03)",
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            </div>
          </div>
        </CollapsibleBox>
      </ErrorBoundary>,
    )

    return wrap
  }
}
