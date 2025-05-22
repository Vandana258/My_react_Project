// AmBarChart.js
import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function AmChart({ data }){
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    // Create root element
    const root = am5.Root.new(chartRef.current);

    // Set theme
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    // Create X-axis (names)
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "name",
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    // Create Y-axis (percentages)
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Create bar series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Percentage",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "percentage",
        categoryXField: "name",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{categoryX}: {valueY}%",
        }),
      })
    );

    // Add data
    xAxis.data.setAll(data);
    series.data.setAll(data);

    // Animate
    series.appear(1000);
    chart.appear(1000, 100);

    return () => root.dispose(); // Cleanup
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "500px" }}></div>;
};
