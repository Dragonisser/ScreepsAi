var roleNotifier = {

    /** @param {Creep} creep **/
    run: function (creep) {

        let today = new Date();
        today.setHours(today.getHours() + 2);

        let room = creep.room;
        let hostiles = room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length > 0) {
            let username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${hostiles[0].room} - ${today.toLocaleString} - ${Game.time}`);
        }
    }
};

module.exports = roleNotifier;