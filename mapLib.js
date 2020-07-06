let mapLibFunctions = {

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

        let newRoom = roomList[Math.floor(Math.random() * 3)];
        console.log("New room '" + newRoom + "' selected for creep '" + creep.name + "'")

        return newRoom;
    },
    getRoomList: function () {
        "use strict";
        return Memory.roomList;
    },
    setRoomList: function (roomList) {
        "use strict";
        Memory.roomList = roomList;
    }
};

module.exports = mapLibFunctions;