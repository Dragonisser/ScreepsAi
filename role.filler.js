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

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN ) &&
                    structure.energy < structure.energyCapacity;
            }
        });
        var targetTower = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER &&
                    structure.energy < structure.energyCapacity;
            }
        });

        if (creep.memory.building) {
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                if (creep.transfer(targetTower[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetTower[0]);
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
            if (links.length > 0) {
                for (x = 0; x < links.length; x++) {
                    console.log("-----------")
                    console.log(links[x])
                    console.log(targets[0])
                    console.log("#########")
                    cost = PathFinder.search(targets[0].pos, links[x].pos).cost;
                    if(cost < oldCost) {
                        oldCost = cost;
                        closesToStructure = links[x];
                    }
                }
                console.log(links[x]);
                console.log(targets[0]);
                console.log(oldCost);
                console.log(cost);
                console.log(closesToStructure)
                console.log("-----------")
            }

            var storage = creep.room.storage;
            if (closesToStructure && closesToStructure.energy > 0) {
                creep.moveTo(closesToStructure);
                creep.withdraw(closesToStructure, RESOURCE_ENERGY);
            } else {
                creep.moveTo(storage);
                creep.withdraw(storage, RESOURCE_ENERGY);
            }

        }
    }
};

module.exports = roleFiller;