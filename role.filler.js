var roleFiller = {

    /**
     * @param {Creep}
     *            creep *
     */
    run: function (creep) {
        
        //creep.drop(RESOURCE_LEMERGIUM)

        var closesToStructure = ""
        var spawn = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN
            }
        });

        if (creep.memory.building && _.sum(creep.carry) == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building
            && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.building = true;
        }
        
        if (creep.ticksToLive < 50 && !creep.memory.renew_process && creep.room.energyAvailable > 100) {
            creep.memory.renew_process = true;
        }

        if ((creep.ticksToLive > 1000 && creep.memory.renew_process) || creep.room.energyAvailable < 100) {
            creep.memory.renew_process = false;
        }

        var droppedRessource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        
        var tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
            filter: (tomb_res) => {
                return _.sum(tomb_res.store) > 0;
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
            if (targets && creep.carry.energy > 0 && creep.room.energyAvailable > creep.room.energyAvailable / 2) {
                if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if(targetTower && creep.carry.energy > 0) {
                if (creep.transfer(targetTower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetTower, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if(creep.room.storage && _.sum(creep.room.storage.store) < creep.room.storage.storeCapacity) {
                var storage = creep.room.storage;
                for(const resourceType in creep.carry) {
                    if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        } else {
            var links = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_LINK;
                }
            });
            
            var cost1 = 0;
            var oldCost1 = 5000;
            if (links.length > 0 && spawn.length > 0) {
                for (var y = 0; y < links.length; y++) {
                    cost1 = PathFinder.search(spawn[0].pos, links[y].pos).cost;
                    //console.log(cost1 + " " + oldCost1)
                    if (cost1 < oldCost1 && links[y].energy >= 200) {
                        oldCost1 = cost1;
                        closesToStructure = links[y];
                        //console.log(closestoSpawn + " " + spawn[0].room)
                    }
                }
            }
            
            var storageFull = _.sum(creep.room.storage.store) == creep.room.storage.storeCapacity;
            
            dontPickUp = false
            if (droppedRessource != null && (droppedRessource.pos.x == 48 || droppedRessource.pos.y == 48 || droppedRessource.pos.y == 49 || droppedRessource.pos.x == 49  || droppedRessource.pos.y == 0 || droppedRessource.pos.x == 0 || droppedRessource.pos.y == 1 || droppedRessource.pos.x == 1)) {
                dontPickUp = true
            }
            
            if (!creep.memory.renew_process) {
               if (droppedRessource && !dontPickUp && creep.moveTo(droppedRessource) != ERR_NO_PATH && !storageFull) {
                    creep.moveTo(droppedRessource, {visualizePathStyle: {stroke: '#ffaa00'}})
                    creep.pickup(droppedRessource);
                } else if (tombstone && creep.moveTo(tombstone) != ERR_NO_PATH && !storageFull) {
                    creep.moveTo(tombstone, {visualizePathStyle: {stroke: '#ffaa00'}});
                    for(const resourceType in tombstone.store) {
                        creep.withdraw(tombstone, resourceType);
                    }
                } else if (closesToStructure && closesToStructure.energy > 0) {
                    creep.moveTo(closesToStructure, {visualizePathStyle: {stroke: '#ffaa00'}});
                    creep.withdraw(closesToStructure, RESOURCE_ENERGY);
                } else if (creep.room.storage && creep.room.storage.store.energy > 0 && (targets || targetTower)) {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffaa00'}});
                    creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                }   
            } else {
                if (creep.moveTo(spawn[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn[0], {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    spawn[0].renewCreep(creep)
                }
            }
        }
    }
};

module.exports = roleFiller;