var roleNotifier = {

    /** @param {Creep} creep **/
    run: function (creep) {

        var today = new Date();
        today.setHours(today.getHours() + 2);
        
        var room = creep.room;
        var hostiles = room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${hostiles[0].room} - ${today.toLocaleString} - ${Game.time}`);
        }
    }
};

module.exports = roleNotifier;