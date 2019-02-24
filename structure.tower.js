var structureTower = {

    /**
     * @param {Room}
     *            roomName *
     */
    run: function (roomName) {

        var hostiles = roomName.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);
        }

        var tower = roomName.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        if (tower) {
            for (i = 0; i < tower.length; i++) {
                if (tower[i].energy > 500 && roomName.energyAvailable > 500 && hostiles.length == 0) {
                    var closestDamagedStructure = tower[i].pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType == STRUCTURE_RAMPART ? structure.hits < 50000 : (structure.hits < (structure.hitsMax < 50000 ? structure.hitsMax : 50000))
                    });
                    
                    var closestDamagedStructure2 = tower[i].pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType == STRUCTURE_RAMPART ? structure.hits < 1500000 : (structure.hits < (structure.hitsMax < 1500000 ? structure.hitsMax : 1500000))
                    });

                    if (closestDamagedStructure) {
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
                    }
                }
                var closestHostile = tower[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower[i].attack(closestHostile);
                }
            }
        }
    }
};
module.exports = structureTower;