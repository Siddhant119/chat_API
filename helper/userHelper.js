const users = [];
class userHelper {
    static newUser(id, username, room) {
        const user = {id, username, room};
        users.push(user);
        return user;
    }
    
    static getIndividualRoomUser(room) {
        return users.filter(user => user.room===room);
    }
    
    static exitRoom(id) {
        const index = users.findIndex(user => user.id ===id);
        if(index !==-1) {
            return users.slice(index,1)[0];
        }
    }
    static getActiveUser(id) {
        const user  = users.find(user => user.id === id);
        return users.find(user => user.id === id);
    }
}

module.exports = userHelper;