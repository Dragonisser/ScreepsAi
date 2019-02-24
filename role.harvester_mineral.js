var roleHarvester = {

    /** @param {Creep} creep **/

    run: function (creep) {
        
        var mineral = creep.pos.findClosestByPath(FIND_MINERALS)
        
        if (_.sum(creep.carry) < creep.carryCapacity) {
            creep.say("⛏")
            if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mineral);
            }
        } else {
            if (creep.room.storage && _.sum(creep.room.storage.store) < creep.room.storage.storeCapacity) {
                for(const resourceType in creep.carry) {
                    if (creep.transfer(creep.room.storage, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage, {reusePath: 5});
                    }
                }
                
            } else {
                creep.moveTo(25, 9, {visualizePathStyle: {stroke: '#ffffff'}}, {reusePath: 5});
            }
        }
    }
};

module.exports = roleHarvester;