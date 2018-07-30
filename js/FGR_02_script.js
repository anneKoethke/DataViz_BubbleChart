(function () {

  var file = ["data/FGR_sum_seasons.json"],
    // container for d3 elements (svg etc.)
    chart = document.querySelector("#chart"),
    // HTML elements for Season choosing
    selectionLiList = document.querySelectorAll(".selection li"),
    dropdown = document.querySelector(".dropdown"),
    dropdownLiList = document.querySelectorAll(".dropdown li"),
    // css-colors (flatuicolors)
    fColor = "#34495e",
    rColor = "#e74c3c",
    yColor = "#f1c40f",
    // data arrays
    allSeasons,
    seasonNames = ["saison_06_07", "saison_07_08", "saison_08_09", "saison_09_10", "saison_10_11", "saison_11_12", "saison_12_13", "saison_13_14", "saison_14_15", "saison_15_16", "saison_16_17"],
    // (later) sorted data array of a selected season
    nodes,
    // d3 elements
    svg,
    margin = { top: 10, right: 10, bottom: 10, left: 10 },
    // with these two lines the svg would be responsive in width, e.g.scale to user view (but it's not acutally used later, because the align of the cirlces is hard coded)
    w = chart.clientWidth,
    width = w - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom, 
    teamGs,
    teamName, 
    fCircles,
    rCircles,
    yCircles,
    tooltips,
    // position and size of tooltip
    tooltipWidth = 450,
    tooltipHeight = 150,
    tooltipXPos = 700,
    tooltipYPos = 400,
    tooltextHeaders,
    tooltextContentLine_1,
    tooltextContentLine_2
    // x position of all tooltexts
    toolTextXPos = tooltipXPos+20;
  
  // get data from file (called as first inner function in line 432)
  function getData() {
    Promise.all(file.map(url => d3.json(url))).then(function(data) {
      dataReady(data[0]);
    });
  }

  // make data global, create container svg, make UI elements usable
  function dataReady(arr) {
    allSeasons = arr;
    createSvg();
    setOnClickListeners();
  }

  // creates and connects svg and inner group element to HTML chart div
  function createSvg() {
    svg = d3.select(chart)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  // sets Listener for the season lis of selection-ul and the dropdown-ul: connects HTML-Element to data and to visualisation
  function setOnClickListeners() {
    chooseSeasonListener();
    chooseSortOrderListener();
  }

  // first, there are only the season 'buttons' visible, although the svg is allready there
  function chooseSeasonListener() {
    for (let i = 0; i < selectionLiList.length; i++) {
      selectionLiList[i].addEventListener("click", function() {
        // visualizes the clicked on season 'button'
        setBackgroundColorOfSelectionLi(this);
        // when season got chosen, the user is shown the sorting buttons and a dfault view (sort by foul) is created
        showDropdownLis();
        // sorts the nodes by the default order (fouls)
        sortByDefault(allSeasons[i][seasonNames[i]]);
        // visualise the default sort order (== fouls) on the button
        setSelectedSortOrderClass(dropdownLiList[0], "fouls", "f_selected");
        // actual visualisation of data 
        createChartContent();
      })
    }
  }

  // handles, which value to take for sorting (fouls, red cards, yellow cards)
  function chooseSortOrderListener() {
    // fouls-'button'
    dropdownLiList[0].addEventListener("click", function() {
      let sortOrder = "fouls",
        currClass = "f_selected";
      // visualize selection of the button
      setSelectedSortOrderClass(this, sortOrder, currClass);
      // sort nodes by fouls
      sortByFouls(sortOrder);
    })
    // reds-'button
    dropdownLiList[1].addEventListener("click", function() {
      let sortOrder = "red",
        currClass = "r_selected";
      // visualize selection of the button
      setSelectedSortOrderClass(this, sortOrder, currClass);
      // sort nodes by reds
      sortByReds(sortOrder);
    })
    // yellows-'button'
    dropdownLiList[2].addEventListener("click", function() {
      let sortOrder = "yellow",
        currClass = "y_selected";
      // visualize selection of the button
      setSelectedSortOrderClass(this, sortOrder, currClass);
      // sort nodes by yellows
      sortByYellows(sortOrder);
    })
  }

  // changes appearance of the dropdown-lis via css class making the user know, which sorting order is beeing used currently
  function setSelectedSortOrderClass(obj, sortOrder, currClass) {
    for (let i = 0; i < dropdownLiList.length; i++) {
      dropdownLiList[i].classList = "";
    }
    obj.classList.add(currClass);
  }

  // makes sure, backgroundcolor is changed only at the clicked li-season-element (season-'button')
  function setBackgroundColorOfSelectionLi(obj) {
    for (let i = 0; i < selectionLiList.length; i++) {
      selectionLiList[i].style.backgroundColor = "white";
    }
    obj.style.backgroundColor = "#d3d3d3"; // light gray
  }

  // first, the user has to decide for a season to display, then to sorting order is selectable (shown)
  function showDropdownLis() {
    dropdown.style.display = "grid";
  }

  // Visualisation part: the old visualisation has to be removed, when the user decides to view another season (default sorting order is alsways by fouls)
  function createChartContent() {
    removeOldContent();
    createCircles();
    createHiddenToolTips();
    createToolTexts();
    createTeamNames();
  } 

  // default sorting order
  function sortByDefault(arr) {
    nodes = arr.sort(function (a,b) { return b.fouls - a.fouls });
  }

  // changing sorting order back to fouls, when red or yellow were previously selected
  function sortByFouls(sortOrder) {
    nodes = nodes.sort(function (a,b) { return b.fouls - a.fouls });
    createChartContent();
  }

  // sorts Bubbles by hightest red (== bubble trio up left)
  function sortByReds(sortOrder) {
    nodes = nodes.sort(function (a,b) { return b.red - a.red });
    createChartContent();
  }

  // sorts Bubbles by hightest yellow (== bubble trio up left)
  function sortByYellows(sortOrder) {
    nodes = nodes.sort(function (a,b) { return b.yellow - a.yellow });
    createChartContent();
  }

  // creating the cirles for fouls, red and yellow cards is mostly the same code - except the psoition if red and yellow are changed according to the fCircle
  function createCircles() {
    createTeamContainer();
    createFoulCircles();
    createYellowCircles();    
    createRedCircles();
  }

  // used to anchor the teams names above the circle groups
  function createTeamContainer() {
    teamGs = svg.selectAll(".teamContainer")
      .data(nodes).enter()
      .append("g")
        .attr("class", "teamContainer")
        .attr("id", chopTeamNameToValidCssClass);
  }

  // same function as used in the first Visualisation of all seasons (force simulation) 
  function chopTeamNameToValidCssClass(d) {
    let teamStr = (d.team).replace(/\s/g,"");
    return teamStr;
  }

  function createFoulCircles() {
    fCircles = teamGs.append("circle")
      .attr("class", "fCircles")
      .attr("id", chopTeamNameToValidCssClass)
      .attr("cx", function(d,i) {
        let cx = generateXPos(d,i);
        return cx;
      })
      .attr("cy", generateYPos)
      .attr("r", function(d) {
        return d.fouls/10;
      })
      .style("fill", fColor)
      .style("stroke", "black")
      .style("stroke-width", 2)
      .on("mouseover", showInfo)
      .on("mouseout", showTeamGs);
  }

  // generates x position for all circles (red and yellow circles are moved a bit furhter to the right)
  function generateXPos(d,i) {
    let cx = 0; 
    if (i <= 6) {
      cx = (i+1)*150;
    } else if ((i>6)&&(i<=13)) {
      cx = (i-6)*150;
    } else {
      cx = (i-13)*150;
    }
    return cx;
  }

  // used for the positioning of all circles 
  function generateYPos(d, i) {
    let cy = 0;
    if (i <= 6) {
      cy = 100;
    } else if ((i > 6) & (i <= 13)) {
      cy = 300;
    } else {
      cy = 500;
    } 
    return cy;
  }

  function createYellowCircles() {
    yCircles = teamGs.append("circle")
        .attr("class", "yCircles")
        .attr("id", chopTeamNameToValidCssClass)
        .attr("cx", function(d,i) {
          let cx = generateXPos(d,i);
          return cx+d.fouls/25;
        })
        .attr("cy", generateYPos)
        .attr("r", function(d) {
          return d.yellow/2;
        })
        .style("fill", yColor)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .on("mouseover", showInfo)
        .on("mouseout", showTeamGs);
  }

  function createRedCircles() {
    rCircles = teamGs.append("circle")
        .attr("class", "rCircles")
        .attr("id", chopTeamNameToValidCssClass)
        .attr("cx", function(d,i) {
          let cx = generateXPos(d,i);
          return cx+d.fouls/10;
        }) 
        .attr("cy", generateYPos)
        .attr("r", function(d) {
          return d.red*3;
        })
        .style("fill", rColor)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .on("mouseover", showInfo)
        .on("mouseout", showTeamGs);
  }

  // all tooltips are created as rect and 'hidden'
  function createHiddenToolTips() {
    tooltips = teamGs.append("rect")
      .attr("class", "tooltip")
      .attr("id", chopTeamNameToValidCssClass)
      .attr("x", tooltipXPos)
      .attr("y", tooltipYPos)
      .style("fill", "white")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .attr("width", tooltipWidth)
      .attr("height", tooltipHeight)
      .style("display", "none");
  }

  // the content of the tooltip rect: Team Name as Header, two lines of content
  function createToolTexts() {
    tooltextHeaders = teamGs.append("text")
      .attr("class", "tooltextHeader")
      .attr("id", chopTeamNameToValidCssClass)
      .attr("x", toolTextXPos)
      .attr("y", (tooltipYPos+40))
      .text(function(d) { return d.team })
      .style("font-size", "20px")
      .style("display", "none");
    
    tooltextContentLine_1 = teamGs.append("text")
      .attr("class", "tooltextContentLine_1")
      .attr("id", chopTeamNameToValidCssClass)
      .attr("x", toolTextXPos)
      .attr("y", (tooltipYPos+80))
      .text(createFirstLineOfContent)
      .style("display", "none");
      
    tooltextContentLine_2 = teamGs.append("text")
      .attr("class", "tooltextContentLine_2")
      .attr("id", chopTeamNameToValidCssClass)
      .attr("x", toolTextXPos)
      .attr("y", (tooltipYPos+110))
      .text(createSecondLineOfContent)
      .style("display", "none");

  }

  // first Line of Content in the tooltip rect
  function createFirstLineOfContent(d,i) {
    let str = "",
      team = d.team,
      fCount = d.fouls;
    str = "Der Verein " + team + " hat in dieser Saison " + fCount + " Fouls";    
    return str;
  }

  // second Line of Content in the tooltip rect
  function createSecondLineOfContent(d) {
     let str = "",
      amount = changeContentText(d);
    str = " " + amount + " erhalten.";
    console.log(str);
    return str;
  }

  // used to construct a valid german sentence for the second line of content in the tooltip rect
  function changeContentText(d) {
    let rStr = "",
      yStr = "";
    if (d.red === 0) {
      rStr = "keine roten Karten und ";
    } else if (d.red === 1) {
      rStr = "eine rote Karte und ";
    } else {
      rStr = d.red + " rote Karten und ";
    }
    if (d.yellow === 0) {
      yStr = "keine gelben Karten";
    } else if (d.yellow === 1) {
      yStr = "eine gelbe Karte";
    } else {
      yStr = d.yellow + " gelbe Karten";
    }
    return (" verursacht und " + rStr + yStr);
  }

  // connects team names to teamGs to show to which team a group of circles belongs
  function createTeamNames() {
    teamNames = teamGs.append("text")
      .text(function(d) { return d.team; })
      .attr("class", "teamText")
      .attr("text-anchor", "middle")
      .attr("x", function(d,i) {
          let x = generateXPos(d,i);
          return x;
        })
      .attr("y", generateYPosForTeamNames);
  }

  // for the Positioning of the team names Texts above the circle groups
  function generateYPosForTeamNames(d,i) {
    let y = 0;
    if (i <= 6) {
      y = 20;
    } else if ((i > 6) & (i <= 13)) {
      y = 220;
    } else {
      y = 420;
    } 
    return y;
  }

  // remove all old d3 elements (if exist)
  function removeOldContent() {
    d3.selectAll(".teamContainer").remove();
    d3.selectAll(".teamText").remove();
    d3.selectAll(".fCircles").remove();
    d3.selectAll(".rCircles").remove();
    d3.selectAll(".yCircles").remove();
    d3.selectAll(".tooltip").remove();
    d3.selectAll(".tooltextHeader").remove();
    d3.selectAll(".tooltextContentLine_1").remove();
    d3.selectAll(".tooltextContentLine_2").remove();
  }

  // the team (group of circles and text) the user hovers over is highlighted and furhter infos are being shown in the infoText div
  function showInfo(d) {
    highlightSelectedTeam(d);
    showCurrentTeamsText(d);
  }

  // alle circles and texts are made less opac exceot for the one group currently hovered on
  function highlightSelectedTeam(d) {
    teamGs.style("opacity", .2);
    d3.selectAll("#"+chopTeamNameToValidCssClass(d)).style("opacity", 1);
  }

  // displays furhter information in the rect 
  function showCurrentTeamsText(d) {
    d3.select(".tooltip#"+chopTeamNameToValidCssClass(d)).style("display", "inherit");
    d3.select(".tooltextHeader#"+chopTeamNameToValidCssClass(d)).style("display", "inherit");
    d3.select(".tooltextContentLine_1#"+chopTeamNameToValidCssClass(d)).style("display", "inherit");
    d3.select(".tooltextContentLine_2#"+chopTeamNameToValidCssClass(d)).style("display", "inherit");
  }

  // when the user isn't hovering over something, all team groups are equally displayed and the explanation is being shown
  function showTeamGs() {
    teamGs.style("opacity", 1);
    tooltips.style("display", "none");
    tooltextHeaders.style("display", "none");
    tooltextContentLine_1.style("display", "none");
    tooltextContentLine_2.style("display", "none");
  }

  getData();
})();