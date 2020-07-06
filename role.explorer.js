let mapLib = require('mapLib');

//Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], "Explorer", {memory: {role: 'explorer',room_dest: 'W8N3'}});

let roleExplorer = {

    run: function (creep) {

        let room_dest;
        if (creep.memory.room_dest !== undefined) {
            room_dest = creep.memory.room_dest;
        } else {
            Game.notify('Explorer has no destination');
        }
        let room = creep.room;

        if (creep.memory.room_dest !== undefined && creep.room.name !== room_dest) {
            room_dest = creep.memory.room_dest;
            let roomName = String(room_dest);
            creep.moveTo(new RoomPosition(25, 25, roomName), {visualizePathStyle: {stroke: '#0000FF'}});
        } else {
            if (room.controller != null) {
                if (!room.controller.my && room.controller.owner === undefined) {
                    if (!mapLib.addToRoomList(room_dest, false)) {
                        creep.memory.room_dest = mapLib.getNextRoom(creep);
                    }
                }
            }
        }
    }
};

module.exports = roleExplorer;