(function () {

  var fileTotal = ["data/simple_FGR_total.json"],
    // data (sorted via kind, see below)
    nodes,
    // d3 elements
    w = 960,
    h = 600,
    svg,
    scaleRadius,
    simulation,
    teamGroups,
    bubbles,
    texts,
    teamNames,
    // flatuicolors.com -> defo (wet asphalt, alizarin, sunflower)
    colors = d3.scaleOrdinal(["#34495e", "#f1c40f", "#e74c3c"]);

  // loading the data from file
  function getData() {
    Promise.all(fileTotal.map(url => d3.json(url))).then(function(data) {
      dataReady(data[0]);
    })
  }

  // sorting was advised by Jim Vallandingham, because small nodes might be skipped otherwise
  // (https://github.com/vlandham/bubble_chart_v4/blob/master/src/bubble_chart.js). line 122: "sort them to prevent occlusion of smaller nodes."
  function dataReady(data) {
    nodes = data.sort(function (a, b) { return b.value - a.value; });
    makeChart();
  }
  
  // main Chart building function
  function makeChart() {
    createSvg();
    getScale();
    createSimulation();
    createTeamGroups();
    createBubbles();
    createTexts();
    // after building all chart elements the forceSimulation is recalculated several times and the concerning objects (bubbles and their texts) redrawn
    simulation.nodes(nodes)
      .on("tick", ticked);
  }

  function createSvg() {
    svg = d3.select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", "translate (0,0)");
  }

  // the Scale is used for the size (radius r) of all circles: it takes the minimum and maximum value of the data and scales every value in between to the range 5 till 50 - so the user can actually see and hover over the very small amounts of red cards and still gets the impression of the vast amount of fouls
  function getScale() {
    scaleRadius = d3.scaleSqrt()
      .domain([
        d3.min(nodes, function(d) { return d.value }),
        d3.max(nodes, function(d) { return d.value })
      ])
      .range([5,50]);
  }

  // This force simulation was manually changed to the best possible outlook given the limitation to the height and width of the svg. Yet given the very different sums in the data the collision force doesn't work perfekt: foul circles a pushed farther apart (due to there hugh numbers), reds and yellows are a bit squeezed)
  function createSimulation() {
    simulation = d3.forceSimulation()
      .force("x", d3.forceX(w*0.7).strength(0.02))
      .force("y", d3.forceY(w*0.3).strength(0.081))
      .force("collide", d3.forceCollide(function(d) { return scaleRadius(d.value*2.3); }));
  }

  // needed for placing the texts to the right bubbles
  function createTeamGroups() {
    teamGroups = svg.selectAll(".bubbles")
      .data(nodes).enter()
        .append("g")
          .attr("class", "teamGroup")
          .attr("id", chopTeamIdToValidCss);
  }

  // this regex function helps to select the foul, red and yellow bubbles of a certain team via (valid) CSS. The regex removes the spaces
  function chopTeamIdToValidCss(d) {
    let teamStr = (d.team).replace(/\s/g,"");
    return teamStr;
  }

  // due to some d3 issues with multiple data-sources, ranges and forceSimulations, the data had to be changed from one data object per team holding all three values (foul, red yellow) to three data objects per team holding one of these values each. Therefore, they are all .bubbles only diferentiated via d.kind === color.
  function createBubbles() {
    bubbles = teamGroups.append("circle")
      .attr("class", "bubbles")
      .attr("id", chopTeamIdToValidCss)
      .attr("r", function(d){ return scaleRadius(d.value)*1.3; })
      .attr("fill", function(d) { return colors(d.kind) })
      .style("stroke", "black")
      .style("stroke-width", 2)
      .on("mouseover", showInfoOnMouseover)
      .on("mouseout", hideInfoOnMouseout);
  }

  // the texts are linked to the bubbles and show their value (fouls, red and yellow cards)
  function createTexts() {
    texts = teamGroups.append("text")
      .text(function(d) { return d.value; })
      .attr("class", "bubbleText")
      .attr("id", chopTeamIdToValidCss)
      .attr("dy", changePositionOfAmountViaKind)
      .attr("text-anchor", "middle")
      .style("font-size", changeFontSizeOfAmount)
      .style("fill", changeFontColor)
      .style("display", "none");

    teamNames = teamGroups.append("text")
      .text(function(d) { return d.team; })
      .attr("class", "teamName")
      .attr("id", chopTeamIdToValidCss)
      .attr("x", 20)
      .attr("y", 50)
      .attr("text-anchor", "start")
      .style("font-size", "30px")
      .style("display", "none");
  }

  // changes the Fontsize of the text inside the bubbles
  function changePositionOfAmountViaKind(d) {
    let dyPos = "5px";
    if (d.kind === "yellow") {
      dyPos = "6px";
    } else if (d.kind === "foul") {
      dyPos = "10px";
    }
    return dyPos;
  }

  // changes the Fontsize of the text inside the bubbles
  function changeFontSizeOfAmount(d) {
    let fontSize = "16px";
    if (d.kind === "yellow") {
      fontSize = "18px";
    } else if (d.kind === "foul") {
      fontSize = "30px";
    }
    return fontSize;
  }

  // changes fontColor (fill) according to kind
  function changeFontColor(d) {
    let fontColor = "black";
    if (d.kind === "foul") {
      fontColor = "white";
    } else if (d.kind === "red") {
      fontColor = "white";
    }
    return fontColor;
  }

  // causes the 'movement' (redrawing) of the bubbles and texts 
  function ticked() {
      bubbles
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
      texts
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
    }

  // shows the amount of fouls, reds and yellows on each of the three bubbles making a certain team
  function showInfoOnMouseover(d) {
    texts.style("display", "inherit");
    d3.select(".teamName#"+chopTeamIdToValidCss(d)).style("display", "inherit");
    highlightBubbles(d);
  }

  // all teamGroups, but the team on which the user hovers, are set to low opacity 
  function highlightBubbles(d) {
    teamGroups.style("opacity", .2);
    // selection of the opac team bubbles via css-di and chop function (see above)
    d3.selectAll("#"+chopTeamIdToValidCss(d)).style("opacity", 1);
  }

  // all teamGroups are displayed again, texts are hidden, the explaination replaces the info one one team
  function hideInfoOnMouseout(d) {
    teamGroups.style("opacity", 1);
    texts.style("display", "none");
    teamNames.style("display", "none");
  }
  
  getData();
})();