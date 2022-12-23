const houseStart = 11;
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const alphabets = ["A", "B", "C", "D", "E", "F", "G"];
const numbersStr = numbers.map((n, i) => `${houseStart + i}`);
const getHouseNumber = d3.scaleOrdinal().domain(numbersStr).range(numbers);
const getHouseAlphabet = d3.scaleOrdinal().domain(numbersStr).range(alphabets);
for (let i = 0; i < numbers.length; i++) {
  const houseNumber = getHouseNumber(`${houseStart + i}`);
  const houseLatter = getHouseAlphabet(`${houseStart + i}`);
}
const data = [
  {
    radius: 10,
    symbol: "Vn",
    x: 10,
    y: 10,
    labelX: "x",
    labelY: "y",
    name: "ok",
  },
];

const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 400 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const START_AXIS = 1;
const END_AXIS = 13;

const START = START_AXIS;
const END = END_AXIS;
const MIDDLE = 7;

const TICK_SIZE = END

// Create the SVG container and set the dimensions
const mySvg = d3
  .select("#svgContainer")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const x = d3
  .scaleLinear()
  .domain([START_AXIS, END_AXIS])
  .range([0, width])
  .clamp(true);

const y = d3
  .scaleLinear()
  .domain([START_AXIS, END_AXIS])
  .range([height, 0])
  .clamp(true);

const AXIS_Opacity = 1;

// Create the chart group and translate it to the center of the SVG
const svg = mySvg
  .selectAll(".mainBody")
  .data([1])
  .join("g")
  .attr("class", "mainBody")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xAxisGrid = d3
  .axisBottom(x)
  .tickSize(-height)
  // @ts-ignore: Unreachable code error
  // .tickFormat("")
  .ticks(TICK_SIZE);

const yAxisGrid = d3
  .axisLeft(y)
  .tickSize(-width)
  // @ts-ignore: Unreachable code error
  // .tickFormat("")
  .ticks(TICK_SIZE);

// Create grids.
svg
  .selectAll(".x_axis_grid")
  .data([1])
  .join("g")
  .attr("class", "x_axis_grid")
  // .attr("color", "gainsboro")
  .attr("transform", "translate(0," + height + ")")
  .style("opacity", AXIS_Opacity)
  // @ts-ignore: Unreachable code error
  .call(xAxisGrid)
  .selectAll("line")
  .attr("stroke", "gainsboro")

svg
  .selectAll(".y_axis_grid")
  .data([1])
  .join("g")
  .attr("color", "black")
  .attr("class", "y_axis_grid")
  .style("opacity", AXIS_Opacity)
  // @ts-ignore: Unreachable code error
  .call(yAxisGrid)
  .selectAll("line")
  .attr("stroke", "gainsboro");

const lines = [
  {
    x1: START,
    y1: END,
    x2: END,
    y2: START,
  },
  {
    x1: START,
    y1: START,
    x2: END,
    y2: END,
  },
  {
    x1: START,
    y1: MIDDLE,
    x2: MIDDLE,
    y2: END,
  },
  {
    x1: END,
    y1: MIDDLE,
    x2: MIDDLE,
    y2: START,
  },
  {
    x1: MIDDLE,
    y1: START,
    x2: START,
    y2: MIDDLE,
  },
  {
    x1: MIDDLE,
    y1: START,
    x2: START,
    y2: MIDDLE,
  },
  {
    x1: END,
    y1: MIDDLE,
    x2: MIDDLE,
    y2: END,
  },
  {
    x1: START,
    y1: START,
    x2: START,
    y2: END,
  },
  {
    x1: END,
    y1: END,
    x2: END,
    y2: START,
  },
  {
    x1: START,
    y1: START,
    x2: END,
    y2: START,
  },
  {
    x1: END,
    y1: END,
    x2: START,
    y2: END,
  },
];

const linesGroup = svg
  .select(".linesGroup")
  .data([1])
  .join("g")
  .attr("class", "linesGroup")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const vline = d3
  .line()
  .x((d) => {
    return x(d[0]);
  })
  .y((d) => {
    return y(d[1]);
  });

linesGroup
  .selectAll(".natalChartPath")
  .data([
    [
      [START, START],
      [START, END],
      [END, END],
      [END, START],
      [START, START],
      [END, END],
      [START, END],
      [END, START],
      [END, MIDDLE],
      [MIDDLE, END],
      [START, MIDDLE],
      [MIDDLE, START],
      [END, MIDDLE],
    ],
  ])
  .join("path")
  .attr("class", "natalChartPath")
  .attr("fill", "none")
  .attr("stroke-linejoin", "round")
  .attr("stroke", "#CC0000")
  .attr("stroke-width", "2")
  .attr("d", vline)
  .call(chartTransition);

linesGroup
  .selectAll(".myText")
  .data([1])
  .join("text")
  .attr("x", x(7))
  .attr("y", y(10))
  .html("house");

function chartTransition(path) {
  path.transition().duration(2000).attrTween("stroke-dasharray", tweenDash);
}

function tweenDash() {
  const l = this.getTotalLength(),
    i = d3.interpolateString("0," + l, l + "," + l);
  return (t) => i(t);
}

// let points = ["100","100 150","25 150","75 200","0"]
// points = [];

// lines.forEach((line) => {
//   points.push(`${x(line.x1)} ${y(line.y1)}, ${x(line.x2)} ${y(line.y2)}`);
// })

// linesGroup
//   .selectAll(".natalChart")
//   .data([1])
//   .join("polygon")
//   .attr("class", "natalChart")
//   .attr("points", "100,100 150,25 150,75 200,0")
//   .attr("fill", "none")
//   .attr("stroke-linejoin", "round")
//   .attr("stroke", "black")
//   .attr("stroke-width", 2)
//   .attr("fill-rule", "nonzero")

// linesGroup
//   .selectAll(".line")
//   .data(lines)
//   .join("line")
//   .attr("class", ".line")
//   .style("stroke", "black")
//   .style("stroke-width", 2)
//   .attr("x1", (d) => x(MIDDLE))
//   .attr("y1", (d) => y(MIDDLE))
//   .attr("x2", (d) => x(MIDDLE))
//   .attr("y2", (d) => y(MIDDLE))
//   .style("opacity", 0)
//   .transition()
//   .duration(500)
//   .attr("x1", (d) => x(d.x1))
//   .attr("y1", (d) => y(d.y1))
//   .attr("x2", (d) => x(d.x2))
//   .attr("y2", (d) => y(d.y2));
