var target_count_2 = 0;
var room_dest;

var roleBuilder = {

	/**
	 * @param {Creep}
	 *            creep *
	 */
	run : function(creep) {

		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

		if(targets.length > 1) {
			targets.sort(function(a,b){return a.progress > b.progress ? -1 : 1});
		}
		
		if (creep.memory.room_dest != null && creep.room.name != creep.memory.room_dest) {
			room_dest = creep.memory.room_dest;
			var roomName = String(room_dest);
			creep.moveTo(new RoomPosition(25, 25, roomName));
		} else {

			if (creep.memory.building && creep.carry.energy == 0) {
				creep.memory.building = false;
			}

			if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true;
			}

			if (creep.memory.building) {
				if (targets.length > 0) {
					if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0]);
					} else {
						creep.moveTo(25,9);
					}
				}
			} else {
				var sources = [];
				if(!creep.memory.targetSourceId) {
					var source = creep.room.find(FIND_SOURCES);
					creep.memory.targetSourceId = source[0].id;
				} else {
					sources = Game.getObjectById(creep.memory.targetSourceId);
				}

				if(creep.room.energyAvailable > 300) {
					var targetsE = creep.room.find(FIND_STRUCTURES, {
							filter: (structure) => {
							return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_STORAGE);
							}
					});
					if(creep.withdraw(targetsE[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targetsE[0]);
					}
				} else {
					if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
						creep.moveTo(sources);
					}
				}
			}
		}
	}
};

module.exports = roleBuilder;