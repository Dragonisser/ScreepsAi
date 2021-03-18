let mapLib = require('mapLib');

var roleClaimer = {

    run: function (creep) {
        
        var room_dest;
        if (creep.memory.room_dest !== undefined) {
            room_dest = creep.memory.room_dest;
        } else {
            Game.notify('Claimer has no destination');
        }
        var room = creep.room;
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {return structure.structureType === STRUCTURE_CONTROLLER;
            }
        })
        var spawn = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_SPAWN;
            }
        })

        if (creep.memory.room_dest !== undefined && creep.room.name !== room_dest) {
            room_dest = creep.memory.room_dest;
            var roomName = String(room_dest);
            creep.moveTo(new RoomPosition(25, 25, roomName), {visualizePathStyle: {stroke: '#0000FF'}});
        } else if (targets.length > 0) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#0000FF'}});
            //creep.reserveController(targets[0]);
            if (room.controller != null) {
                if (!room.controller.my && room.controller.owner === undefined) {
                    creep.claimController(targets[0]);
                } else if (room.controller.owner !== undefined && room.controller.owner.username !== "Dragonisser") {
                    creep.attackController(targets[0]);
                } else if (room.controller.my) {
                    var constructSpawn = creep.room.find(FIND_CONSTRUCTION_SITES, {
                        filter: (structure) => {
                            return structure.structureType === STRUCTURE_SPAWN && structure.my;
                        }
                    });
                    if (constructSpawn.length === 0) {
                        // const terrain = creep.room.getTerrain();
                        // console.log("Spawn in room missing " + room.name);

                        //TODO Fix that, kills screeps.
                        // for (var x = -10; x < 10; x++) {
                        //     for (var y = -10; y < 10; y++) {
                        //         //console.log("x: " + (25 + x) + " - y: " + (25 + y))
                        //         var canBuild = false;
                        //         /*for (var j = -2; j < 2; j++) {
                        //             for (var k = -2; k < 2; k++) {
                        //                 //console.log("x: " + (25 + x) + " - y: " + (25 + y))
                        //                 if (terrain.get(25+j,25+k) == TERRAIN_MASK_WALL) {
                        //                     canBuild = false;
                        //                 }
                        //             }
                        //         }*/
                        //         if (canBuild) {
                        //             room.createConstructionSite(x, y, STRUCTURE_SPAWN);
                        //         }
                        //     }
                        // }
                        
                    }
                    if (mapLib.getNextClaimableRoom(creep.memory.room_spawn)) {
                        creep.memory.room_dest = mapLib.getNextClaimableRoom(creep.memory.room_spawn);
                    } else {
                        creep.suicide();
                    }
                    
                    
                }
            }


        } else {
            if (creep.ticksToLive < 500 && !creep.memory.renew_process) {
                creep.moveTo(spawn[0]);
                creep.memory.renew_process = true;
            } else if (creep.ticksToLive > 1400) {
                creep.memory.renew_process = false;
                var flag = Game.flags.F_Defend;
                creep.moveTo(flag);
            }
            if (creep.memory.renew_process) {
                try {
                    var ticks = creep.ticksToLive;
                    targets[0].renewCreep(creep);
                    if (ticks === creep.ticksToLive) {
                        creep.move(TOP);
                        creep.moveTo(targets[0]);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }
};

module.exports = roleClaimer;