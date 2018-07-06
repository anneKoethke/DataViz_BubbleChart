/* eslint-env browser */

var BubbleChart = BubbleChart || {};

BubbleChart.BubbleChartViewSeason = function () {
  "use strict";
  
  var that = {};

  /* Hier soll eine bestimmte Saison selektierbar sein, also wie ..ViewAll, aber nur für eine Saison 
    (BubbleHaufen aller vertretenen Vereine)
  */
  function showMsg() {
    console.log("in ");
  }

  that.showMsg = showMsg;
  return that;
};
