/* eslint-env browser */

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

  console.log("in BubbleChart");
  
  // Starting point of the BubbleChart
  function init() {
    console.log("in init");
    initModules();

  }

  // Module verfügbar machen
  function initModules() {
    console.log("in initModules");
    controller = new BubbleChart.BubbleChartController();
    model = new BubbleChart.BubbleChartModel();
    viewAll = new BubbleChart.BubbleChartViewAll();
    viewTimeline = new BubbleChart.BubbleChartViewTimeline();
    viewPlayers = new BubbleChart.BubbleChartViewPlayers();
    viewReferees = new BubbleChart.BubbleChartViewReferes();
    viewSeason = new BubbleChart.BubbleChartViewSeason();
    // Daten laden? Fallunterscheiden -> in Logik? über neues Modul?
  }
  // hier daten laden?
  // hier html-tag selektieren
  // hier kommunikation zwischen den Modulen

  init();

  that.init = init;
  that.initModules = initModules;
  return that; 
});
