var structureTower = {

    run: function (roomName) {

        var hostiles = roomName.find(FIND_HOSTILE_CREEPS);
        var today = new Date();
        today.setHours(today.getHours() + 2);
        
        if (hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${hostiles[0].room} - ${today.toLocaleString()} - ${Game.time}`);
        }

        var tower = roomName.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        if (tower) {
            for (i = 0; i < tower.length; i++) {
                if (tower[i].energy > 500 && roomName.energyAvailable > 500 && hostiles.length === 0) {
                    var initialDamagedStructure = tower[i].pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType === STRUCTURE_RAMPART ? structure.hits < 5000 && structure.ticksToDecay < 100 : (structure.hits < (structure.hitsMax <5000 ? structure.hitsMax : 5000))
                    });

                    var closestDamagedStructure = tower[i].pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType === STRUCTURE_RAMPART ? structure.hits < 50000 : (structure.hits < (structure.hitsMax < 50000 ? structure.hitsMax : 50000))
                    });
                    
                    var closestDamagedStructure2 = tower[i].pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType === STRUCTURE_RAMPART ? structure.hits < 1500000 : (structure.hits < (structure.hitsMax < 1500000 ? structure.hitsMax : 1500000))
                    });
                    
                    var closestDamagedStructure3 = tower[i].pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType === STRUCTURE_RAMPART ? structure.hits < 5000000 : (structure.hits < (structure.hitsMax < 5000000 ? structure.hitsMax : 5000000))
                    });

                    if (initialDamagedStructure) {
                        if (initialDamagedStructure.hits < (initialDamagedStructure.hitsMax < 5000 ? initialDamagedStructure.hitsMax : 5000)) {
                            if (tower[i].energy > 500) {
                                tower[i].repair(initialDamagedStructure);
                            }
                        }
                    } else if (closestDamagedStructure) {
                        if (closestDamagedStructure.hits < (closestDamagedStructure.hitsMax < 50000 ? closestDamagedStructure.hitsMax : 50000)) {
                            if (tower[i].energy > 500) {
                                tower[i].repair(closestDamagedStructure);
                            }
                        }
                    } else if (closestDamagedStructure2) {
                        if (closestDamagedStructure2.hits < (closestDamagedStructure2.hitsMax < 1500000 ? closestDamagedStructure2.hitsMax : 1500000)) {
                            if (tower[i].energy > 500) {
                                tower[i].repair(closestDamagedStructure2);
                            }
                        }
                    } else if (closestDamagedStructure3) {
                        if (closestDamagedStructure3.hits < (closestDamagedStructure3.hitsMax < 5000000 ? closestDamagedStructure3.hitsMax : 5000000)) {
                            if (tower[i].energy > 500) {
                                tower[i].repair(closestDamagedStructure3);
                            }
                        }
                    }
                } else if (tower[i].energy > 200 && hostiles.length === 0) {
                    var closestDamaged = tower[i].pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType === STRUCTURE_RAMPART && structure.hits < 25000
                    });
                    tower[i].repair(closestDamaged);
                }
                var closestHostile = tower[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                // var creepsHostile = tower[i].room.find(FIND_HOSTILE_CREEPS);
                // var healingCreep;
                //for (i = 0; i < creepsHostile.length; i++) {
                    //console.log(_.filter(creepsHostile[i].body, function(bp){return bp == MOVE;}).length)
                //}
                
                //
                
                if (closestHostile) {
                    tower[i].attack(closestHostile);
                }
            }
        }
    }
};
module.exports = structureTower;