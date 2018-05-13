var target_count_2 = 0;
var room_dest;

var roleUpgrader = {

    /**
     * @param {Creep}
     *            creep *
     */
    run: function (creep) {

        var spawn = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN
            }
        });


        if (creep.ticksToLive < 50 && !creep.memory.renew_process) {
            creep.memory.renew_process = true;
        }

        if (creep.ticksToLive > 500 && creep.memory.renew_process) {
            creep.memory.renew_process = false;
        }


        if (creep.memory.room_dest != null && creep.room.name != creep.memory.room_dest && !creep.memory.renew_process) {
            room_dest = creep.memory.room_dest;
            var roomName = String(room_dest);
            creep.moveTo(new RoomPosition(25, 25, roomName));
        } else {
            if (creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
            }
            if (!creep.memory.building
                && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
            }

            if (creep.memory.building) {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            } else {
                if (!creep.memory.renew_process) {
                    var sources = creep.pos.findClosestByPath(FIND_SOURCES);
                    if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources);
                    }
                } else {
                    if (creep.moveTo(spawn[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn[0]);
                    } else {
                        spawn[0].renewCreep(creep)
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;