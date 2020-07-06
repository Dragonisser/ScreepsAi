var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleDefender = require('role.defender');
var roleAttacker = require('role.attacker');
var roleNotifier = require('role.notifier');
var roleHarvesterExternal = require('role.harvester_external');
var roleHarvesterMineral = require('role.harvester_mineral');
var roleClaimer = require('role.claimer');
var roleFiller = require('role.filler');
var roleExplorer = require('role.explorer');

var roleLib = require('roleLib');
var mapLib = require('mapLib');

var structureTower = require('structure.tower');
var structureLink = require('structure.link');

var harvester_spawn = 3;
var harvester_room_spawn = 4;
var harvester_mineral_spawn = 1;
var upgrader_spawn = 3;
var builder_spawn = 0;
var repair_spawn = 0;
var defender_spawn = 2;
var claimer_spawn = 0;
var filler_spawn = 0;

var route_cost_old = 5000;
var route_cost = 0;
var route_spawnroom_name = "";

var mapRooms = [];

mapLib.setRoomList([{room_name:"W7N4", claim_room: false}, {room_name:"W8N4", claim_room: true}]);

if (Game.spawns.Spawn1 != null) {
    var spawn_room = Game.spawns.Spawn1.room.name;
    if (spawn_room == "sim") {
        mapLib.setRoomList({room_name:Game.spawns.Spawn1.room.name, claim_room:false});
    } else {
        var mapRooms = mapLib.getRoomList();
        mapRooms.unshift({room_name:Game.spawns.Spawn1.room.name, claim_room:false});
        mapLib.setRoomList(mapRooms);
    }
}

module.exports.loop = function () {
    "use strict";

    mapRooms = mapLib.getRoomList();

    var role_Harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var role_Harvesters_External = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester_external');
    var role_Harvesters_Mineral = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester_mineral');
    var role_Builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var role_Upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var role_Repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
    var role_Defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    var role_Claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
    var role_Fillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'filler');

    for (var spawns in Game.spawns) {
        var spawn = Game.spawns[spawns];
        var room = spawn.room;

        for (var x = 0; x < mapRooms.length; x++) {

            var room_Harvesters_External = _.filter(role_Harvesters_External, (creep) => creep.memory.room_dest == mapRooms[x].room_name);
            var room_Claimers = _.filter(role_Claimers, (creep) => creep.memory.room_dest == mapRooms[x].room_name);

            var room_Upgraders = _.filter(role_Upgraders, (creep) => creep.memory.room_dest == room.name);
            var room_Harvesters = _.filter(role_Harvesters, (creep) => creep.memory.room_dest == room.name);
            var room_Harvesters_Mineral = _.filter(role_Harvesters_Mineral, (creep) => creep.memory.room_dest == room.name);
            var room_Builders = _.filter(role_Builders, (creep) => creep.memory.room_dest == room.name);
            var room_Repairs = _.filter(role_Repairs, (creep) => creep.memory.room_dest == room.name);
            var room_Defenders = _.filter(role_Defenders, (creep) => creep.memory.room_dest == room.name);
            var room_Fillers = _.filter(role_Fillers, (creep) => creep.memory.room_dest == room.name);

            //HARVESTER
            roleLib.spawnHarvester(spawn, room, room_Harvesters.length, harvester_spawn, 0);

            //HARVESTER_EXTERNAL
            //roleLib.spawnHarvesterExternal();

            //HARVESTER_MINERAL
            //roleLib.spawnHarvesterMinderal();

            //UPGRADER
            roleLib.spawnUpgrader(spawn, room, room_Upgraders.length, upgrader_spawn, room_Harvesters.length);

            //BUILDER
            roleLib.spawnBuilder(spawn, room, room_Builders.length, builder_spawn, room_Harvesters.length);

            //CLAIMER
            //roleLib.spawnClaimer();

            //FILLER
            //roleLib.spawnFiller();
        }

        //EXPLORER
        //roleLib.spawnExplorer();
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
                roleHarvesterExternal.run(creep);
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
            case 'explorer':
                roleExplorer.run(creep);
                break;
        }
    }
};