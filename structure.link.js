var structureLink = {

    /** @param {Room} roomName **/
    run: function (room) {
        var closesToStructure = ""

        var spawn = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN
            }
        });

        var links = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LINK;
            }
        });

        if (links.length > 0) {
            for (x = 0; x < links.length; x++) {

                if (closesToStructure == "") {
                    closesToStructure = links[x]
                } else {
                    if (PathFinder.search(spawn[0].pos, links[x].pos).cost < PathFinder.search(spawn[0].pos, closesToStructure.pos).cost) {
                        closesToStructure = links[x]
                    }
                }
            }
            for (x = 0; x < links.length; x++) {
                if (closesToStructure != "") {
                    links[x].transferEnergy(closesToStructure, 200);
                }
            }
        }
    }
};

module.exports = structureLink;