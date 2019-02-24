var roleDefender = {

    /**
     * @param {Creep}
     *            creep *
     */
    run: function (creep) {

        var room = creep.room;
        var hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var tower = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER;
             }
        });
        var spawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        var structure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (structure) => {
            return structure.structureType != STRUCTURE_CONTROLLER;
             }
        });
                
        if (Game.flags.FlagAttack != null) {
            if (!creep.memory.flagattack) {
                creep.moveTo(Game.flags.FlagAttack, {visualizePathStyle: {stroke: '#ffffff'}})
                if(creep.pos.isNearTo(Game.flags.FlagAttack)) {
                    creep.memory.flagattack = true;
                }
            } else {
                if (hostile) {
                    creep.say("Attack!")
                    creep.moveTo(hostile, {visualizePathStyle: {stroke: '#FF0000'}})
                    creep.attack(hostile) 
                } else if (tower) {
                    creep.say("Attack!")
                    creep.moveTo(tower, {visualizePathStyle: {stroke: '#FF0000'}})
                    creep.attack(tower);
                } else if (spawn) {
                    creep.say("Attack!")
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#FF0000'}})
                    creep.attack(spawn);
                } else if (structure) {
                    creep.say("Attack!")
                    creep.moveTo(structure, {visualizePathStyle: {stroke: '#FF0000'}})
                    creep.attack(structure)
                }
            }
                //creep.moveTo(Game.flags.FlagAttack)
                
            }
    }
};

module.exports = roleDefender;