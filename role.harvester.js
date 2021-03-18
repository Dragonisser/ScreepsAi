var roleHarvester = {

    /** @param {Creep} creep **/

    run: function (creep) {
  
        var filler = _.filter(Game.creeps, (creep) => creep.memory.role === 'filler');
        var sources = creep.pos.findClosestByPath(FIND_SOURCES);

        if (creep.store.getUsedCapacity([RESOURCE_ENERGY]) < creep.store.getCapacity([RESOURCE_ENERGY])) {
            creep.say("⛏")
            if (creep.harvest(sources) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_LINK || structure.structureType === STRUCTURE_SPAWN
                        || structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_TOWER)
                        && structure.store.getUsedCapacity([RESOURCE_ENERGY]) < structure.store.getCapacity([RESOURCE_ENERGY]);
                    }
            });

            var tower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType === STRUCTURE_TOWER;
                    }
            });
            var enemy = creep.room.find(FIND_HOSTILE_CREEPS);
            
            for (var i in filler) {
                if(creep.pos.isNearTo(filler[i])) {
                    creep.transfer(filler[i], RESOURCE_ENERGY)
                }
            }
            if (tower != null && enemy.length > 0) {
                if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (creep.room.storage && _.sum(creep.room.storage.store) < creep.room.storage.storeCapacity && !target) {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.moveTo(25, 25, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvester;