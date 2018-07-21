(function () {
  "use strict";

  var nodes,
    w = 750,
    h = 500,
    svg,
    scaleRadius,
    simulation,
    bubbles,
    // flatuicolors.com -> defo (wet asphalt, alizarin, sunflower)
    colors = d3.scaleOrdinal(["#34495e", "#f1c40f", "#e74c3c"]),  
    fileTotal = ["data/simple_FGR_total.json"];

  function showInfoOnMouseover(d) {
    let kind = switchKind(d),
      str = d.team + ": " + d.value + " " + kind;
    highlightBubbles(d);
  }

  function highlightBubbles(d) {
    bubbles.style("opacity", .2);
    let teamStr = (d.team).replace(/\s/g,"");
    console.log(d.team + ": " + d.kind + " - "+ d.value);
    d3.selectAll("#"+teamStr).style("opacity", 1);
    addToolTip(d);
  }

  function addToolTip(d) {
    // 
  }

  function switchKind(d) {
    let kind = "";
        switch(d.kind) {
          case "foul": 
            kind = "Fouls";
            break;
          case "red": 
            kind = "rote Karten";
            break;
          case "yellow":
            kind = "gelbe Karten";
            break;
          default:
            kind = "FEHLER";
            break;
        }
    return kind;
  }

  function hideInfoOnMouseout(d) {
    bubbles.style("opacity", 1);
  }

  function createSvg() {
    svg = d3.select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", "translate (0,0)");
  }

  function getScale() {
    scaleRadius = d3.scaleSqrt()
      .domain([
        d3.min(nodes, function(d) { return d.value }),
        d3.max(nodes, function(d) { return d.value })
      ])
      .range([5,50]);
  }

  function createSimulation() {
    simulation = d3.forceSimulation()
      .force("x", d3.forceX(w*0.9).strength(0.013))
      .force("y", d3.forceY(w/3).strength(0.06))
      .force("collide", d3.forceCollide(function(d) { return scaleRadius(d.value*1.1); }));
  }

  function createBubbles() {
    bubbles = svg.selectAll(".bubbles")
      .data(nodes)
      .enter().append("circle")
      .attr("class", "bubbles")
      .attr("id", function(d) {
        // regex nötig, um in showInfoOnMouseover die css-klasse auswählen zu können (dort ebenfalls geregext)
        let teamStr = (d.team).replace(/\s/g,"");
        return teamStr; 
      })
      .attr("r", function(d){
        return scaleRadius(d.value);
      })
      .attr("fill", function(d) {
        return colors(d.kind)
      })
      .style("stroke", "black")
      .style("stroke-width", 2)
      .on("mouseover", showInfoOnMouseover)
      .on("mouseout", hideInfoOnMouseout);
  }

  function makeChart() {
    createSvg();
    getScale();
    createSimulation();
    createBubbles();

    simulation.nodes(nodes)
      .on("tick", ticked);
  }

  function ticked() {
      bubbles
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }
  
  function dataReady(data) {
    nodes = data.sort(function (a, b) { return b.value - a.value; });
    console.log(nodes);
   makeChart();
  }

  function getData() {
    Promise.all(fileTotal.map(url => d3.json(url))).then(function(data) {
      dataReady(data[0]);
    })
  }
  
  getData();
})();