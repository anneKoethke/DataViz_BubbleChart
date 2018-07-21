(function () {
  "use strict";

  var nodes,
    chart = document.querySelector("#chart"),
    w = 1080,
    h = 500,
    legend,
    svg,
    infoRect,
    scaleRadius,
    simulation,
    bubbles,
    // colors from https://flatuicolors.com/palette/defo (wet asphalt, alizarin, sunflower)
    wetAsphaltBlack = "#34495e",
    alizarinRed = "#e74c3c",
    sunflowerYellow = "#f1c40f", 
    colors = d3.scaleOrdinal([wetAsphaltBlack, sunflowerYellow, alizarinRed]),  
    fileTotal = ["data/simple_FGR_total.json"];

  function showInfoOnMouseover(d) {
    highlightBubbles(d);
    addToolTip(d);
  }

  function highlightBubbles(d) {
    bubbles.style("opacity", .2);
    let teamStr = (d.team).replace(/\s/g,"");
    console.log(d.team + ": " + d.kind + " - "+ d.value);
    d3.selectAll("#"+teamStr).style("opacity", 1);
  }

  function addToolTip(d) {
    let kind = switchKind(d); // um string für Ausgabe zu bilden
    
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

  function createHeadding() {
    chart.innerHTML = "<h3 class='innerHeader'>Anzahl der Verstöße über alle Saisons (2006/07 - 20016/17)</h3>";
  }

  function createLegend() {
    // Legend for f,r,g colors
    legend = "<div class='legend'> <div><div id='foul'></div> Fouls</div> <div><div id='red'></div> rote Karten</div> <div><div id='yellow'></div> gelbe Karten</div></div>";
    chart.innerHTML += legend;
  }

  // not in the least responsive, beacause: 
  // if the chart is to be responsive, than all forceSimulation values have to responsively adjust correctly to that (which is hard to achieve) 
  function createSvg() {
    svg = d3.select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", "translate (0,0)");
  }

  function createInfoRect (d) {
    infoRect = svg.append("rect")
      .attr("class", "infoRect")
      .attr("x", 750)
      .attr("y", 20)
      .attr("width", 300)
      .attr("height", 400)
      .attr("rx", 0)
      .attr("ry", 0)
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("fill", "#fff");
  }

  function getScale() {
    scaleRadius = d3.scaleSqrt()
      .domain([ // get maximum and minimum value of the data as range
        d3.min(nodes, function(d) { return d.value; }),
        d3.max(nodes, function(d) { return d.value; })
      ]) // as the values tend between 0 and > 6.500, the range has to be small enough to display all circles in the chart container and yet great enough to make the circle sizes destinct (6.500 fouls beeing much more than e.g. 3 red cards) and the small circles seectable 
      .range([5,50]); 
  }

  function createSimulation() {
    simulation = d3.forceSimulation()
      .force("x", d3.forceX(w*0.6).strength(0.013))
      .force("y", d3.forceY(w*0.22).strength(0.06))
      .force("collide", d3.forceCollide(function(d) { return scaleRadius(d.value*1.1); }));
  }

  function createBubbles() {
    bubbles = svg.selectAll(".bubbles")
      .data(nodes)
      .enter().append("circle")
      .attr("class", "bubbles")
      .attr("id", function(d) {
        // need regex to use as CSS-clas in showInfoOnMouseover (there also selected via regex)
        let teamStr = (d.team).replace(/\s/g,"");
        return teamStr; 
      })
      .attr("r", function(d){
        return scaleRadius(d.value);
      })
      .attr("fill", function(d) {
        return colors(d.kind);
      })
      .style("stroke", "black")
      .style("stroke-width", 2)
      .on("mouseover", showInfoOnMouseover)
      .on("mouseout", hideInfoOnMouseout);
  }

  function makeChart() {
    // all chartparts are beeing defined
    createHeadding();
    createLegend();
    createSvg();
    createInfoRect();
    getScale();
    createSimulation();
    createBubbles();

    // start the simulation cycle
    simulation.nodes(nodes)
      .on("tick", ticked);
  }

  // redraws the chart on evy tick
  function ticked() {
      bubbles
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }
  
  // pass data to Chart creation
  function dataReady(data) {
    nodes = data.sort(function (a, b) { return b.value - a.value; });
    makeChart();
  }

  // load data from file
  function getData() {
    Promise.all(fileTotal.map(url => d3.json(url))).then(function(data) {
      dataReady(data[0]);
    });
  }
  
  getData();
})();


// toDo: - legende!