/* eslint-env browser */

var BubbleChart = BubbleChart || {};

BubbleChart.BubbleChartController = function () {
  "use strict";

  var that = {};

  function setButtonListeners(btnViewAll, btnViewTimeline, btnViewSeason) {
    btnViewAll.addEventListener("click", onBtnViewAllClicked);
    btnViewTimeline.addEventListener("click", onBtnViewTimelineClicked);
    btnViewSeason.addEventListener("click", onBtnViewSeasonClicked);
  }

  function onBtnViewAllClicked() {
    BubbleChart.getViewAllData();
  }

  function onBtnViewTimelineClicked() {
    BubbleChart.getViewTimelineData();
  }

  function onBtnViewSeasonClicked() {
    BubbleChart.getViewSeasonData();
  }

  that.setButtonListeners = setButtonListeners;
  return that;
};
