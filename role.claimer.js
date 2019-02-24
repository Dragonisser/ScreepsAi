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

        //console.log(creep.name + " " + targets)

        if (creep.memory.room_dest != undefined && creep.room.name != room_dest) {
            room_dest = creep.memory.room_dest;
            var roomName = String(room_dest);
            creep.moveTo(new RoomPosition(25, 25, roomName), {visualizePathStyle: {stroke: '#0000FF'}});
        } else if (targets.length > 0) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#0000FF'}});
            //creep.reserveController(targets[0]);
            if (room.controller != null) {
                if (!room.controller.my && room.controller.owner == undefined) {
                    creep.say("🦄")
                    creep.claimController(targets[0]);
                } else if (room.controller.owner != undefined && room.controller.owner.username != "Dragonisser") {
                    creep.attackController(targets[0]);
                } else if (room.controller.my) {
                    creep.suicide();
                }
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