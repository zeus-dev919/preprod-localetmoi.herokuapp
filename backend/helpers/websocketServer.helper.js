module.exports = {
    usersRegistry: {
        users: {},
        addUser (customerCode, userId, socketId, username) {
            if (undefined === this.users[customerCode]) {
                this.users[customerCode] = [];
            }
            if (!this.hasUser(customerCode, socketId)) {
                this.users[customerCode].push({
                    userId: userId,
                    socketId: socketId,
                    username: username
                });
            }
        },
        findUserIndex (customerCode, socketId) {
            if (!this.users[customerCode]) {
                return -1;
            }
            return this.users[customerCode].map(user => user.socketId).indexOf(socketId);
        },

        hasUser (customerCode, socketId) {
            return this.users[customerCode] &&
                this.users[customerCode].map(user => user.socketId).includes(socketId);
        },
        getUser (customerCode, socketId) {
            const userIndex = this.findUserIndex(customerCode, socketId);
            return this.users[customerCode] &&
                this.users[customerCode][userIndex];
        },
        removeUser (customerCode, userId, socketId) {
            const userIndex = this.findUserIndex(customerCode, socketId);
            if (this.hasUser(customerCode, socketId)) {
                this.users[customerCode].splice(userIndex, 1);
            }
            return this.users[customerCode];
        },

        getUsers (customerCode) {
            return customerCode ? this.users[customerCode] || [] : this.users;
        },
        getAllUsersRegistry() {
            return this.users;
        },
        changeUserPosition (customerCode, userId, socketId) {
            const userIndex = this.findUserIndex(customerCode, socketId);
            const user = this.users[customerCode][userIndex];
            const switchPosition = 1;
            this.users[customerCode] = this.removeUser(customerCode, userId, socketId, switchPosition);
            this.users[customerCode].unshift(user);
            return this.users[customerCode];
        }
    }
};
