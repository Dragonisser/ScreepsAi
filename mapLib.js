let mapLibFunctions = {

    getRoomList: function () {
        "use strict";
        return Memory.roomList;
    },
    setRoomList: function (roomList) {
        "use strict";
        Memory.roomList = roomList;
    },
    addToRoomList: function (roomName, roomClaimable) {
        "use strict";

        let mapRooms = this.getRoomList();
        //console.log(mapRooms.includes(roomName));
        //console.log(mapRooms.indexOf(roomName));
        //console.log(mapRooms.filter(room_name => mapRooms.room_name === roomName));
        //console.log(mapRooms.some(el => el.room_name === roomName));

        if (!mapRooms.some(el => el.room_name === roomName)) {
            mapRooms.push({room_name: roomName, claim_room: roomClaimable});
            this.setRoomList(mapRooms);
            console.log("Added " + roomName + " to list as " + (roomClaimable ? "claimable" : "not claimable"));
        } else {
            return false;
        }
    },
    removeFromRoomList: function (roomName) {
        "use strict";
        let mapRooms = this.getRoomList();
        const index = mapRooms.indexOf(roomName);
        if (index > -1) {
            mapRooms.splice(index, 1);
            this.setRoomList(mapRooms);
            console.log("Removed " + roomName + " from List");
        }
    },
    getNextRoom(creep) {
        "use strict";
        //TODO Fix getting a new room if border has been reach or rooms around has been mapped already.
        let directionFirst = creep.room.name.charAt(0);
        let directionSecond = creep.room.name.charAt(2);
        let numberFirst = parseInt(creep.room.name.charAt(1));
        let numberSecond = parseInt(creep.room.name.charAt(3));


        let roomNorthName = directionFirst + numberFirst + directionSecond + (numberSecond + 1);
        let roomSouthName = directionFirst + numberFirst + directionSecond + (numberSecond - 1);
        let roomEastName = directionFirst + (numberFirst + 1) + directionSecond + numberSecond;
        let roomWestName = directionFirst + (numberFirst - 1) + directionSecond + numberSecond;

        let mapRooms = this.getRoomList();
        let roomList = [];

        if (!mapRooms.some(el => el.room_name === roomNorthName)) {
            roomList.push(roomNorthName);
        } else if (!mapRooms.some(el => el.room_name === roomSouthName)) {
            roomList.push(roomSouthName);
        } else if (!mapRooms.some(el => el.room_name === roomEastName)) {
            roomList.push(roomEastName);
        } else if (!mapRooms.some(el => el.room_name === roomWestName)) {
            roomList.push(roomWestName);
        }
        let newRoom = roomList[Math.floor(Math.random() * roomList.length)];

        console.log("New room '" + newRoom + "' selected for creep '" + creep.name + "'")

        return newRoom;
    },
    getRoomListClaimable: function () {
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
        mapRooms = mapRooms.filter(room => room.claim_room === true);
        return mapRooms;
    },
    getNextClaimableRoom: function (spawn) {
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
    }
};

module.exports = mapLibFunctions;