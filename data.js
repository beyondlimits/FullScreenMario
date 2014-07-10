/* Data.js */

function toggleLuigi(nochange) {
    if(!nochange) {
        FSM.StatsHolder.toggle("luigi");
    }
    
    FSM.setTitle(player, StatsHolder.get("luigi") ? "Luigi" : "Player");
}