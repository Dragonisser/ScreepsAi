var structureLink = {

	    /** @param {Room} roomName **/
		run: function(room) {

		    var links = room.find(FIND_STRUCTURES, {
    			filter: (structure) => {
                        return structure.structureType == STRUCTURE_LINK;
                    }
    			});
		    var target = Game.getObjectById('5783ac767f4d729c57725487');
		    if(links) {
		    	if(room.name == "W23N3") {
		    		links[0].transferEnergy(target);
		    		for(x = 0; x < links.length; x++) {
		    			
//		    			if(links[x] != target) {
//		    				links[x].transferEnergy(target, 100);
//		    			}
		    		}	    		
		    	}
		    }
		}
};

module.exports = structureLink;