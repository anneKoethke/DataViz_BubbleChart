var BubbleChart = BubbleChart || {};

BubbleChart = (function () {
  "use strict";

  var that = {},
    controller,
    model,
    viewAll,
    viewTimeline,
    viewPlayers,
    viewReferees,
    viewSeason;
  
  // Starting point of the BubbleChart
  function init() {
    initModules();
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
  // hier daten laden? -> Model verwaltet Daten
  // hier html-tag selektieren -> jo
  // hier kommunikation zwischen den Modulen -> jo

  that.init = init;
  that.initModules = initModules;
  return that; 
})();
