"use strict";
const resources = require('resources');
const cb = require('callback');

global.stats_callbacks = new cb.Callback();

// Tell us that you want a callback when we're collecting the stats.
// We will send you in the partially completed stats object.
function add_stats_callback(cbfunc) {
    global.stats_callbacks.subscribe(cbfunc);
}


// Update the Memory.stats with useful information for trend analysis and graphing.
// Also calls all registered stats callback functions before returning.
function collect_stats() {

    // Don't overwrite things if other modules are putting stuff into Memory.stats
    if (Memory.stats == null) {
        Memory.stats = { tick: Game.time };
    }

    // Note: This is fragile and will change if the Game.cpu API changes
    Memory.stats.cpu = Game.cpu;
    // Memory.stats.cpu.used = Game.cpu.getUsed(); // AT END OF MAIN LOOP

    // Note: This is fragile and will change if the Game.gcl API changes
    Memory.stats.gcl = Game.gcl;

    const memory_used = RawMemory.get().length;
    // console.log('Memory used: ' + memory_used);
    Memory.stats.memory = {
        used: memory_used,
        // Other memory stats here?
    };

    Memory.stats.market = {
        credits: Game.market.credits,
        num_orders: Game.market.orders ? Object.keys(Game.market.orders).length : 0,
    };

    Memory.stats.roomSummary = resources.summarize_rooms();

    // Add callback functions which we can call to add additional
    // statistics to here, and have a way to register them.
    // 1. Merge in the current repair ratchets into the room summary
    // TODO: Merge in the current creep desired numbers into the room summary
    global.stats_callbacks.fire(Memory.stats);
} // collect_stats

module.exports = {
    collect_stats,
    add_stats_callback,
};