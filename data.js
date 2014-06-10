/* Data.js */
// A few functions to store and display ~persistent data using a StatsHoldr

function resetStatsHolder() {
  window.StatsHolder = FSM.StatsHolder;
  
  body.appendChild(StatsHolder.makeContainer());
}

function toggleLuigi(nochange) {
  if(!nochange) StatsHolder.toggle("luigi");
  // (StatsHolder.get("luigi") ? addClass : removeClass)(player, "Luigi");
  setTitle(player, StatsHolder.get("luigi") ? "Luigi" : "Player");
}