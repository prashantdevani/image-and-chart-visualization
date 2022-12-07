type chartData = {
  date: string;
  value: number;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
};

type dataType = {
  date: Date | null;
  value: number;
  open: number;
  close: number;
  high: number;
  low: number;
};

const tickerSymbolData: { [index: string]: chartData[] } = {
  reliance: [
    {
      date: "26-Mar-12",
      value: 344.98,
    },
    {
      date: "27-Mar-12",
      value: 843.48,
    },
    {
      date: "28-Mar-12",
      value: 456.62,
    },
    {
      date: "29-Mar-12",
      value: 657.86,
    },
    {
      date: "30-Mar-12",
      value: 783.55,
    },
    {
      date: "2-Apr-12",
      value: 789.63,
    },
    {
      date: "3-Apr-12",
      value: 34.32,
    },
    {
      date: "4-Apr-12",
      value: 566.31,
    },
    {
      date: "5-Apr-12",
      value: 678.68,
    },
    {
      date: "9-Apr-12",
      value: 345.23,
    },
    {
      date: "10-Apr-12",
      value: 576.44,
    },
    {
      date: "11-Apr-12",
      value: 789.2,
    },
    {
      date: "12-Apr-12",
      value: 234.77,
    },
    {
      date: "13-Apr-12",
      value: 605.23,
    },
    {
      date: "16-Apr-12",
      value: 567.13,
    },
    {
      date: "17-Apr-12",
      value: 543.7,
    },
    {
      date: "18-Apr-12",
      value: 443.34,
    },
    {
      date: "19-Apr-12",
      value: 678.44,
    },
    {
      date: "20-Apr-12",
      value: 234.98,
    },
    {
      date: "23-Apr-12",
      value: 166.7,
    },
    {
      date: "24-Apr-12",
      value: 789.28,
    },
    {
      date: "25-Apr-12",
      value: 99,
    },
    {
      date: "26-Apr-12",
      value: 89.7,
    },
    {
      date: "27-Apr-12",
      value: 67,
    },
    {
      date: "30-Apr-12",
      value: 53.98,
    },
    {
      date: "1-May-12",
      value: 58.13,
    },
  ],
  tcs: [
    {
      date: "01-Mar-14",
      value: 400.98,
    },
    {
      date: "02-Mar-14",
      value: 300.48,
    },
    {
      date: "03-Mar-14",
      value: 970.62,
    },
    {
      date: "04-Mar-14",
      value: 456.86,
    },
    {
      date: "05-Mar-14",
      value: 6834.55,
    },
    {
      date: "06-Apr-14",
      value: 3453.63,
    },
    {
      date: "07-Apr-14",
      value: 465.32,
    },
    {
      date: "08-Apr-14",
      value: 657.31,
    },
    {
      date: "09-Apr-14",
      value: 213.68,
    },
    {
      date: "10-Apr-14",
      value: 456.23,
    },
    {
      date: "11-Apr-14",
      value: 45.44,
    },
    {
      date: "12-Apr-14",
      value: 567.2,
    },
    {
      date: "13-Apr-14",
      value: 678.77,
    },
    {
      date: "14-Apr-14",
      value: 788.23,
    },
    {
      date: "15-Apr-14",
      value: 789.13,
    },
    {
      date: "16-Apr-14",
      value: 789.7,
    },
    {
      date: "17-Apr-14",
      value: 456.34,
    },
    {
      date: "18-Apr-14",
      value: 456.44,
    },
    {
      date: "19-Apr-14",
      value: 678.98,
    },
    {
      date: "20-Apr-14",
      value: 678.7,
    },
    {
      date: "21-Apr-14",
      value: 456.28,
    },
    {
      date: "22-Apr-14",
      value: 345,
    },
    {
      date: "23-Apr-14",
      value: 456.7,
    },
    {
      date: "24-Apr-14",
      value: 567,
    },
    {
      date: "25-Apr-14",
      value: 879.98,
    },
    {
      date: "26-May-14",
      value: 234.13,
    },
  ],
};

const onChangeSymbol = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  if (value) {
    const data: chartData[] = tickerSymbolData[value] ?? [];
    renderChart({ width, height, data });
  }
};

const chartData = tickerSymbolData.reliance;

const parseTime = d3.timeParse("%d-%b-%y");
const bisectDate = d3.bisector(function (d: dataType) {
  return d.date;
}).left;

const margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

type renderChartObject = {
  width: number;
  height: number;
  data: chartData[];
};

function renderChart({ width, height, data: chartData }: renderChartObject) {
  const data = chartData.map((d) => {
    return {
      date: parseTime(d.date),
      value: +d.value,
      open: Math.round(d.value / 2),
      close: Math.round(d.value * 2),
      high: Math.round(d.value * 3),
      low: Math.round(d.value / 3),
    };
  });
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const valueLine = d3
    .line<dataType>()
    .x(function (d, index, data) {
      if (d.date) {
        return x(d.date);
      } else {
        return 0;
      }
    })
    .y(function (d) {
      return y(d.value);
    });

  const xDomain = <[Date, Date]>d3.extent(data, (d) => d?.date || new Date());
  x.domain(xDomain);
  const yDomain = <[number, number]>[0, d3.max(data, (d) => d.value)];
  y.domain(yDomain);

  const table = d3.select("#table-info");
  const mySvg = d3
    .select("#svgContainer")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const svg = mySvg
    .selectAll(".mainBody")
    .data([1])
    .join("g")
    .attr("class", "mainBody")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const lineSvg = svg
    .selectAll(".graphLine")
    .data([1])
    .join("g")
    .attr("class", "graphLine");

  const crossHair = svg
    .selectAll(".crossHairLine")
    .data([1])
    .join("line")
    .attr("class", "crossHairLine")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", height)
    .style("stroke", "black")
    .style("stroke-width", 2)
    .style("opacity", 0);

  const circle = svg
    .selectAll(".highlighDotBody")
    .data([1])
    .join("g")
    .attr("class", "highlighDotBody")
    .style("display", "none");

  lineSvg
    .selectAll(".myPath")
    .data([data])
    .join("path")
    .transition()
    .attr("class", "myPath line")
    .attr("d", valueLine);

  const dots = svg
    .selectAll(".lineCircle")
    .data(data)
    .join("circle")
    .transition()
    .attr("class", "lineCircle dots")
    .attr("r", 4)
    .attr("transform", (d) => `translate(${x(d?.date || 0)},${y(d.value)})`);

  const xAxis = svg
    .selectAll(".xAxis")
    .data([1])
    .join("g")
    .transition()
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")");

  // @ts-ignore: Unreachable code error
  xAxis.call(d3.axisBottom(x));

  const yAxis = svg
    .selectAll(".yAxis")
    .data([1])
    .join("g")
    .transition()
    .attr("class", "yAxis");

  // @ts-ignore: Unreachable code error
  yAxis.call(d3.axisLeft(y));

  circle
    .selectAll(".highlighDot")
    .data([1])
    .join("circle")
    .transition()
    .attr("class", "highlighDot")
    .style("fill", "none")
    .style("stroke", "red")
    .style("stroke-width", 4)
    .attr("r", 8);

  svg
    .selectAll(".hoverArea")
    .data([1])
    .join("rect")
    .on("mouseover", function () {
      circle.style("display", null);
      crossHair.style("opacity", 1);
    })
    .on("mouseout", function () {
      circle.style("display", "none");
      crossHair.style("opacity", 0);
      table.html("");
    })
    .on("mousemove", (event) => {
      // @ts-ignore: Unreachable code error
      const currentContext = this;
      const x0 = x.invert(d3.pointer(event, currentContext)[0]),
        i = bisectDate(data, x0, 1),
        d0: dataType = data[i - 1],
        d1: dataType = data[i];

      if (d0?.date && d1.date) {
        const d =
          x0.getTime() - d0?.date?.getTime() >
          d1?.date?.getTime() - x0.getTime()
            ? d1
            : d0;

        if (d?.date && d?.value) {
          crossHair.style("transform", "translateX(" + x(d.date) + "px)");
          circle
            .select("circle.highlighDot")
            .attr("transform", `translate(${x(d.date)}, ${y(d.value)})`);
        }
      }

      table.html(`<table>
    <tr>
      <th>Price</th>
      <td>${d1.value}</td>
    </tr>
    <tr>
      <th>Date</th>
      <td>${d1.date?.toLocaleDateString()}</td>
    </tr>
    <tr>
      <th>Open</th>
      <td>${d1.open}</td>
    </tr>
    <tr>
      <th>Close</th>
      <td>${d1.close}</td>
    </tr>
    <tr>
      <th>High</th>
      <td>${d1.high}</td>
    </tr>
    <tr>
      <th>Low</th>
      <td>${d1.low}</td>
    </tr>
  </table>`);
    })
    .transition()
    .attr("class", "hoverArea")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");
}

renderChart({ width, height, data: tickerSymbolData.reliance });
