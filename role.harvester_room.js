var roleHarvesterRoom = {

    /** @param {Creep} creep **/
    run: function(creep) {
    	
    	var room_spawn = "W7N3";
    	var flag_dest;
    	var flag_dest_x;
    	var flag_dest_y;
    	var room_dest;

		var sources = [];

    	if(creep.memory.room_dest != undefined) {
    		room_dest = creep.memory.room_dest;
    	} else {
    		Game.notify('Harvester for other rooms has no room destination');
    	}
    	if(creep.memory.flag_dest != undefined) {
    		//also doesnt work ...
    		flag_dest = creep.memory.flag_dest;
    		flag_dest_x = flag_dest.pos.x;
    		flag_dest_y = flag_dest.pos.y;
    		
    		console.log(flag_dest +" "+ flag_dest_x +" "+ flag_dest_y +" "+ room_dest);
    		
    	} else if(creep.memory.flag_dest_x != undefined && creep.memory.flag_dest_y) {		
    		flag_dest_x = creep.memory.flag_dest_x;
    		flag_dest_y = creep.memory.flag_dest_y;
    	} else {
    		Game.notify('Harvester for other rooms has no flag destination');
    	}
    	if(creep.memory.room_dest != undefined && creep.memory.flag_dest_x != undefined && creep.memory.flag_dest_y) {
    		//console.log(flag_dest_x +" "+ flag_dest_y +" "+ room_dest);
    		var room = new RoomPosition(flag_dest_x, flag_dest_y, room_dest);
    	}
    	
    	var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
		var spawn = Game.rooms[room_spawn].find(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType == STRUCTURE_SPAWN
			}
		});
    	
    	var flag_spawn = Game.flags.Flag1;
    	if(creep.room == Game.rooms[room_spawn]) {
    		if(creep.carry.energy == 0) {
    			creep.moveTo(room);
    		} else {

    			var targets = creep.room.find(FIND_STRUCTURES, {
    			filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_STORAGE) &&
                            structure.energy < structure.energyCapacity;
                    }
    			});
    			var target = Game.getObjectById('57833f1f5dfafa1e0c9e1a5e');
    			var targets_con = creep.room.find(FIND_STRUCTURES, {
        			filter: (structure) => {
                            return structure.structureType == STRUCTURE_CONTAINER;
                        }
        			});
    			if(target && target.energy < target.energyCapacity) {
    				if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
    				}
    			} else if(targets.length > 0) {	
    				if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }               
        		} else if(creep.room.storage) {
    				if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage);
                    }               
        		} else {	
    				creep.moveTo(Game.rooms[room_spawn]);
    			}
    		}
    	} else if(creep.room == Game.rooms[room_dest] && hostiles.length <= 0) {
    		if(creep.carry.energy < creep.carryCapacity) {
				var sources = creep.pos.findClosestByPath(FIND_SOURCES);
    			if(creep.harvest(sources) == ERR_NOT_IN_RANGE ) {
					creep.say("Rush b");
                     creep.moveTo(sources);
                }
    		} else {
    			creep.moveTo(spawn[0]);
    		}
    	} else {
    		if(creep.carry.energy < creep.carryCapacity) {
    			creep.moveTo(room); 
    		} else {
				creep.moveTo(spawn[0]);
    		}
    	}
	}
};

module.exports = roleHarvesterRoom;