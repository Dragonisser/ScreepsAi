var roleHarvester = {

    /** @param {Creep} creep **/

    run: function (creep) {
        /*var sources = [];

         if(!creep.memory.targetSourceId) {
         var source = creep.room.find(FIND_SOURCES);
         creep.memory.targetSourceId = source[0].id;
         } else {
         sources = Game.getObjectById(creep.memory.targetSourceId);
         }*/

        var sources = creep.pos.findClosestByPath(FIND_SOURCES);

        if (creep.carry.energy < creep.carryCapacity) {
            if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION) &&
                        structure.energy < structure.energyCapacity;
                }
            });

            var spawn = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });
            var targets_con = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            });
            if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] < creep.room.storage.storeCapacitynumber && targets.length == 0) {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage);
                }
            } else if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                creep.moveTo(25, 9);
            }
        }
    }
};

module.exports = roleHarvester;