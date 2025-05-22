// PieChartWithLegend.js
import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function PieChartWithLegend({ data }){
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    // 1. Create root element (chart container)
    const root = am5.Root.new(chartRef.current);

    // 2. Apply theme (optional for animations/styling)
    root.setThemes([am5themes_Animated.new(root)]);

    // 3. Create pie chart container
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    // Create series (data slices)
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        valueField: "percentage", // change field as needed
        categoryField: "name",
        legendLabelText: "{category}: {valuePercentTotal.formatNumber('0.0')}%",
        legendValueText: "{value}",
      })
    );

    series.data.setAll(data);

    // Add a legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: root.verticalLayout,
      })
    );

    legend.data.setAll(series.dataItems);

    // Animate on load
    series.appear(1000, 100);

    return () => root.dispose(); // cleanup
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "500px" }}></div>;
};
