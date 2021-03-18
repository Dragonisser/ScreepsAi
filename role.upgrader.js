var room_dest;

var roleUpgrader = {

    run: function (creep) {

        var spawn = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_SPAWN
            }
        });


        if (creep.ticksToLive < 50 && !creep.memory.renew_process) {
            creep.memory.renew_process = true;
        }

        if (creep.ticksToLive > 500 && creep.memory.renew_process) {
            creep.memory.renew_process = false;
        }


        if (creep.memory.room_dest != null && creep.room.name !== creep.memory.room_dest && !creep.memory.renew_process) {
            room_dest = creep.memory.room_dest;
            var roomName = String(room_dest);
            creep.moveTo(new RoomPosition(25, 25, roomName));
        } else {
            if (creep.memory.building && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === 0) {
                creep.memory.building = false;
            }
            if (!creep.memory.building && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === creep.store.getCapacity([RESOURCE_ENERGY])) {
                creep.memory.building = true;
            }

            if (creep.memory.building) {
                creep.say("⏏");
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00B200'}, reusePath:10});
                }
                /*if (creep.signController(creep.room.controller, "Gebiet des Deutschen Kaiserreich") == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00B200'}});
                }*/
            } else {
                if (!creep.memory.renew_process) {
                    creep.say("⛏");
                    var sources = creep.pos.findClosestByPath(FIND_SOURCES);
                    if (creep.room.storage && creep.room.storage.store.energy > 10000) {
                        creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffaa00'}});
                        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                    } else if (creep.harvest(sources) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    if (creep.moveTo(spawn[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    } else {
                        if (creep.room.energyAvailable > 500) {
                            creep.suicide();
                        } else {
                            spawn[0].renewCreep(creep)
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;