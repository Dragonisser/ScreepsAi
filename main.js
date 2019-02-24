var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleDefender = require('role.defender');
var roleAttacker = require('role.attacker');
var roleNotifier = require('role.notifier');
var roleHarvesterRoom = require('role.harvester_room');
var roleHarvesterMineral = require('role.harvester_mineral');
var roleClaimer = require('role.claimer');
var roleFiller = require('role.filler');

var screepsPlus = require('screepsplus')

var structureTower = require('structure.tower');
var structureLink = require('structure.link');


var harvester_spawn = 4;
var harvester_room_spawn = 4;
var harvester_mineral_spawn = 1;
var upgrader_spawn = 3;
var builder_spawn = 0;
var repair_spawn = 0;
var defender_spawn = 2;
var claimer_spawn = 0;
var filler_spawn = 0;

if (Game.spawns.Spawn1 != undefined) {
    var spawn = Game.spawns.Spawn1.room.name;
}
var rooms_around = [spawn, "E14N51", "E15N52"];

module.exports.loop = function () {
    //console.log(Game.gcl.progress)
    //console.log(Game.gcl.level)
    //console.log(Game.gcl.progressTotal)



    var role_Harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var role_Harvesters_room = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester_room');
    var role_Harvesters_mineral = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester_mineral');
    var role_Builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var role_Upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var role_Repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
    var role_Defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    var role_Claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
    var role_Fillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'filler');

    for (var spawns in Game.spawns) {
        var spawn = Game.spawns[spawns];
        var room = spawn.room;

        for (var x = 0; x < rooms_around.length; x++) {

            var room_Harvesters_room = _.filter(role_Harvesters_room, (creep) => creep.memory.room_dest == rooms_around[x]);
            var room_Claimers = _.filter(role_Claimers, (creep) => creep.memory.room_dest == rooms_around[x]);

            var room_Upgraders = _.filter(role_Upgraders, (creep) => creep.memory.room_dest == room.name);
            var room_Harvesters = _.filter(role_Harvesters, (creep) => creep.memory.room_dest == room.name);
            var room_Harvesters_Mineral = _.filter(role_Harvesters_mineral, (creep) => creep.memory.room_dest == room.name);
            var room_Builders = _.filter(role_Builders, (creep) => creep.memory.room_dest == room.name);
            var room_Repairs = _.filter(role_Repairs, (creep) => creep.memory.room_dest == room.name);
            var room_Defenders = _.filter(role_Defenders, (creep) => creep.memory.room_dest == room.name);
            var room_Fillers = _.filter(role_Fillers, (creep) => creep.memory.room_dest == room.name);


            /*
             console.log("room_Harvesters_room " + room_Harvesters_room.length);
             console.log("room_Claimers " + room_Claimers.length);
             console.log("room_Upgraders " + room_Upgraders.length);

             console.log("room_Harvesters " + room_Harvesters.length);
             console.log("room_Builders " + room_Builders.length);
             console.log("room_Repairs " + room_Repairs.length);
             console.log("room_Defenders " + room_Defenders.length);
             console.log("room_Fillers " + room_Fillers.length);
             */
            /*
             console.log("room_Harvesters_room " + room_Harvesters_room + " - " + rooms_around[x]);
             console.log("room_Claimers " + room_Claimers + " - " + rooms_around[x]);
             console.log("room_Upgraders " + room_Upgraders + " - " + rooms_around[x]);

             console.log("room_Harvesters " + room_Harvesters + " - " + room.name);
             console.log("room_Builders " + room_Builders + " - " + room.name);
             console.log("room_Repairs " + room_Repairs + " - " + room.name);
             console.log("room_Defenders " + room_Defenders + " - " + room.name);
             console.log("room_Fillers " + room_Fillers + " - " + room.name);
             */
            
            /*
            var firstPlain;
            var lastPlain;
            for(var x = 0; x < 49; x++) {
                    var terrain = Game.map.getTerrainAt(room.getPositionAt(x, 0))
                    if(terrain == "plain") {
                        if(firstPlain == null) {
                            firstPlain = new RoomPosition(x, 0, room.name);
                            for(var j = 0; j < 3; j ++) {
                                room.createConstructionSite(firstPlain.x - 1, j, STRUCTURE_WALL)
                                room.createConstructionSite(firstPlain.x - 2, j, STRUCTURE_WALL)
                            }
                        } else {
                            lastPlain = new RoomPosition(x, 0, room.name);
                        }
                        room.createConstructionSite(x, 2, STRUCTURE_WALL)
                    } else {
                        firstPlain = null;
                        if(lastPlain != null) {
                            for(var j = 0; j < 3; j ++) {
                                room.createConstructionSite(lastPlain.x + 1, j, STRUCTURE_WALL)
                                room.createConstructionSite(lastPlain.x + 2, j, STRUCTURE_WALL)
                            }
                            lastPlain = null
                        }
                        
                    }
            }
             */
             
            //Game.spawns["Spawn1"].spawnCreep([ATTACK, ATTACK, MOVE, MOVE], "A1", {memory: {role: 'attacker'}});
           

            //Defender
            var hostiles = room.find(FIND_HOSTILE_CREEPS);
            if (hostiles.length > 0) {
                if (room_Defenders.length < defender_spawn) {
                    var number = Math.floor(Math.random() * (room_Defenders.length + 1));
                    if (spawn.spawnCreep([ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE], "Defender_R_" + rooms_around[x] + number, {dryRun: true}) == 0) {
                        var creep = spawn.spawnCreep([ATTACK, ATTACK, MOVE, MOVE], "Defender_R_" + rooms_around[x] + "_" + number, {
                            memory: {
                                role: 'defender',
                                room_dest: room.name,
                                room_spawn: room.name,
                                flag_dest_x: '28',
                                flag_dest_y: '11'
                            }
                        });
                    }
                }
            }

            //###CLAIMING ROOMS START###

            //Claimer
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
                claimer_spawn = rooms_around.length - ownedRooms;
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


            //###CLAIMING ROOMS END###


            //HARVESTER
            if (room_Harvesters.length < harvester_spawn) {
                var number = Math.floor(Math.random() * (room_Harvesters.length + 1));
                if (room.energyAvailable > 800) {
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

            //HARVESTER_ROOM
            var controllerInRoom = Game.rooms[rooms_around[x]];
            var roomConstruct = Game.rooms[rooms_around[x]];
            var constructSpawn;
            if (roomConstruct != undefined) {
                constructSpawn = roomConstruct.find(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_SPAWN;
                    }
                });
            }
            if (controllerInRoom == undefined || constructSpawn.length > 0) {
                if (room_Harvesters_room.length < harvester_room_spawn) {
                    if (spawn.room.energyAvailable <= 550) {
                        var number = Math.floor(Math.random() * (room_Harvesters_room.length + 1));
                        if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], "Harvester_R_" + rooms_around[x] + number, {dryRun: true}) == 0) {
                            var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], "Harvester_R_" + rooms_around[x] + "_" + number, {
                                memory: {
                                    role: 'harvester_room',
                                    room_dest: rooms_around[x],
                                    room_spawn: room.name,
                                    flag_dest_x: '25',
                                    flag_dest_y: '25'
                                }
                            });
                        }
                    } else {
                        var number = Math.floor(Math.random() * (room_Harvesters_room.length + 1));
                         if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "Harvester_R_" + rooms_around[x] + number, {dryRun: true}) == 0) {
                            var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "Harvester_R_" + rooms_around[x] + "_" + number, {
                                memory: {
                                    role: 'harvester_room',
                                    room_dest: rooms_around[x],
                                    room_spawn: room.name,
                                    flag_dest_x: '25',
                                    flag_dest_y: '25'
                                }
                            });
                        }
                    }
                }
            }

            //UPGRADER
            var controllerLevel = room.controller.level;

            if (controllerLevel < 8) {
                upgrader_spawn = 3;
            } else {
                upgrader_spawn = 2;  
            }
            if (room_Upgraders.length < upgrader_spawn && room_Harvesters.length > 0) {
                var number = Math.floor(Math.random() * (room_Upgraders.length + 1));
                if (room.energyAvailable >= 1200) {
                    if (spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Upgrader_" + room.name + "_" + number, {dryRun: true}) == 0) {
                        var creep = spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Upgrader_" + room.name + "_" + number, {
                            memory: {
                                role: 'upgrader',
                                room_dest: room.name
                            }
                        });
                    }
                } else if (room.energyAvailable >= 800) {
                    if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Upgrader_" + room.name + "_" + number, {dryRun: true}) == 0) {
                        var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Upgrader_" + room.name + "_" + number, {
                            memory: {
                                role: 'upgrader',
                                room_dest: room.name
                            }
                        });
                    }
                } else if (room.energyAvailable >= 500) {
                    if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Upgrader_" + room.name + "_" + number, {dryRun: true}) == 0) {
                        var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Upgrader_" + room.name + "_" + number, {
                            memory: {
                                role: 'upgrader',
                                room_dest: room.name
                            }
                        });
                    }
                } else {
                    if (spawn.spawnCreep([WORK, CARRY, MOVE], "Upgrader_" + room.name + "_" + number, {dryRun: true}) == 0) {
                        var creep = spawn.spawnCreep([WORK, CARRY, MOVE], "Upgrader_" + room.name + "_" + number, {
                            memory: {
                                role: 'upgrader',
                                room_dest: room.name
                            }
                        });
                    }
                }

            }

            //HARVESTER_MINERAL
            if(controllerLevel >= 6) {
                room_mineral = room.find(FIND_MINERALS);
                room_storage = room.storage;
                room_storageFull = false;
                if(room_storage != null) {
                    room_storageFull = _.sum(room_storage.store) < room_storage.storeCapacity
                }
                room_extractor = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return structure.structureType == STRUCTURE_EXTRACTOR;
                }});
                if(room_extractor.length == 0) {
                    room.createConstructionSite(room_mineral[0].pos, STRUCTURE_EXTRACTOR)
                }
                
                if (room_Harvesters_Mineral.length < harvester_mineral_spawn && room_extractor.length > 0 && room_mineral[0].mineralAmount > 0 && room_storageFull) {
                    var number = Math.floor(Math.random() * (room_Harvesters_Mineral.length + 1));
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

            //BUILDER
            var targets = room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0 && targets.length <= 4) {
                builder_spawn = 2;
            } else if (targets.length > 4) {
                builder_spawn = 4;
            } else {
                builder_spawn = 0
            }
            if (room_Builders.length < builder_spawn && room_Harvesters.length > 0) {
                var number = Math.floor(Math.random() * (room_Builders.length + 1));
                if (room.energyAvailable > 1200) {
                    if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Builder_" + room.name + "_" + number, {dryRun: true}) == 0) {
                        var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Builder_" + room.name + "_" + number, {
                            memory: {
                                role: 'builder',
                                room_dest: room.name
                            }
                        });
                    }
                } else if (room.energyAvailable > 600) {
                    if (spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Builder_" + room.name + "_" + number, {dryRun: true}) == 0) {
                        var creep = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Builder_" + room.name + "_" + number, {
                            memory: {
                                role: 'builder',
                                room_dest: room.name
                            }
                        });
                    }
                } else {
                    if (spawn.spawnCreep([WORK, CARRY, MOVE], "Builder_" + room.name + "_" + number, {dryRun: true}) == 0) {
                        var creep = spawn.spawnCreep([WORK, CARRY, MOVE], "Builder_" + room.name + "_" + number, {
                            memory: {
                                role: 'builder',
                                room_dest: room.name
                            }
                        });
                    }
                }
            }

            //FILLER
            var links = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_LINK || structure.structureType == STRUCTURE_STORAGE;
                }
            });
            if ((links.length > 0) && (room.controller.level < 6)) {
                filler_spawn = 1;
            } else if ((links.length > 0) && (room.controller.level > 5)) {
                filler_spawn = 2;
            } else {
                filler_spawn = 0
            }
            if (room_Fillers.length < filler_spawn) {
                if (room.energyAvailable > 650) {
                    var number = Math.floor(Math.random() * (room_Fillers.length + 1));
                    if (spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], "Filler_" + room.name + "_" + number, {dryRun: true}) == 0) {
                        var creep = spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], "Filler_" + room.name + "_" + number, {
                            memory: {
                                role: 'filler',
                                room_dest: room.name
                            }
                        });
                    }
                    
                } else {
                    var number = Math.floor(Math.random() * (room_Fillers.length + 1));
                    if (spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Filler_" + room.name + "_" + number, {dryRun: true}) == 0) {
                        var creep = spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Filler_" + room.name + "_" + number, {
                            memory: {
                                role: 'filler',
                                room_dest: room.name
                            }
                        });
                    }
                }
            }
        }
    }


    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for (var rooms in Game.rooms) {
        var room = Game.rooms[rooms];
        structureTower.run(room);
        structureLink.run(room);
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        //roleNotifier.run(creep);
        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'harvester_room':
                roleHarvesterRoom.run(creep);
                break;
            case 'harvester_mineral':
                roleHarvesterMineral.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'repair':
                roleRepair.run(creep);
                break;
            case 'defender':
                roleDefender.run(creep);
                break;
            case 'attacker':
                roleAttacker.run(creep);
                break;
            case 'claimer':
                roleClaimer.run(creep);
                break;
            case 'filler':
                roleFiller.run(creep);
                break;
        }
    }
    screepsPlus.collect_stats();
    
}