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
var harvester_external_spawn = 4;
var harvester_mineral_spawn = 1;
var upgrader_spawn = 3;
var builder_spawn = 0;
var repair_spawn = 0;
var defender_spawn = 2;
var claimer_spawn = 0;
var filler_spawn = 0;

mapLib.mapRoomsAroundStart(Game.spawns.Spawn1.room.name);

module.exports.loop = function () {
    "use strict";

    let mapRooms = mapLib.getRoomListClaimable();

    var role_Harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    var role_Harvesters_External = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester_external');
    var role_Harvesters_Mineral = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester_mineral');
    var role_Builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    var role_Upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    var role_Repairs = _.filter(Game.creeps, (creep) => creep.memory.role === 'repair');
    var role_Defenders = _.filter(Game.creeps, (creep) => creep.memory.role === 'defender');
    var role_Claimers = _.filter(Game.creeps, (creep) => creep.memory.role === 'claimer');
    var role_Fillers = _.filter(Game.creeps, (creep) => creep.memory.role === 'filler');
    var role_Explorer = _.filter(Game.creeps, (creep) => creep.memory.role === 'explorer');

    for (let spawns in Game.spawns) {
        let spawn = Game.spawns[spawns];
        let room = spawn.room;
        
        var room_Upgraders = _.filter(role_Upgraders, (creep) => creep.memory.room_dest === room.name);
        var room_Harvesters = _.filter(role_Harvesters, (creep) => creep.memory.room_dest === room.name);
        var room_Harvesters_Mineral = _.filter(role_Harvesters_Mineral, (creep) => creep.memory.room_dest === room.name);
        var room_Builders = _.filter(role_Builders, (creep) => creep.memory.room_dest === room.name);
        var room_Repairs = _.filter(role_Repairs, (creep) => creep.memory.room_dest === room.name);
        var room_Defenders = _.filter(role_Defenders, (creep) => creep.memory.room_dest === room.name);
        var room_Fillers = _.filter(role_Fillers, (creep) => creep.memory.room_dest === room.name);
        var room_Explorer = role_Explorer;

        //HARVESTER
        roleLib.spawnHarvester(spawn, room, room_Harvesters.length, harvester_spawn);

        //HARVESTER_MINERAL
        //roleLib.spawnHarvesterMinderal();

        //UPGRADER
        roleLib.spawnUpgrader(spawn, room, room_Upgraders.length, upgrader_spawn, room_Harvesters.length);

        //BUILDER
        roleLib.spawnBuilder(spawn, room, room_Builders.length, builder_spawn, room_Harvesters.length);

        //FILLER
        roleLib.spawnFiller(spawn, room, room_Fillers.length, filler_spawn, room_Harvesters.length);

        //EXPLORER
        roleLib.spawnExplorer(spawn, null, room_Explorer.length, mapLib.getGCLClaimsAvailable(), room_Harvesters.length);
        
        for (let x = 0; x < mapRooms.length; x++) {

            //var room_Harvesters_External = _.filter(role_Harvesters_External, (creep) => creep.memory.room_dest == mapRooms[x].room_name);
            var room_Claimers = _.filter(role_Claimers, (creep) => creep.memory.room_dest === mapRooms[x].room_name);

            //HARVESTER_EXTERNAL
            roleLib.spawnHarvesterExternal(spawn, mapLib.getNextClaimableRoom(spawn), role_Harvesters_External.length, harvester_external_spawn);
            
            //CLAIMER
            //roleLib.spawnClaimer(spawn, mapLib.getNextClaimableRoom(spawn), room_Claimers.length, mapLib.getGCLClaimsAvailable(), room_Harvesters.length);
        }
        
    }


    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for (let rooms in Game.rooms) {
        let room = Game.rooms[rooms];
        structureTower.run(room);
        structureLink.run(room);
    }

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        //roleNotifier.run(creep);
        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'harvester_external':
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