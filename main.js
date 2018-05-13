var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleDefender = require('role.defender');
var roleAttacker = require('role.attacker');
var roleNotifyer = require('role.notifyer');
var roleHarvesterRoom = require('role.harvester_room');
var roleClaimer = require('role.claimer');
var roleFiller = require('role.filler');

var structureTower = require('structure.tower');
var structureLink = require('structure.link');

var spawns = 1;

var harvester_spawn = 2 * spawns;
var harvester_room_spawn = 3;
var upgrader_spawn = 5 * spawns;
var builder_spawn = spawns * 0;
var repair_spawn = 0;
var defender_spawn = 0;
var claimer_spawn = 1;
var filler_spawn = 0;


var room_list;
var spawn_list;

var room_count = new Map();
var rooms_around = ["W7N4", "W8N4"];

module.exports.loop = function () {

    for (var rooms in Game.rooms) {
        room_list = rooms;
        var room = Game.rooms[rooms];
        var const_site = room.find(FIND_CONSTRUCTION_SITES);
    }

    for (var spawnsL in Game.spawns) {
        spawn_list = spawnsL;
        var spawn = Game.spawns[spawnsL];

        //console.log(spawn);
    }


    var targets = Game.rooms.W7N3.find(FIND_CONSTRUCTION_SITES);
    if (targets.length > 0) {
        builder_spawn = 1 * spawns;
    } else {
        builder_spawn = 0 * spawns
    }

    //for(var spawns2 in Game.spawns) {
    //	//console.log(spawns2);
    //}

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var harvesters_room = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester_room');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
    var fillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'filler');

    var room_W7N3 = _.filter(Game.creeps, (creep) => creep.memory.room_dest == 'W7N3' && creep.memory.role == 'harvester_room');
    //var room_W22N2 = _.filter(Game.creeps, (creep) => creep.memory.room_dest == 'W22N2' && creep.memory.role == 'harvester_room');

    //var controller = Game.getObjectById('55db31b9efa8e3fe66e04d26');
    //console.log(controller.room.energyAvailable);
    //var room_W7N3 = Game.getObjectById('57701c9ac7eeb90a0684d00e').room;

    var harvester_count = harvesters.length;
    //var harvesters_room_count = harvesters_room.length;
    var builder_count = builders.length;
    var upgrader_count = upgraders.length;
    var repair_count = repairs.length;
    var defender_count = defenders.length;
    var claimer_count = claimers.length;
    var filler_count = fillers.length;

    var room_W7N3_count = room_W7N3.length;
    //var room_W22N2_count = room_W22N2.length;

    var s_harvester_count = String(harvester_count);
    //var s_harvesters_room_count = String(harvesters_room_count);
    var s_builder_count = String(builder_count);
    var s_upgrader_count = String(upgrader_count);
    var s_repair_count = String(repair_count);
    var s_defender_count = String(defender_count);
    var s_filler_count = String(filler_count);

    for (x = 1; x < spawns + 1; x++) {
        if (harvester_count < harvester_spawn) {
            switch (x) {
                case 1:
                    var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], "Harvester_" + s_harvester_count, {role: 'harvester'});
                    break;
                //case 2: var newName = Game.spawns.Spawn2.createCreep([WORK,CARRY,MOVE], "Harvester_" + s_harvester_count , {role: 'harvester'});
                //	break;
            }
        }


        if (harvester_count >= 1) {
            if (builder_count < builder_spawn) {
                switch (x) {
                    case 1:
                        var newName = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, CARRY, MOVE], "Builder_" + String(builder_count), {
                            role: 'builder',
                            room_dest: 'W7N3'
                        });
                        break;
                    //case 2: var newName = Game.spawns.Spawn2.createCreep([WORK,CARRY,MOVE], "Builder_" + String(builder_count) , {role: 'builder', room_dest: 'W23N2'});
                    //	break;
                }
            }
            if (upgrader_count < upgrader_spawn) {
                switch (x) {
                    case 1:
                        var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], "Upgrader_" + String(upgrader_count), {
                            role: 'upgrader',
                            room_dest: 'W7N3'
                        });
                        break;
                    //case 2: var newName = Game.spawns.Spawn2.createCreep([WORK,CARRY,MOVE], "Upgrader_" + String(upgrader_count) , {role: 'upgrader', room_dest: 'W23N2'});
                    //	break;
                }
            }
            if (repair_count < repair_spawn) {
                var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], "Repairer_" + s_repair_count, {role: 'repair'});
                //var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], "Repairs_" + s_repair_count , {role: 'repair'});
            }
            if (defender_count < defender_spawn) {
                var newName = Game.spawns.Spawn1.createCreep([ATTACK, ATTACK, ATTACK, ATTACK, TOUGH, MOVE, MOVE], "Defender_" + s_defender_count, {role: 'defender'});
                //var newName = Game.spawns.Spawn1.createCreep([ATTACK,ATTACK,TOUGH,MOVE,MOVE], "Defenders_" + s_defender_count , {role: 'defender'});
            }
            if (claimer_count < claimer_spawn) {
                var newName = Game.spawns.Spawn1.createCreep([CLAIM, CLAIM, MOVE], "Claimer", {
                    role: 'claimer',
                    room_dest: 'W7N4'
                })
            }
            //if(filler_count < filler_spawn) {
            //	if(room_w23n3.energyAvailable > 300) {
            //		var newName = Game.spawns.Spawn1.createCreep([WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], "Filler" + s_filler_count , {role: 'filler'})
            //	} else {
            //		var newName = Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], "Filler_" + s_filler_count , {role: 'filler'})
            //	}

            //}
        }

    }


    var harvesters_room_count = 0;
    if (Game.spawns.Spawn1.room.controller.level > 3) {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            for (var i = 0; i < rooms_around.length; i++) {
                room_count.set(rooms_around[i], 0)
            }
        }
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            for (var i = 0; i < rooms_around.length; i++) {
                var dest = creep.memory.room_dest;
                if (creep.memory.role == 'harvester_room') {
                    if (dest == rooms_around[i]) {
                        var count = 0;
                        if (room_count.has(dest)) {
                            count = room_count.get(dest);
                            if (count < harvester_room_spawn) {
                                room_count.set(dest, count + 1);
                            }
                        } else {
                            room_count.set(dest, 1)
                        }
                    }
                }
            }
        }
        if (room_count.size >= 0) {
            for (var [key, value] of room_count) {
                //console.log("Rooms with count: " + key + " | " + value);
                if (room_count.get(key) < harvester_room_spawn) {
                    //console.log("not enough harvester: " + room_count.get(key) + " / " + harvester_room_spawn);
                    Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], "Harvester_" + key + "_" + room_count.get(key), {
                        role: 'harvester_room',
                        room_dest: key,
                        flag_dest_x: '28',
                        flag_dest_y: '11'
                    });
                } else {
                    //console.log("enough harvester: " + room_count.get(key) + " / " + harvester_room_spawn);
                }
            }
        }
    }


    //Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE, MOVE], "Harvester_W7N4_" + 0, {role: 'harvester_room', room_dest: 'W7N4', flag_dest_x: '28', flag_dest_y: '11'});

    //if(harvesters_room_count < harvester_room_spawn) {
    //console.log(room_W23N2_count + " " + (harvester_room_spawn / 2) + " " + room_W23N2);
    //console.log(room_W22N2_count + " " + (harvester_room_spawn / 2) + " " + room_W22N2);

    //if(room_W7N3_count < (harvester_room_spawn)) {
    //console.log("Missing " + ((harvester_room_spawn / 2) - room_W23N2_count)+ " harvester in room W23N2")
    //var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE, MOVE], "Harvester_W23N2_" + s_harvesters_room_count, {role: 'harvester_room', room_dest: 'W23N2', flag_dest_x: '28', flag_dest_y: '11'});
    //}
    //if(room_W22N2_count < (harvester_room_spawn)) {
    //	//console.log("Missing " + ((harvester_room_spawn / 2) - room_W22N2_count)+ " harvester in room W22N2")
    //	var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE, MOVE], "Harvester_W22N2_" + s_harvesters_room_count, {role: 'harvester_room', room_dest: 'W22N2', flag_dest_x: '8', flag_dest_y: '10'});
    //	// Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE, MOVE], undefined, {role: 'harvester_room', room_dest: 'W22N2', flag_dest_x: '8', flag_dest_y: '10'});
    //}

    //var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], "Harvester_" + s_harvester_count , {role: 'harvester'});
    // }
    rooms.empt

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        var room = creep.room;
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                roleBuilder.run(creep);
            } else {
                roleHarvester.run(creep);
            }
        }
        if (creep.memory.role == 'repair') {
            roleRepair.run(creep);
        }
        if (creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if (creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
        if (creep.memory.role == 'harvester_room') {
            roleHarvesterRoom.run(creep);
        }
        if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        if (creep.memory.role == 'filler') {
            roleFiller.run(creep);
        }


        roleNotifyer.run(creep);
        structureTower.run(room);
        structureLink.run(room);
    }


    // Game.spawns.Spawn1.createCreep([RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE], undefined , {role: 'defender'})
    // Game.spawns.Spawn1.createCreep([CLAIM,MOVE], undefined , {role: 'claimer', room_dest: 'W23N2'})


    // Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE, MOVE], undefined, {role: 'harvester_room', room_dest: 'W23N2', flag_dest_x: '28', flag_dest_y: '11'});

    // Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'upgrader', room_dest: 'W23N3'})
}