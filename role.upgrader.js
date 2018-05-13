var target_count_2 = 0;
var room_dest;

var roleUpgrader = {

	/**
	 * @param {Creep}
	 *            creep *
	 */
	run : function(creep) {
		if (creep.memory.room_dest != null && creep.room.name != creep.memory.room_dest) {
			room_dest = creep.memory.room_dest;
			var roomName = String(room_dest);
			creep.moveTo(new RoomPosition(25, 25, roomName));
		} else {
			if (creep.memory.building && creep.carry.energy == 0) {
				creep.memory.building = false;
			}
			if (!creep.memory.building
					&& creep.carry.energy == creep.carryCapacity) {
				creep.memory.building = true;
			}

			if (creep.memory.building) {
				if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			} else {
				/*var sources = [];
				if(!creep.memory.targetSourceId) {
					var source = creep.room.find(FIND_SOURCES);
					creep.memory.targetSourceId = source[1].id;
				} else {
					sources = Game.getObjectById(creep.memory.targetSourceId);
				}*/
				var sources = creep.pos.findClosestByPath(FIND_SOURCES);
				if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources);
				}
			}
		}

	}
};

module.exports = roleUpgrader;