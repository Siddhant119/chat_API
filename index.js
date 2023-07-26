const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const userHelper = require('./helper/userHelper');
const formatMessage = require('./helper/formatDate');

const app =express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userHelper.newUser(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message',formatMessage("Airtribe","Messages are limited to this room!" ));

        socket.broadcast.to(user.room).emit('message',formatMessage("Airtribe", `${user.username} has joined the room`));

        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : userHelper.getIndividualRoomUser(user.room)
        });
    });

    socket.on('chatMessage', msg => {
        const user = userHelper.getActiveUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });

    socket.on('disconnect', () => {
        const user = userHelper.exitRoom(socket.id);
        if(user) {
            io.to(user.room).emit('message',formatMessage('Airtribe',`${user.username} has left the room`));    
            io.to(user.room).emit('roomUsers',{
                room : user.room,
                users : userHelper.getIndividualRoomUser(user.room)
            }); 
        }
        
    });
});


const PORT = process.env.PORT || 3000 ;

server.listen(PORT , () => {
    console.log(`Server is running on Port ${PORT}`);
});
