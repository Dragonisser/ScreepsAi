var roleClaimer = {

    /**
     * @param {Creep}
     *            creep *
     */
    run: function (creep) {

        var room_dest;
        if (creep.memory.room_dest != undefined) {
            room_dest = creep.memory.room_dest;
        } else {
            Game.notify('Claimer has no destination');
        }
        var room = creep.room;
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTROLLER;
            }
        });

        if (creep.memory.room_dest != undefined && creep.room.name != room_dest) {
            room_dest = creep.memory.room_dest;
            var roomName = String(room_dest);
            creep.moveTo(new RoomPosition(38, 15, roomName));
        } else if (targets.length) {
            creep.moveTo(targets[0]);

            creep.reserveController(targets[0]);
            if (room.owner == undefined) {
                creep.claimController(targets[0]);
            } else if (room.owner.name != "Dragonisser") {
                creep.attackController(targets[0]);
            }
        } else {
            if (creep.ticksToLive < 500 && !creep.memory.renew_process) {
                creep.moveTo(targets[0]);
                creep.memory.renew_process = true;
            } else if (creep.ticksToLive > 1400) {
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

module.exports = roleClaimer;