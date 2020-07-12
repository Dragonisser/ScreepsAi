let mapLib = require('mapLib');

//Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], "Explorer", {memory: {role: 'explorer'}});

let roleExplorer = {

    run: function (creep) {

        let room_dest;
        if (creep.memory.room_dest !== undefined) {
            room_dest = creep.memory.room_dest;
        } else {
            creep.memory.room_dest = mapLib.getNextRoom(creep);
            Game.notify('Explorer has no destination');
        }
        let room = creep.room;

        if (creep.memory.room_dest !== undefined && creep.room.name !== room_dest) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.room_dest), {visualizePathStyle: {stroke: '#0000FF'}});
        } else if (creep.memory.room_dest !== undefined) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.room_dest), {visualizePathStyle: {stroke: '#0000FF'}});
            if (room.controller != null) {
                if (!room.controller.my && room.controller.owner === undefined) {

                    let sources = creep.room.find(FIND_SOURCES);
                    const terrain = Game.map.getRoomTerrain(creep.memory.room_dest);

                    let sourceAccessPoints = 0;
                    for (let source in sources) {

                        let posX = sources[source].pos.x;
                        let posY = sources[source].pos.y;


                        for (let i = posX - 1; i <= posX + 1; i++) {
                            for (let j = posY - 1; j <= posY + 1; j++) {
                                if (terrain.get(i,j) === 0) {
                                    sourceAccessPoints++;
                                }
                            }
                        }
                    }
                    if (sourceAccessPoints >= 4) {
                        if (!mapLib.addToRoomList(room_dest, true)) {
                            creep.memory.room_dest = mapLib.getNextRoom(creep);
                        }
                    } else {
                        if (!mapLib.addToRoomList(room_dest, false)) {
                            creep.memory.room_dest = mapLib.getNextRoom(creep);
                        }
                    }
                }
            } else {
                creep.memory.room_dest = mapLib.getNextRoom(creep);
            }
        } else {
            creep.memory.room_dest = mapLib.getNextRoom(creep);
        }
    }
};

module.exports = roleExplorer;