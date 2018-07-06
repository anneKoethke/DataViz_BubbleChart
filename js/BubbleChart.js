var BubbleChart = BubbleChart || {};

BubbleChart = (function () {
  "use strict";

  var that = {},
    // moduls
    controller,
    model,
    viewAll,
    viewTimeline,
    viewPlayers,
    viewReferees,
    viewSeason,
    // Buttons
    btnViewAll,
    btnViewTimeline,
    btnViewSeason,
    // html elements concerning the chart div
    charContainer,
    selectClub;
  
  // Starting point of the BubbleChart
  function init() {
    initModules();
    initButtons();
    initChartContainer();
  }

  // Module verfügbar machen
  function initModules() {
    controller = new BubbleChart.BubbleChartController();
    model = new BubbleChart.BubbleChartModel();
    viewAll = new BubbleChart.BubbleChartViewAll();
    viewTimeline = new BubbleChart.BubbleChartViewTimeline();
    viewSeason = new BubbleChart.BubbleChartViewSeason();
    // Daten laden? Fallunterscheiden -> in Logik? über neues Modul?
  }

  function initButtons() {
    btnViewAll = document.querySelector("#btnAll");
    btnViewTimeline = document.querySelector("#btnTimeline");
    btnViewSeason = document.querySelector("#btnSeason");
    controller.setButtonListeners(btnViewAll, btnViewTimeline, btnViewSeason);
  }

  function initChartContainer() {
    charContainer = document.querySelector("#chart");
  }

  function selectSeason() {
    removeInfoFromChartDiv();
    createSelect();
  }

  function removeInfoFromChartDiv() {
    charContainer.innerHTML = "";
  }

  function createSelect() {
    
    // controller -> welche Saison?
  }
  
  function getViewAllData() {
    // model -> Daten bauen
    removeInfoFromChartDiv();
    console.log("all clicked");
  }

  function getViewTimelineData() {
    // wahl der Saison
    selectSeason();
    console.log("timeline clicked");
  }

  function getViewSeasonData() {
    // wahl der Saison
    selectSeason();
    console.log("season clicked");
  }

  // hier html-tag selektieren -> jo
  // hier kommunikation zwischen den Modulen -> jo

  that.init = init;
  that.getViewAllData = getViewAllData;
  that.getViewTimelineData = getViewTimelineData;
  that.getViewSeasonData = getViewSeasonData;
  return that; 
})();
