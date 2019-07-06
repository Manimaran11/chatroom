var socketio = require('socket.io');
var io, guestNumber = 1, nickNames = currentRoom = {}, namesUsed = [];
exports.listen = (server) => {
    io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, 'Lobby');
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);
        socket.on('rooms', function () {
            socket.emit('rooms', io.sockets.manager.rooms);
        });
        handleClientDisconnection(socket, nickNames, namesUsed);
    });
};

function assignGuestName(socket,guestNumber,nickNames,namesUsed){
    var name='Guest'+guestNumber;
    nickNames[socket.id]=name;
    socket.emit('nameResult',{
        success:true,
        name:name
    });
    namesUsed.push(name);
    return guestNumber+1;
}



