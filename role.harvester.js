var roleHarvester = {

    /** @param {Creep} creep **/

    run: function (creep) {
  
        var filler = _.filter(Game.creeps, (creep) => creep.memory.role == 'filler');
        var sources = creep.pos.findClosestByPath(FIND_SOURCES);

        if (creep.carry.energy < creep.carryCapacity) {
            creep.say("⛏︎")
            if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_LINK || structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity;
                    }
                });
            var spawn = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });
            
            for (var i in filler) {
                if(creep.pos.isNearTo(filler[i])) {
                    creep.transfer(filler[i], RESOURCE_ENERGY)
                }
            }
            
            if (creep.room.storage && _.sum(creep.room.storage.store) < creep.room.storage.storeCapacity && !target) {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.moveTo(25, 25, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvester;