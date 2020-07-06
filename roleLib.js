/**
 * Created by Dragonisser on 04.09.2019.
 */


var spawnCreeps = {
    spawnHarvester: function (spawn, roomDestination, creepsSpawned, creepsNeeded, dependingCreepsSpawned) {
        "use strict";
        var room = spawn.room;

        //console.log(spawn + " " + roomDestination + " " + creepsSpawned + "/" + creepsNeeded + " " + dependingCreepsSpawned)

        if (creepsSpawned < creepsNeeded) {
            var number = Math.floor(Math.random() * (creepsSpawned + 1));
            if (room.energyAvailable >= 800) {
                if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "Harvester_" + room.name + "_" + number, {dryRun: true}) == 0) {
                    var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "Harvester_" + room.name + "_" + number, {
                        memory: {
                            role: 'harvester',
                            room_dest: room.name
                        }
                    });
                }
            } else {
                if (spawn.spawnCreep([WORK, CARRY, MOVE], "Harvester_" + room.name + "_" + number, {dryRun: true}) == 0) {
                    var creep = spawn.spawnCreep([WORK, CARRY, MOVE], "Harvester_" + room.name + "_" + number, {
                        memory: {
                            role: 'harvester',
                            room_dest: room.name
                        }
                    });
                }
            }
        }
    },
    spawnHarvesterExternal: function (spawn, roomDestination, creepsSpawned, creepsNeeded, dependingCreepsSpawned) {
        "use strict";
        var roomConstruct = Game.rooms[roomDestination.room_name];
        var constructSpawn;
        if (roomConstruct !== undefined) {
            constructSpawn = roomConstruct.find(FIND_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_SPAWN;
                }
            });
        }

        if (roomConstruct === undefined || constructSpawn.length > 0) {
            if (creepsSpawned < creepsNeeded) {
                if (spawn.room.energyAvailable >= 850) {
                    var number = Math.floor(Math.random() * (creepsSpawned + 1));
                    if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "Harvester_Ex_" + roomDestination.room_name + number, {dryRun: true}) === 0) {
                        var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "Harvester_Ex_" + roomDestination.room_name + "_" + number, {
                            memory: {
                                role: 'harvester_external',
                                room_dest: roomDestination.room_name,
                                room_spawn: spawn.room.name,
                                flag_dest_x: '25',
                                flag_dest_y: '25'
                            }
                        });
                    }
                } else if (spawn.room.energyAvailable >= 650) {
                    var number = Math.floor(Math.random() * (creepsSpawned + 1));
                    if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "Harvester_Ex_" + roomDestination.room_name + number, {dryRun: true}) === 0) {
                        var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "Harvester_Ex_" + roomDestination.room_name + "_" + number, {
                            memory: {
                                role: 'harvester_external',
                                room_dest: roomDestination.room_name,
                                room_spawn: spawn.room.name,
                                flag_dest_x: '25',
                                flag_dest_y: '25'
                            }
                        });
                    }
                } else {
                    var number = Math.floor(Math.random() * (creepsSpawned + 1));
                    if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], "Harvester_Ex_" + roomDestination.room_name + number, {dryRun: true}) === 0) {
                        var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], "Harvester_Ex_" + roomDestination.room_name + "_" + number, {
                            memory: {
                                role: 'harvester_external',
                                room_dest: roomDestination.room_name,
                                room_spawn: spawn.room.name,
                                flag_dest_x: '25',
                                flag_dest_y: '25'
                            }
                        });
                    }
                }
            }
        }
    },
    spawnHarvesterMinderal: function (spawn, roomDestination, creepsSpawned, creepsNeeded, dependingCreepsSpawned) {
        "use strict";
        var controllerLevel = roomDestination.controller.level;

        if(controllerLevel >= 6) {
            var room_mineral = roomDestination.find(FIND_MINERALS);
            var room_storage = roomDestination.storage;
            var room_storageFull = false;
            if(room_storage != null) {
                room_storageFull = room_storage.store < room_storage.store.getCapacity()
            }
            var room_extractor = roomDestination.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_EXTRACTOR;
                }});
            if(room_extractor.length == 0) {
                roomDestination.createConstructionSite(room_mineral[0].pos, STRUCTURE_EXTRACTOR)
            }

            if (creepsSpawned < creepsNeeded && room_extractor.length > 0 && room_mineral[0].mineralAmount > 0 && room_storageFull) {
                var number = Math.floor(Math.random() * (creepsSpawned.length + 1));
                if (spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "Harvester_M_" + rooms_around[x] + number, {dryRun: true}) == 0) {
                    var creep = spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "Harvester_M_" + rooms_around[x] + "_" + number, {
                        memory: {
                            role: 'harvester_mineral',
                            room_dest: room.name,
                            room_spawn: room.name,
                            flag_dest_x: '28',
                            flag_dest_y: '11'
                        }
                    });
                }
            }
        }
    },
    spawnUpgrader: function (spawn, roomDestination, creepsSpawned, creepsNeeded, dependingCreepsSpawned) {
        "use strict";
        var room = spawn.room;
        var controllerLevel = room.controller.level;

        if (controllerLevel < 8) {
            creepsNeeded = 3;
        } else {
            creepsNeeded = 1;
        }
        if (creepsSpawned < creepsNeeded && dependingCreepsSpawned > 0) {
            var number = Math.floor(Math.random() * (creepsSpawned + 1));
            if (room.energyAvailable >= 1200) {
                if (spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "Upgrader_" + room.name + "_" + number, {dryRun: true}) == 0) {
                    var creep = spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "Upgrader_" + room.name + "_" + number, {
                        memory: {
                            role: 'upgrader',
                            room_dest: room.name,
                            cLevel: '3'
                        }
                    });
                }
            } else if (room.energyAvailable >= 800) {
                if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Upgrader_" + room.name + "_" + number, {dryRun: true}) == 0) {
                    var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Upgrader_" + room.name + "_" + number, {
                        memory: {
                            role: 'upgrader',
                            room_dest: room.name,
                            cLevel: '2'
                        }
                    });
                }
            } else if (room.energyAvailable >= 500) {
                if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Upgrader_" + room.name + "_" + number, {dryRun: true}) == 0) {
                    var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Upgrader_" + room.name + "_" + number, {
                        memory: {
                            role: 'upgrader',
                            room_dest: room.name,
                            cLevel: '1'
                        }
                    });
                }
            } else {
                if (spawn.spawnCreep([WORK, CARRY, MOVE], "Upgrader_" + room.name + "_" + number, {dryRun: true}) == 0) {
                    var creep = spawn.spawnCreep([WORK, CARRY, MOVE], "Upgrader_" + room.name + "_" + number, {
                        memory: {
                            role: 'upgrader',
                            room_dest: room.name,
                            cLevel: '0'
                        }
                    });
                }
            }

        }

    },
    spawnBuilder: function (spawn, roomDestination, creepsSpawned, creepsNeeded, dependingCreepsSpawned) {
        "use strict";
        var targets = roomDestination.find(FIND_CONSTRUCTION_SITES);
        if (targets.length > 0 && targets.length <= 4) {
            creepsNeeded = 2;
        } else if (targets.length > 4) {
            creepsNeeded = 4;
        } else {
            creepsNeeded = 0
        }

        if (creepsSpawned < creepsNeeded && dependingCreepsSpawned > 0) {
            var number = Math.floor(Math.random() * (creepsSpawned + 1));
            if (roomDestination.energyAvailable >= 1200) {
                if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Builder_" + roomDestination.name + "_" + number, {dryRun: true}) == 0) {
                    var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Builder_" + roomDestination.name + "_" + number, {
                        memory: {
                            role: 'builder',
                            room_dest: roomDestination.name
                        }
                    });
                }
            } else if (roomDestination.energyAvailable >= 600) {
                if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Builder_" + roomDestination.name + "_" + number, {dryRun: true}) == 0) {
                    var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Builder_" + roomDestination.name + "_" + number, {
                        memory: {
                            role: 'builder',
                            room_dest: roomDestination.name
                        }
                    });
                }
            } else {
                if (spawn.spawnCreep([WORK, CARRY, MOVE], "Builder_" + roomDestination.name + "_" + number, {dryRun: true}) == 0) {
                    var creep = spawn.spawnCreep([WORK, CARRY, MOVE], "Builder_" + roomDestination.name + "_" + number, {
                        memory: {
                            role: 'builder',
                            room_dest: roomDestination.name
                        }
                    });
                }
            }
        }
    },
    spawnFiller: function (spawn, roomDestination, creepsSpawned, creepsNeeded, dependingCreepsSpawned) {
        "use strict";
        var links = roomDestination.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LINK || structure.structureType == STRUCTURE_STORAGE;
            }
        });
        if ((links.length > 0) && (roomDestination.controller.level < 6)) {
            creepsNeeded = 1;
        } else if ((links.length > 0) && (roomDestination.controller.level > 5)) {
            creepsNeeded = 2;
        } else {
            creepsNeeded = 0
        }
        if (creepsSpawned < creepsNeeded) {
            if (spawn.room.energyAvailable >= 650) {
                var number = Math.floor(Math.random() * (creepsSpawned + 1));
                if (spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], "Filler_" + roomDestination.name + "_" + number, {dryRun: true}) == 0) {
                    var creep = spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], "Filler_" + roomDestination.name + "_" + number, {
                        memory: {
                            role: 'filler',
                            room_dest: roomDestination.name
                        }
                    });
                }

            } else {
                var number = Math.floor(Math.random() * (creepsSpawned + 1));
                if (spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Filler_" + roomDestination.name + "_" + number, {dryRun: true}) == 0) {
                    var creep = spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Filler_" + roomDestination.name + "_" + number, {
                        memory: {
                            role: 'filler',
                            room_dest: roomDestination.name
                        }
                    });
                }
            }
        }
    },
    spawnClaimer: function (spawn, roomDestination, creepsSpawned, creepsNeeded, dependingCreepsSpawned) {
        "use strict";
        var ownedRooms = 0;
        var allRooms;
        var allRoom;
        var allRoomSpawn;
        var allRoomSpawnBuild;

        for (allRooms in Game.rooms) {
            allRoom = Game.rooms[allRooms];
            if (allRoom.controller != null && allRoom.controller.my) {

                allRoomSpawnBuild = allRoom.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_SPAWN;
                    }
                });
                if (allRoomSpawnBuild.length == 0) {
                    allRoomSpawn = allRoom.find(FIND_CONSTRUCTION_SITES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_SPAWN;
                        }
                    });
                }
                //console.log(allRoomSpawn)
                ownedRooms++;
            }
        }
        if (Game.gcl.level > 1 && ownedRooms < Game.gcl.level) {
            creepsNeeded = rooms_around.length - ownedRooms;
        }
        if (room_Claimers.length < claimer_spawn) {
            for (var toClaim in rooms_around) {
                var toClaimRoom = Game.rooms[rooms_around[toClaim]];
                if (toClaimRoom != undefined) {
                    if (!toClaimRoom.controller.my) {
                        var toClaimName = toClaimRoom.name;
                        var number = Math.floor(Math.random() * (room_Claimers.length + 1));
                        if (spawn.spawnCreep([CLAIM, MOVE, MOVE], "Claimer_" + toClaimName + "_" + number, {dryRun: true}) == 0) {
                            var creep = spawn.spawnCreep([CLAIM, MOVE, MOVE], "Claimer_" + toClaimName + "_" + number, {
                                memory: {
                                    role: 'claimer',
                                    room_dest: toClaimName
                                }
                            });
                        }
                    }
                }
            }
        }
    },
    spawnExplorer: function (spawn, roomDestination, creepsSpawned, creepsNeeded, dependingCreepsSpawned) {
        "use strict";

        var room = spawn.room;
        if (creepsSpawned < creepsNeeded) {
            var number = Math.floor(Math.random() * (creepsSpawned + 1));
            if (spawn.spawnCreep([CLAIM, MOVE, MOVE], "Explorer_" + roomDestination + "_" + number, {dryRun: true}) == 0) {
                var creep = spawn.spawnCreep([CLAIM, MOVE, MOVE], "Explorer_" + roomDestination + "_" + number, {
                    memory: {
                        role: 'explorer',
                        room_dest: toClaimName
                    }
                });
            }
        }
    }
};


module.exports = spawnCreeps;