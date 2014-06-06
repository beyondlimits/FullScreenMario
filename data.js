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

// Starts the interval of updating data time
// 1 game second is about 25*16.667=416.675ms
function startDataTime() {
  StatsHolder.set("time", MapsManager.getArea().time);
}
function updateDataTime() {
  if(notime) return;
  // To do: increasing time for random / no time for editor
  StatsHolder.decrease("time", 1);
}

// For hopping on / shelling enemies, the score given increases each time
// Once it passes the threshold, gainLife happens instead
function findScore(lev) {
  if(lev < 10) {
    return [100, 200, 400, 500, 800, 1000, 2000, 4000, 5000, 8000][lev];
  } else {
    gainLife();
  }
}

function gainLife(num, nosound) {
  if(typeof(num) != "number") num = 1;
  StatsHolder.increase("lives", num);
  if(!nosound) AudioPlayer.play("Gain Life");
}