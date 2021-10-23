let mapLibFunctions = {

    getRoomList:function () {
        if(Memory.roomList) {
            return Memory.roomList;
        } else {
            Memory.roomList = [];
            return Memory.roomList;
        }
    },
    setRoomList:function (roomList) {
        Memory.roomList = roomList;
    },
	addToRoomList: function (roomName, roomClaimable, visited, reachable, enemyControlled) {
        let mapRooms = this.getRoomList();

        if (!mapRooms.some(el => el.name === roomName)) {
			mapRooms.push({
				name: roomName, claimable: roomClaimable
				, reachable: reachable, enemyControlled: enemyControlled
				, visited: visited, sourceSpots: []
			});
            this.setRoomList(mapRooms);
			console.log("Added " + roomName + " to list.");
        } else {
            return false;
        }
    },
    removeFromRoomList:function (roomName, reason) {
        let mapRooms = this.getRoomList();
        const index = mapRooms.findIndex(obj => obj.name === roomName);
		
        if (index > -1) {
            mapRooms.splice(index, 1);
            this.setRoomList(mapRooms);
            console.log("Removed " + roomName + " from List. Reason: " + reason);
        }
    },
	changeRoomStatus:function (roomName, status, boolean) {
		let mapRooms = this.getRoomList();
        const index = mapRooms.findIndex(obj => obj.name === roomName);

		if (index > -1) {
			console.log("Change status '" + status + "' of room '" + roomName + "' with value '" + boolean + "'");
			switch (status) {
				case 'CLAIMABLE':
					mapRooms[index].claimable = boolean;
					return true;
				case 'VISITED':
					mapRooms[index].visited = boolean;
					return true;
				case 'REACHABLE':
					mapRooms[index].reachable = boolean;
					return true;
				case 'ENEMYCONTROLLED':
					mapRooms[index].enemyControlled = boolean;
					return true;
				default:
					return false;
            }
		} else {
			return false;
		}
		
	},
	checkIfRoomVisited:function (roomName) {
		let mapRooms = this.getRoomList();
        const index = mapRooms.findIndex(obj => obj.name === roomName);
		if (index > -1) {
			return mapRooms[index].visited;
		} else {
			return true;
		}
	},
	getNextUnvisitedRoom:function (creep) {
		let mapRooms = this.getRoomList();
		mapRooms = mapRooms.filter(room => room.visited === false);
		
		mapRooms = mapRooms.sort(function (a, b) {
			let aDistance = Game.map.getRoomLinearDistance(creep.room.name, a.name);
			let bDistance = Game.map.getRoomLinearDistance(creep.room.name, b.name);

            return aDistance - bDistance;
        })

        if (mapRooms.length > 0) {
			console.log("New room '" + mapRooms[0].name + "' selected for creep '" + creep.name + "'")
            return mapRooms[0].name;
        }
	},
	getUnvisitedRooms: function () {
		let mapRooms = this.getRoomList();
		return mapRooms.filter(room => room.visited === false);
    },
	getDistanceToUnvisitedRoom:function (creep, roomName) {
    	let dist = Game.map.getRoomLinearDistance(creep.room.name, roomName);
		return dist ? dist : 1;
	},
    getRoomListClaimable:function () {
        let mapRooms = this.getRoomList();
        
        for (let i in Game.rooms) {
            let room = Game.rooms[i];
            if (room.controller !== undefined) {
                if (room.controller.my || room.controller.my !== undefined) {
                    const index = mapRooms.findIndex(map => map.name === room.name);
                    if (index > -1) {
                        mapRooms.splice(index, 1);
                    }
                }
            }
		}
        return mapRooms.filter(room => room.claimable === true);
	},
	getRoomsWithUnbuildSpawn: function () {
		let roomConstruct = [];
		for (let i in Game.rooms) {
			let room = Game.rooms[i];
			if (room.controller !== undefined) {
				if (room.controller.my || room.controller.my !== undefined) {
					var constructSpawn = room.find(FIND_CONSTRUCTION_SITES, {
						filter: (structure) => {
							return structure.structureType === STRUCTURE_SPAWN && structure.my;
						}
					});
					if (constructSpawn.length > 0) {
						if (!roomConstruct.some(el => el.name === room.name)) {
							roomConstruct.push(room);
                        }
                    }
				}
			}
		}
		return roomConstruct;
    },
    getNextClaimableRoom:function (roomName) {
		let claimableRooms = this.getRoomListClaimable();
		let unbuildSpawns = this.getRoomsWithUnbuildSpawn();

        claimableRooms = claimableRooms.sort(function (a, b) {
			let aDistance = Game.map.getRoomLinearDistance(roomName, a.name);
			let bDistance = Game.map.getRoomLinearDistance(roomName, b.name);

            return aDistance - bDistance;
        })

		if (unbuildSpawns.length > 0) {
			return unbuildSpawns[0].name;
        } else if (claimableRooms.length > 0) {
			return claimableRooms[0].name;
		} else {
			return claimableRooms;
		}
    },
    getGCLClaimsAvailable:function () {
        let gcl = Game.gcl.level;
        let roomCount = 0;

        for (let i in Game.rooms) {
            let room = Game.rooms[i];
            if (room.controller !== undefined) {
                if (room.controller.my || room.controller.my !== undefined) {
                    roomCount++;
                }
            }
        }
        return gcl - roomCount;
    },
	mapRoomsAroundStart:function (spawnRoomName) {
		
		let nameArr = this.getRoomNameArray(spawnRoomName);
		
		let directionFirst = nameArr[0]; //W
		let numberFirst = nameArr[1]; //7
		let directionSecond = nameArr[2]; //N
		let numberSecond = nameArr[3]; //3

		for (let x = 0; x <= 10; x++) {
			for (let y = 0; y <= 10; y++) {
				if(x === numberFirst && y === numberSecond) {
					continue;
				}
				let roomName = directionFirst + x + directionSecond + y;
				this.addToRoomList(roomName, false, false, true, false);
			}
		}
	},
	getRoomNameArray:function (roomName) {
		
		let directionFirst = roomName.charAt(0); //W
		let numberFirst = parseInt(roomName.charAt(1)); //7
		let directionSecond = roomName.charAt(2); //N
		let numberSecond = parseInt(roomName.charAt(3)); //3
		
		if(roomName.length === 5) {
			if(this.isNumericChar(roomName.charAt(1)) && this.isNumericChar(roomName.charAt(2))) {
				numberFirst = parseInt(roomName.charAt(1) + roomName.charAt(2));
				directionSecond = roomName.charAt(3);
				numberSecond = parseInt(roomName.charAt(4));
			} else {
				numberFirst = parseInt(roomName.charAt(1));
				directionSecond = roomName.charAt(2);
				numberSecond = parseInt(roomName.charAt(3) + roomName.charAt(4));
			} 
		} else if (roomName.length === 6) {
			numberFirst = parseInt(roomName.charAt(1) + roomName.charAt(2));
			directionSecond = roomName.charAt(3);
			numberSecond = parseInt(roomName.charAt(4) + roomName.charAt(5));
		}
		
		return [directionFirst,numberFirst,directionSecond,numberSecond];
		
	},
	getSourceHarvestSpots:function (roomName) {
		let mapRooms = this.getRoomList();
		const index = mapRooms.findIndex(obj => obj.name === roomName);
		if (index > -1) {
			return mapRooms[index].sourceSpots.length;
		} else {
			return 0;
		}
	},
	addSourceSpotsToList:function (creep) {
		let mapRooms = this.getRoomList();
		let roomName = creep.room.name;
		const index = mapRooms.findIndex(obj => obj.name === roomName);
		if (index > -1) {
			let sources = creep.room.find(FIND_SOURCES);
			const terrain = Game.map.getRoomTerrain(creep.memory.room_dest);

			for (let source in sources) {

				let posX = sources[source].pos.x;
				let posY = sources[source].pos.y;


				for (let i = posX - 1; i <= posX + 1; i++) {
					for (let j = posY - 1; j <= posY + 1; j++) {
						switch(terrain.get(i, j)) {
							case TERRAIN_MASK_SWAMP:
							case 0:
								mapRooms[index].sourceSpots.push({x: i, y: j});
								break;
						}
					}
				}
			}
		}
	},
	isNumericChar:function (c) {
		return /\d/.test(c); 
	}
};

module.exports = mapLibFunctions;