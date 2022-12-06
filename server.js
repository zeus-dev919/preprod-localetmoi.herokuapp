var sslRedirect = require('heroku-ssl-redirect');
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var app = express();
var bodyParser = require('body-parser');
const { usersRegistry } = require('./backend/helpers/websocketServer.helper');

require('custom-env').env(process.env.NODE_ENV || 'development');

app.use(sslRedirect(['production'], 301));
app.use(serveStatic(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", process.env.LOCALETMOI_BASE_URL.replace(/\/$/, '') || 'localhost');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

require('./backend/routes')(app);

const port = process.env.PORT || 5000;

const server = app.listen(port);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: process.env.LOCALETMOI_BASE_URL.replace(/\/$/, '') || 'localhost',
    }
});

io.on('connection', socket => {
    socket.on('connectToPf', async ({ customerCode, identity, requestSocket = null, id = null}) => {
        if (!customerCode || !identity) {
            return;
        }
        const roomName = `partner-folder-${customerCode}`;
        if (!socket.rooms.has(roomName)) {
            socket.join(roomName);
        }
        let userId = identity.id;
        usersRegistry.addUser(customerCode, userId, socket.id, identity.name);
        if (requestSocket) {
            usersRegistry.changeUserPosition(customerCode, id, requestSocket);
            io.to(roomName).emit('connectedUsers', usersRegistry.getUsers(customerCode), requestSocket);
        } else {
            io.to(roomName).emit('connectedUsers', usersRegistry.getUsers(customerCode));
        }
    });

    socket.on('disconnectFromPf', ({customerCode, identityId}) => {
        const roomName = `partner-folder-${customerCode}`;
        usersRegistry.removeUser(customerCode, identityId , socket.id);
        socket.leave(roomName);
        if (!usersRegistry.hasUser(customerCode, identityId)){
            io.to(roomName).emit('connectedUsers', usersRegistry.getUsers(customerCode));
        }
    });

    socket.on('access', ({ customerCode, userName, socketId, id}) => {
        io.to(`partner-folder-${customerCode}`).emit('access', { userName, socketId, id });
    });

    socket.on('access-refused', ({ customerCode, requestSocket }) => {
        const roomName = `partner-folder-${customerCode}`;
        io.to(roomName).emit('access-refused', usersRegistry.getUsers(customerCode), requestSocket);
    })

    socket.on('wait-30-sec', ({ customerCode, requestSocket }) => {
        const roomName = `partner-folder-${customerCode}`;
        const wait = true;
        io.to(roomName).emit('connectedUsers', usersRegistry.getUsers(customerCode), requestSocket, wait);
    })

    socket.on("disconnect", () => {
        const arrayUserRegistry = usersRegistry.getAllUsersRegistry()
        let customerCode = null;
        let userId = null;
        let socketIdDisconnected = socket.id;
        if (socketIdDisconnected) {
            for (const sageCode in arrayUserRegistry) {
                arrayUserRegistry[sageCode].forEach(user => {
                    if (user.socketId === socket.id) {
                        customerCode = sageCode;
                        userId = user.userId;
                    }
                });
            }
        }

        const roomName = `partner-folder-${customerCode}`;
        usersRegistry.removeUser(customerCode, userId, socketIdDisconnected);
        io.to(roomName).emit('connectedUsers', usersRegistry.getUsers(customerCode), null, null, socketIdDisconnected);
    });
});

console.log('API server started on: ' + port);
