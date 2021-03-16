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
    addToRoomList:function (roomName, roomClaimable, visited) {
        let mapRooms = this.getRoomList();

        if (!mapRooms.some(el => el.room_name === roomName)) {
            mapRooms.push({room_name: roomName, claim_room: roomClaimable, visited: visited});
            this.setRoomList(mapRooms);
            console.log("Added " + roomName + " to list as " 
				+ (roomClaimable ? "claimable" : "not claimable") 
				+ " and " + (visited ? "visited" : "not visited"));
        } else {
            return false;
        }
    },
    removeFromRoomList:function (roomName) {
        let mapRooms = this.getRoomList();
        const index = mapRooms.findIndex(obj => obj.room_name == roomName);
		
        if (index > -1) {
            mapRooms.splice(index, 1);
            this.setRoomList(mapRooms);
            console.log("Removed " + roomName + " from List");
        }
    },
	markRoomClaimStatus:function (roomName, claimable) {
		let mapRooms = this.getRoomList();
        const index = mapRooms.findIndex(obj => obj.room_name == roomName);

		if (index > -1) {
			mapRooms[index].claim_room = claimable;
			mapRooms[index].visited = true;
			console.log("Marked " + roomName + " as claimable");
			return true;
		} else {
			return false;
		}
		
	},
	checkIfRoomVisited:function (roomName) {
		let mapRooms = this.getRoomList();
        const index = mapRooms.findIndex(obj => obj.room_name == roomName);
		if (index > -1) {
			return mapRooms[index].visited;
		}
	},
	getNextUnvisitedRoom:function (creep) {
		let mapRooms = this.getRoomList();
		mapRooms = mapRooms.filter(room => room.visited === false);
		
		mapRooms = mapRooms.sort(function (a, b) {
			let aDistance = Game.map.getRoomLinearDistance(creep.room.name, a.room_name);
			let bDistance = Game.map.getRoomLinearDistance(creep.room.name, b.room_name);

            return aDistance - bDistance;
        })

        if (mapRooms.length > 0) {
			console.log("New room '" + mapRooms[0].room_name + "' selected for creep '" + creep.name + "'")
            return mapRooms[0].room_name;
        }
	},
    getRoomListClaimable:function () {
        let mapRooms = this.getRoomList();
        
        for (let i in Game.rooms) {
            let room = Game.rooms[i];
            if (room.controller !== undefined) {
                if (room.controller.my || room.controller.my !== undefined) {
                    const index = mapRooms.findIndex(map => map.room_name === room.name);
                    if (index > -1) {
                        mapRooms.splice(index, 1);
                    }
                }
            }
        }
        return mapRooms.filter(room => room.claim_room === true);
    },
    getNextClaimableRoom:function (spawn) {
        let claimableRooms = this.getRoomListClaimable();

        claimableRooms = claimableRooms.sort(function (a, b) {
            let aDistance = Game.map.getRoomLinearDistance(spawn.room.name, a.room_name);
            let bDistance = Game.map.getRoomLinearDistance(spawn.room.name, b.room_name);

            return aDistance - bDistance;
        })

        if (claimableRooms.length > 0) {
            return claimableRooms[0];
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
		
		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				if(x === numberFirst && y === numberSecond) {
					continue;
				}
				roomName = directionFirst + x + directionSecond + y;
				this.addToRoomList(roomName, false, false);
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
	isNumericChar:function (c) {
		return /\d/.test(c); 
	}
};

module.exports = mapLibFunctions;