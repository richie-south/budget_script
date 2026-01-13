import { WidgetType } from "@codemirror/view"
import { ResponsiveLine } from "@nivo/line"
import { createRoot } from "react-dom/client"

export class LineChartAnnotationWidget extends WidgetType {
  constructor(readonly data: any[]) {
    super()
  }

  toDOM() {
    const wrap = document.createElement("div")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-piechart-anno"
    wrap.style.height = "260px" // Slightly taller to accommodate spaced-out legends
    wrap.style.width = "100%"

    const root = createRoot(wrap)

    // Calculate tick density:
    // If there is a lot of data, we only show roughly 6-10 labels on the X-axis.
    const firstSeries = this.data[0]?.data || []
    const dataLength = firstSeries.length
    let tickValues: any = undefined // Default: show all

    if (dataLength > 10) {
      tickValues = [
        firstSeries[0].x,
        firstSeries[firstSeries.length / 2].x,
        firstSeries[firstSeries.length - 1].x,
      ]
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
      <div style={{ width: "100%", height: "100%" }}>
        <ResponsiveLine
          data={this.data}
          theme={chartTheme}
          colors={["#6ee7b7", "#34d399", "#fbbf24"]}
          // Increased bottom margin (from 50 to 80) to fit both ticks and legends
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
            // Pass the calculated sparse array here
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
          pointSize={dataLength > 50 ? 0 : 6} // Hide points if data is extremely dense
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
              // Pushed down to 70 so it sits below the X-axis "Time" legend
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
    )

    return wrap
  }
}
