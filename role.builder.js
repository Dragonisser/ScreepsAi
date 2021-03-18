var roleBuilder = {

    run: function (creep) {

        let targets;
        let room_dest;
        let const_sites = creep.room.find(FIND_CONSTRUCTION_SITES)
        let const_sites_sorted = _.sortBy(const_sites, s => s.progress)
        
        if (const_sites_sorted.length > 0) {
            targets = creep.pos.findClosestByPath(const_sites_sorted)
        }
        
        let targetEnergy = creep.pos.findClosestByPath(FIND_STRUCTURES, {
             filter: (structure) => {
                return (structure.structureType === STRUCTURE_LINK || structure.structureType === STRUCTURE_TOWER
                    || structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION)
                    && structure.store.getUsedCapacity([RESOURCE_ENERGY]) < structure.store.getCapacity([RESOURCE_ENERGY]);
                }
        });

        if (creep.memory.room_dest != null && creep.room.name !== creep.memory.room_dest) {
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
                if (targets !== undefined) {
                    creep.say("⛏")
                    if (creep.build(targets) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else if (targetEnergy) {
                    if (creep.transfer(targetEnergy, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetEnergy, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            } else {
                var sources = creep.pos.findClosestByPath(FIND_SOURCES);

                if ((creep.room.energyAvailable > 300 && targets && creep.room.storage !== undefined) && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
                    if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    creep.say("⛏")
                    if (creep.harvest(sources) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;