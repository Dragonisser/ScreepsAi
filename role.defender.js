var target_count = 0;

var roleDefender = {

    /** @param {Creep} creep **/
    run: function (creep) {

        var room = creep.room;
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN;
            }
        });

//            var flag = Game.flags.F_W23N2;
//            creep.moveTo(flag); 

        if (hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${hostiles[0].room}`);
            creep.moveTo(hostiles[0]);
            creep.attack(hostiles[0]);
        } else {
            if (creep.ticksToLive < 500 && !creep.memory.renew_process) {
                var flag = Game.flags.F_Defend;
                //creep.moveTo(targets[0]);
                creep.moveTo(flag);
                creep.memory.renew_process = true;
            } else if (creep.ticksToLive > 1000) {
                creep.memory.renew_process = false;
                var flag = Game.flags.F_Defend;
                creep.moveTo(flag);
            }
            if (creep.memory.renew_process) {
                try {
                    var ticks = creep.ticksToLive;
                    targets[0].renewCreep(creep);
                    if (ticks == creep.ticksToLive) {
                        creep.move(TOP);
                        creep.moveTo(targets[0]);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }
};

module.exports = roleDefender;