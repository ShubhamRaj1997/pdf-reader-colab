const { instrument} = require("@socket.io/admin-ui")

const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080', 'http://admin.socket.io'],
    },
});

const userIo = io.of('/user');



userIo.on('connection', socket => {
    console.log("connected to user namespace with username " + socket.username);
});

userIo.use((socket, next) => {
    if(socket.handshake.auth.token){
        socket.username = getUsernameFromToken(socket.handshake.auth.token)
        next()
    }
    else{
        next(new Error('Please send token'))
    }
});

function getUsernameFromToken(token){
    return token;
}


io.on('connection', socket=>{
    console.log(socket.id);
    socket.on('set-page', (message, room)=>{
        console.log(message);
        if(room ===''){
            console.log("Sending get-page empty", message);

            socket.broadcast.emit('get-page', message);
        }
        else{
            console.log("Sending get-page method", message);
            socket.to(room).emit('get-page', message);
        }
    })
    socket.on('join-room', (room, cb) => {
        console.log('joined room', room);
        socket.join(room);
        cb(`Joined ${room}`)
    });
    
});

instrument(io, {auth: false})