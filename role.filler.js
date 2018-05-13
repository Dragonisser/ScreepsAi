var roleFiller = {

    /**
	 * @param {Creep}
	 *            creep *
	 */
    run: function(creep) {
    	
    	if (creep.memory.building && creep.carry.energy == 0) {
			creep.memory.building = false;
		}
		if (!creep.memory.building
				&& creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true;
		}
    	
		if (creep.memory.building) {
		    	 var targets = creep.room.find(FIND_STRUCTURES, {
	                 filter: (structure) => {
	                     return (structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN ) &&
	                         structure.energy < structure.energyCapacity;
	                 }
	         });  
		    	 var target = creep.room.find(FIND_STRUCTURES, {
	                 filter: (structure) => {
	                     return structure.structureType == STRUCTURE_TOWER &&
	                         structure.energy < structure.energyCapacity;
	                 }
	         });  
	         if(targets.length > 0) {
	             if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                 creep.moveTo(targets[0]);
	             }
	         } else {
	        	 if(creep.transfer(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                 creep.moveTo(target[0]);
	             }
	         } 
		} else {
			var link = Game.getObjectById('5783ac767f4d729c57725487');
			var storage = Game.getObjectById('577700e57a67da712ffedc6f');
			if(link && link.energy > 0) {
				creep.moveTo(link);
				creep.withdraw(link, RESOURCE_ENERGY);
			} else {
				creep.moveTo(storage);
				creep.withdraw(storage, RESOURCE_ENERGY);
			}
	    	
		}
	}
};

module.exports = roleFiller;