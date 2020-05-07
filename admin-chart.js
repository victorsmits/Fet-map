/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
let chart = am4core.create("chartdiv", am4charts.XYChart);

// Add data
chart.data = generateChartData();

// Create axes
let pinAxis = chart.xAxes.push(new am4charts.ValueAxis());
pinAxis.renderer.minGridDistance = 50;

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = "speed";
series.dataFields.valueX = "pin";
series.strokeWidth = 2;
series.minBulletDistance = 10;
series.tooltipText = "{valueY}";
series.tooltip.pointerOrientation = "vertical";
series.tooltip.background.cornerRadius = 20;
series.tooltip.background.fillOpacity = 0.5;
series.tooltip.label.padding(12,12,12,12)

// Add scrollbar
chart.scrollbarX = new am4charts.XYChartScrollbar();
chart.scrollbarX.series.push(series);

// // Add cursor
chart.cursor = new am4charts.XYCursor();
chart.cursor.xAxis = pinAxis;
chart.cursor.snapToSeries = series;

function generateChartData() {
    let chartData = [];
    for (let i = 0; i < 500; i++) {

        chartData.push({
            speed: Math.random() * 500,
            pin: i
        });
    }
    return chartData;
}

