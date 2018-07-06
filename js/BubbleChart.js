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
    infoText,
    chartContainer,
    currSeason,
    // seasons
    seasonArray = [
      "Saison 2006/07",
      "Saison 2007/08",
      "Saison 2008/09",
      "Saison 2009/10",
      "Saison 2010/11",
      "Saison 2011/12",
      "Saison 2012/13",
      "Saison 2013/14",
      "Saison 2014/15",
      "Saison 2015/16",
      "Saison 2016/17",
      "Saison 2017/18",
    ];
  
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
    chartContainer = document.querySelector("#chart");
  }

  function selectSeason() {
    removeInfoFromChartDiv();
    createSelect();

  }

  // migth also be used to remove the charts when changign view
  function removeInfoFromChartDiv() {
    chartContainer.innerHTML = "";
  }

  function createSelect() {
    let select = document.createElement("select");
    chartContainer.appendChild(select);

    // controller -> welche Saison?
  }
  
  function getViewAllData() {
    removeInfoFromChartDiv();
    console.log("all clicked");
  }

  function getViewTimelineData() {
    selectSeason();
    console.log("timeline clicked");
  }

  function getViewSeasonData() {
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
