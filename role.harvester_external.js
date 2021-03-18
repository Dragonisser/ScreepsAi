var roleHarvesterRoom = {

    run: function (creep) {

        var room_spawn;
        var flag_dest;
        var flag_dest_x;
        var flag_dest_y;
        var room_dest;

        if (creep.memory.room_dest !== undefined) {
            room_dest = creep.memory.room_dest;
        } else {
            Game.notify('Harvester for other rooms has no room destination');
        }
        if (creep.memory.room_spawn !== undefined) {
            room_spawn = creep.memory.room_spawn;
        } else {
            Game.notify('Harvester for other rooms has no home destination');
        }


        if (creep.memory.flag_dest !== undefined) {
            //also doesnt work ...
            flag_dest = creep.memory.flag_dest;
            flag_dest_x = flag_dest.pos.x;
            flag_dest_y = flag_dest.pos.y;

            //console.log(flag_dest +" "+ flag_dest_x +" "+ flag_dest_y +" "+ _dest);

        } else if (creep.memory.flag_dest_x !== undefined && creep.memory.flag_dest_y) {
            flag_dest_x = creep.memory.flag_dest_x;
            flag_dest_y = creep.memory.flag_dest_y;
        } else {
            Game.notify('Harvester for other rooms has no flag destination');
        }
        var room_cur;
        //console.log(flag_dest_x +" "+ flag_dest_y +" "+ room_dest);
        if (creep.memory.room_dest !== undefined && creep.memory.flag_dest_x !== undefined && creep.memory.flag_dest_y !== undefined) {
            //console.log(flag_dest_x +" "+ flag_dest_y +" "+ room_dest);
            room_cur = new RoomPosition(flag_dest_x, flag_dest_y, room_dest);
        }

        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        var spawn = Game.rooms[room_spawn].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_SPAWN && structure.my;
            }
        });

        if (hostiles.length > 0) {
            creep.say("Enemy!");
            creep.say("Homewards!");
            creep.moveTo(spawn[0]);
        }

        if (creep.room === Game.rooms[room_spawn]) {

            if (creep.memory.building && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === 0) {
                creep.memory.building = false;
            }
            if (!creep.memory.building && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === creep.store.getCapacity([RESOURCE_ENERGY])) {
                creep.memory.building = true;
            }

            if (creep.store.energy === 0) {
                //console.log(room_cur)
                creep.moveTo(room_cur);
            } else {

                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_LINK || structure.structureType === STRUCTURE_TOWER
                            || structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION)
                            && structure.store.getUsedCapacity([RESOURCE_ENERGY]) < structure.store.getCapacity([RESOURCE_ENERGY]);
                    }
                });
				if(targets) {
					targets = creep.pos.findClosestByPath(targets);
				}
				
                if (targets) {
                    if (creep.transfer(targets, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else if (creep.room.storage) {
                    if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    creep.moveTo(new RoomPosition(25, 25, Game.rooms[room_spawn].name), {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else if (creep.room === Game.rooms[room_dest]) {
            if (creep.store.getUsedCapacity([RESOURCE_ENERGY]) < creep.store.getCapacity([RESOURCE_ENERGY]) && !creep.memory.building) {
                creep.say("⛏︎")
                var sources = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(sources) === ERR_NOT_IN_RANGE) {
                    creep.say("Gather!");
                    creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var constructSpawn = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return structure.structureType === STRUCTURE_SPAWN && structure.my;
                    }
                });
                var roomSpawn = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType === STRUCTURE_SPAWN && structure.my;
                    }
                });
                if (constructSpawn.length > 0) {
                    creep.say("Building!");
                    creep.memory.building = true;
                    if (creep.build(constructSpawn[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructSpawn[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    if (creep.memory.building && creep.store.energy === 0) {
                        creep.memory.building = false;
                    }

                } else if(roomSpawn.length > 0) {
                    if (creep.transfer(roomSpawn[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(roomSpawn[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    if (creep.memory.building && creep.store.energy === 0) {
                        creep.memory.building = false;
                    }
                } else {
                    creep.say("Homewards!");
                    creep.moveTo(spawn[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            if (creep.store.energy < creep.store.getCapacity()) {
                creep.moveTo(room_cur, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                creep.say("Homewards!");
                creep.moveTo(spawn[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvesterRoom;