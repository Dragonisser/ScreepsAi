let mapLib = require('mapLib');

//Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], "Explorer", {memory: {role: 'explorer'}});

let roleExplorer = {

    run: function (creep) {

        let room_dest;
        let stuckTimer = creep.memory.stuckTimer;

        if (creep.memory.room_dest !== undefined) {
            room_dest = creep.memory.room_dest;
        } else {
            if (mapLib.getNextUnvisitedRoom(creep)) {
                creep.memory.room_dest = mapLib.getNextUnvisitedRoom(creep);
                creep.memory.roomDist = mapLib.getDistanceToUnvisitedRoom(creep, creep.memory.room_dest);
            } else {
                creep.suicide();
            }
        }
        let room = creep.room;

        if (creep.memory.room_dest !== undefined && creep.room.name !== room_dest) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.room_dest), {visualizePathStyle: {stroke: '#0000FF'}});
			if(mapLib.checkIfRoomVisited(creep.memory.room_dest)) {
				creep.memory.room_dest = mapLib.getNextUnvisitedRoom(creep);
                creep.memory.roomDist = mapLib.getDistanceToUnvisitedRoom(creep, creep.memory.room_dest);
			}
			stuckTimer++;
			creep.memory.stuckTimer = stuckTimer;
            //console.log("----");
			//console.log("Name: " + creep.name);
            //console.log("Dist: " + creep.memory.roomDist);
            //console.log("Room Curr: " + creep.room.name);
            //console.log("Room Dest: " + creep.memory.room_dest);
			//console.log("Stuck Timer: " + creep.memory.stuckTimer);
            //console.log("Stuck Room: " + creep.memory.room_stuck);

			if(stuckTimer > 50 * creep.memory.roomDist) {
				creep.memory.room_stuck = creep.room.name;
			}
			if(stuckTimer > 75 * creep.memory.roomDist) {
				if(creep.memory.room_stuck === creep.room.name) {
                    mapLib.changeRoomStatus(room_dest, 'REACHABLE', false);
                    mapLib.changeRoomStatus(room_dest, 'VISITED', true);
					creep.memory.room_dest = mapLib.getNextUnvisitedRoom(creep);
                    creep.memory.roomDist = mapLib.getDistanceToUnvisitedRoom(creep, creep.memory.room_dest);
					creep.memory.stuckTimer = 0;
				} else {
					creep.memory.room_stuck = creep.room.name;
					creep.memory.stuckTimer = 0;
				}
			}
        } else if (creep.memory.room_dest !== undefined) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.room_dest), { visualizePathStyle: { stroke: '#0000FF' } });
            if (room.controller != null) {
                if (!room.controller.my && room.controller.owner === undefined) {

                    mapLib.addSourceSpotsToList(creep);
                    let sourceSpots = mapLib.getSourceHarvestSpots(creep.room.name);
                    console.log("Room: " + room.name + " SourceSpots: " + sourceSpots);

                    if (sourceSpots >= 4) {
                        mapLib.changeRoomStatus(room_dest, 'CLAIMABLE', true);
                        mapLib.changeRoomStatus(room_dest, 'VISITED', true);
                        creep.memory.room_dest = mapLib.getNextUnvisitedRoom(creep);
                        creep.memory.roomDist = mapLib.getDistanceToUnvisitedRoom(creep, creep.memory.room_dest);
                    } else {
                        mapLib.changeRoomStatus(room_dest, 'CLAIMABLE', false);
                        mapLib.changeRoomStatus(room_dest, 'VISITED', true);
                        creep.memory.room_dest = mapLib.getNextUnvisitedRoom(creep);
                        creep.memory.roomDist = mapLib.getDistanceToUnvisitedRoom(creep, creep.memory.room_dest);
                    }
                }
            } else {
                mapLib.changeRoomStatus(room_dest, 'ENEMY', true);
                mapLib.changeRoomStatus(room_dest, 'VISITED', true);
                creep.memory.room_dest = mapLib.getNextUnvisitedRoom(creep);
                creep.memory.roomDist = mapLib.getDistanceToUnvisitedRoom(creep, creep.memory.room_dest);
            }
        } else {
            creep.memory.room_dest = mapLib.getNextUnvisitedRoom(creep);
            creep.memory.roomDist = mapLib.getDistanceToUnvisitedRoom(creep, creep.memory.room_dest);
        }
    }
};

module.exports = roleExplorer;