var target_count = 0;
var target_count_2 = 0;
var hitsRepair;
var hitsRepair_2 = 50000;

var roleBuilder = {


    /**
     * @param {Creep}
     *            creep *
     */
    run: function (creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_RAMPART) &&
                        structure.hits < structure.hitsMax;
                }
            });

            if (targets.length && targets != null && targets != undefined) {
                if (targets[target_count].hits < hitsRepair_2) {
                    if (creep.repair(targets[target_count]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[target_count]);
                    }
                } else {
                    target_count += 1;
                    if (target_count == targets.length) {
                        target_count = 0;
                    }
                }

            } else {
                var flag = Game.flags.Flag1;
                creep.moveTo(flag);
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE && creep.harvest(sources[0]) != ERR_NO_PATH) {
                creep.moveTo(sources[0]);
            } else if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }
    }
};

module.exports = roleBuilder;