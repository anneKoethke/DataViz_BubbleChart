(function () {

  var file = ["data/season_16_17.json"],
    // container for d3 elements (svg etc.)
    chart = document.querySelector("#chart"),
    // HTML elements for Season choosing
    selectionLiList = document.querySelectorAll(".selection li"),
    infoHeader = document.querySelector("#infoHeader"),
    infoShort = document.querySelector("#shortInfo"),
    infoContent = document.querySelector("#infoContent"),
    // css-colors (flatuicolors)
    fColor = "#34495e",
    rColor = "#e74c3c",
    yColor = "#f1c40f",
    // data arrays
    nodes,
    homeList,
    awayList,
    // d3 elements
    svgHome,
    svgAway,
    group,
    margin = { top: 10, right: 10, bottom: 10, left: 10 },
    // responsive in width
    w = chart.clientWidth,
    width = w - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom, 
    // scales
    homeDatesScale,
    awayDatesScale,
    homeYScale,
    awayYScale,
    // calls
    homeAxisCall,
    awayAxisCall,
    homeYAxisCall,
    awayYAxisCall,
    // axes
    homeAxis,
    homeAxisXPos = height*0.9,
    awayAxis,
    awayAxisXPos = height*0.9,
    homeYAxis,
    awayYAxis,
    // flatuicolors.com -> defo (wet asphalt, alizarin, sunflower)
    fColor = "#34495e",
    rColor = "#e74c3c",
    yColor = "#f1c40f";
  
  // get data frm file
  function getData() {
    Promise.all(file.map(url => d3.json(url))).then(function(data) {
      dataReady(data[0]);
    });
  }

  // make data global, create container svg, make UI elements usable
  function dataReady(arr) {
    nodes = arr;
    setOnClickListeners();
  }

  // sets Listener for the season lis of selection-ul: connects HTML-Element to data and to visualisation
  function setOnClickListeners() {
    for (let i = 0; i < selectionLiList.length; i++) {
      selectionLiList[i].addEventListener("click", function() {
        // visualizes the clicked on team 'button'
        setBackgroundColorOfSelectionLi(this);
        chopDataToSelectedTeam(selectionLiList[i].id);
      })
    }
  }

  // makes sure, backgroundcolor is changed only at the clicked li-team-element (team-'button')
  function setBackgroundColorOfSelectionLi(obj) {
    for (let i = 0; i < selectionLiList.length; i++) {
      selectionLiList[i].style.backgroundColor = "white";
    }
    obj.style.backgroundColor = "#d3d3d3"; // light gray
  }

  // data get tailored to the chosen club (via li-selection)
  function chopDataToSelectedTeam(id) {
    // empty old data arrays
    homeList = [];
    awayList = [];
    for (let i = 0; i < nodes.length; i++) {
      // curretn team as HomeTeam
      if (nodes[i].HomeTeam === id) {
        let date = nodes[i].Date,
          fCount = nodes[i].HF,
          rCount = nodes[i].HR,
          yCount = nodes[i].HY;
        homeList.push({
          "date" : date, 
          "foul" : fCount, 
          "red" : rCount, 
          "yellow" : yCount
        }); 
      }
      // current team as AwayTeam
      if (nodes[i].AwayTeam === id) {
        let date = nodes[i].Date,
          fCount = nodes[i].AF,
          rCount = nodes[i].AR,
          yCount = nodes[i].AY;
        awayList.push({
          "date" : date, 
          "foul" : fCount, 
          "red" : rCount, 
          "yellow" : yCount
        }); 
      }
    }
    createChartContent();
  }

  // the making of the visualization
  function createChartContent() {
    removeOldContent();
    createSvg();
    getAxisScales();
    getCalls();
    drawAxes();
    labelYAxes();
    drawBars();
    addAmountText();
  } 

  // creates and connects svg and inner group element to HTML chart div
  function createSvg() {
    svgHome = d3.select(chart)
      .append("svg")
        .attr("class", "svgHome")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svgAway = d3.select(chart)
      .append("svg")
        .attr("class", "svgAway")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  function getAxisScales() {
    let maxFoul = 28; // sowohl bei heim als auch auswärts
    // xScales
    homeDatesScale = d3.scaleBand()
      .domain(homeList.map(function(d) { return d.date }))
      .rangeRound([ (margin.left*5),(width-(margin.right*4)) ]);
    awayDatesScale = d3.scaleBand()
      .domain(awayList.map(function(d) { return d.date }))
      .rangeRound([ (margin.left*5),(width-(margin.right*4)) ]);
    // yScales
    homeYScale = d3.scaleLinear() 
      .domain([ 0, maxFoul ])
      .range([ height*0.9, margin.top ]);
    awayYScale = d3.scaleLinear()
      .domain([ 0, maxFoul ])
      .range([ height*0.9, margin.top ]);

  }

  // where to position the value labels on the axes
  function getCalls() {
    homeAxisCall = d3.axisBottom(homeDatesScale);
    homeYAxisCall = d3.axisLeft(homeYScale);
    awayAxisCall = d3.axisBottom(awayDatesScale);
    awayYAxisCall = d3.axisLeft(awayYScale);
  }

  function drawAxes() {
    homeAxis = svgHome.append("g")
      .attr("class", "homeAxis")
      .attr("transform", "translate("+ [0, height*0.9] +")")
      .call(homeAxisCall)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("transform", "rotate(-45)");

    awayAxis = svgAway.append("g")
      .attr("class", "awayAxis")
      .attr("transform", "translate("+ [0, height*0.9] +")")
      .call(awayAxisCall)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("transform", "rotate(-45)");

    homeYAxis = svgHome.append("g")
      .attr("class", "homeYAxis")
      .attr("transform", "translate("+ (margin.left*6) +",0)")
      .call(homeYAxisCall);

    awayYAxis = svgAway.append("g")
      .attr("class", "awayYAxis")
      .attr("transform", "translate("+ (margin.left*6) +",0)")
      .call(awayYAxisCall);
  }

  function labelYAxes() {
    svgHome.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1.5em")
      .style("text-anchor", "middle")
      .text("Heimspiele");

    svgAway.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1.5em")
      .style("text-anchor", "middle")
      .text("Auswärtsspiele");
  }

  function drawBars() {
    drawHomeBars();
    drawAwayBars();
  }

  function drawHomeBars () {
    let homeWidth = homeDatesScale.bandwidth()/2,
      XYTranslate = [3,0];
    
    svgHome.selectAll(".foulHome")
      .data(homeList).enter()
        .append("rect")
          .attr("class", "foulHome")
          .attr("id", function(d) { return d.date })
          .attr("x", function(d) { return homeDatesScale(d.date)})
          .attr("y", function(d) { return homeYScale(d.foul) })
          .attr("width", homeDatesScale.bandwidth())
          .attr("height", function(d) { return height*0.9 - homeYScale(d.foul) })
          .attr("transform", "translate("+  XYTranslate +")")
          .attr("fill", fColor)
          .style("stroke", "black")
          .style("stroke-width", 2);
    
    svgHome.selectAll(".yellowHome")
      .data(homeList).enter()
        .append("rect")
          .attr("class", "yellowHome")
          .attr("id", function(d) { return d.date })
          .attr("x", function(d) { return homeDatesScale(d.date) })
          .attr("y", function(d) { return homeYScale(d.yellow) })
          .attr("width", homeWidth)
          .attr("height", function(d) { return height*0.9 - homeYScale(d.yellow) })
          .attr("transform", "translate("+  XYTranslate +")")
          .attr("fill", yColor)
          .style("stroke", "black")
          .style("stroke-width", 2);
    
    svgHome.selectAll(".redHome")
      .data(homeList).enter()
        .append("rect")
          .attr("class", "redHome")
          .attr("id", function(d) { return d.date })
          .attr("x", function(d) { return homeDatesScale(d.date) + homeWidth })
          .attr("y", function(d) { return homeYScale(d.red) })
          .attr("width", homeWidth)
          .attr("height", function(d) { return height*0.9- homeYScale(d.red) })
          .attr("transform", "translate("+  XYTranslate +")")
          .attr("fill", rColor)
          .style("stroke", "black")
          .style("stroke-width", 2);
  }

  function drawAwayBars() {
    let awayWidth = awayDatesScale.bandwidth()/2,
      XYTranslate = [3,0];

    svgAway.selectAll(".foulAway")
      .data(awayList).enter()
        .append("rect")
          .attr("class", "foulAway")
          .attr("id", function(d) { return d.date })
          .attr("x", function(d) { return awayDatesScale(d.date)})
          .attr("y", function(d) { return awayYScale(d.foul) }) 
          .attr("width", awayDatesScale.bandwidth())
          .attr("height", function(d) { return height*0.9 - awayYScale(d.foul) })
          .attr("transform", "translate("+  XYTranslate +")")
          .attr("fill", fColor)
          .style("stroke", "black")
          .style("stroke-width", 2);
    
    svgAway.selectAll(".yellowAway")
      .data(awayList).enter()
        .append("rect")
          .attr("class", "yellowAway")
          .attr("id", function(d) { return d.date })
          .attr("x", function(d) { return awayDatesScale(d.date)})
          .attr("y", function(d) { return awayYScale(d.yellow) }) 
          .attr("width", awayWidth)
          .attr("height", function(d) { return height*0.9 - awayYScale(d.yellow) })
          .attr("transform", "translate("+  XYTranslate +")")
          .attr("fill", yColor)
          .style("stroke", "black")
          .style("stroke-width", 2);
    
    svgAway.selectAll(".redAway")
      .data(awayList).enter()
        .append("rect")
          .attr("class", "redAway")
          .attr("id", function(d) { return d.date })
          .attr("x", function(d) { return awayDatesScale(d.date) + awayWidth })
          .attr("y", function(d) { return awayYScale(d.red)}) 
          .attr("width", awayWidth)
          .attr("height", function(d) { return height*0.9 - awayYScale(d.red) })
          .attr("transform", "translate("+  XYTranslate +")")
          .attr("fill", rColor)
          .style("stroke", "black")
          .style("stroke-width", 2);
  }

  function addAmountText() {
    addAwayAmount();
    addHomeAmount();
  }

  function addHomeAmount() {
    let homeWidth = homeDatesScale.bandwidth()/2;

    svgHome.selectAll(".foulText")
      .data(homeList).enter()
        .append("text")
          .text(function(d) { return d.foul })
          .attr("x", function(d) { return homeDatesScale(d.date) })
          .attr("y", function(d) { return homeYScale(d.foul) }) 
          .attr("transform", "translate("+ [20, 23] +")")
          .attr("class", "foulText")
          .attr("fill", "white");
    
    svgHome.selectAll(".yellowText")
      .data(homeList).enter()
        .append("text")
          .text(function(d) { return d.yellow })
          .attr("x", function(d) { return homeDatesScale(d.date) })
          .attr("y", function(d) { return homeYScale(d.yellow) }) 
          .attr("transform", "translate("+ [9, -5] +")")
          .attr("class", "yellowText")
          .attr("fill", yColor);
    
    svgHome.selectAll(".redText")
      .data(homeList).enter()
        .append("text")
          .text(function(d) { return d.red })
          .attr("x", function(d) { return homeDatesScale(d.date) + homeWidth*1.5 })
          .attr("y", function(d) { return homeYScale(d.red) })
          .attr("transform", "translate("+ [0, -5] +")") 
          .attr("class", "redText")
          .attr("fill", rColor);
  }

  function addAwayAmount() {
    let awayWidth = awayDatesScale.bandwidth()/2;

    svgAway.selectAll(".foulText")
      .data(awayList).enter()
        .append("text")
          .text(function(d) { return d.foul })
          .attr("x", function(d) { return awayDatesScale(d.date) })
          .attr("y", function(d) { return awayYScale(d.foul) }) 
          .attr("transform", "translate("+ [20, 23] +")")
          .attr("class", "foulText")
          .attr("fill", "white");
    
    svgAway.selectAll(".yellowText")
      .data(awayList).enter()
        .append("text")
          .text(function(d) { return d.yellow })
          .attr("x", function(d) { return awayDatesScale(d.date) })
          .attr("y", function(d) { return awayYScale(d.yellow) }) 
          .attr("transform", "translate("+ [9, -5] +")")
          .attr("class", "yellowText")
          .attr("fill", yColor);
    
    svgAway.selectAll(".redText")
      .data(awayList).enter()
        .append("text")
          .text(function(d) { return d.red })
          .attr("x", function(d) { return awayDatesScale(d.date) + awayWidth*1.5})
          .attr("y", function(d) { return awayYScale(d.red) })
          .attr("transform", "translate("+ [0, -5] +")")
          .attr("class", "redText")
          .attr("fill", rColor);
  }

  // remove all old d3 elements (if exist)
  function removeOldContent() {
    d3.selectAll("svg").remove();
  }

  getData();
})();