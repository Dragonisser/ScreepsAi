var roleFiller = {

    /**
     * @param {Creep}
     *            creep *
     */
    run: function (creep) {

        var closesToStructure = ""

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building
            && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        var droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (resource) => {
                return resource.resourceType == RESOURCE_ENERGY && resource.amount > 20;
            }
        });

        var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN ) &&
                    structure.energy < structure.energyCapacity;
            }
        });
        var targetTower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER &&
                    structure.energy < structure.energyCapacity;
            }
        });

        if (creep.memory.building) {
            if (targets) {
                if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                }
            } else if(targetTower) {
                if (creep.transfer(targetTower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetTower);
                }
            } else {
                var storage = creep.room.storage;
                if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
        } else {

            var links = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_LINK;
                }
            });

            var cost = 0;
            var oldCost = 1000;
            if (links.length > 0 && targets) {
                for (x = 0; x < links.length; x++) {
                    cost = PathFinder.search(targets.pos, links[x].pos).cost;
                    if (cost < oldCost) {
                        oldCost = cost;
                        closesToStructure = links[x];
                    }
                }
            }

            if (droppedEnergy) {
                creep.moveTo(droppedEnergy);
                creep.pickup(droppedEnergy, RESOURCE_ENERGY);
            } else if (closesToStructure && closesToStructure.energy > 0) {
                creep.moveTo(closesToStructure);
                creep.withdraw(closesToStructure, RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = roleFiller;