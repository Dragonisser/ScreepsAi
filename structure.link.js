var structureLink = {

    run: function (room) {
        var closesToStructure = ""

        var spawn = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_SPAWN
            }
        });

        var links = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_LINK;
            }
        });

        if (links.length > 0 && spawn.length > 0) {
            for (let x = 0; x < links.length; x++) {

                if (closesToStructure === "") {
                    closesToStructure = links[x]
                } else {
                    //console.log(spawn[0].pos + " " + links[x].pos + " " + closesToStructure.pos)
                    if (PathFinder.search(spawn[0].pos, links[x].pos).cost < PathFinder.search(spawn[0].pos, closesToStructure.pos).cost) {
                        closesToStructure = links[x]
                    }
                }
            }
            for (let x = 0; x < links.length; x++) {
                if (closesToStructure !== "") {
                    if(closesToStructure.energy + 10 <= closesToStructure.energyCapacity) {
                        links[x].transferEnergy(closesToStructure);
                    }
                }
            }
        }
    }
};

module.exports = structureLink;