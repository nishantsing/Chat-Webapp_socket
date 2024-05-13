// import statements
// import { createServer } from "http"
import { Server } from "socket.io"
import express from 'express'
import path from 'path'
import { fileURLToPath } from "url"

// constants
const PORT = process.env.PORT || 3500;
const ADMIN = "Admin"

// alternate method for using __dirname when using es6 import syntax
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// const httpServer = createServer(); //instead of using http node module we will use express to create server

const app = express();

// using static middleware
app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, console.log(console.log(`listening on port ${PORT}`)))

// state for users
const UsersState = {
    users: [],
    setUsers: function (newUsersArray) {
        this.users = newUsersArray
    }
}

// If frontend app is hosted on same server we dont need the cors thing used below
const io = new Server(expressServer, {
    // cors: {
    //     // * everything is expected
    //     origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    // } 
})


io.on("connection", socket => {
    console.log(`User: ${socket.id} connected`);

    // Upon connection - only to user
    socket.emit("message", buildMsg(ADMIN, "Welcome to Chat App!"));

    socket.on('enterRoom', ({ name, room }) => {

        // leave previous room
        const prevRoom = getUser(socket.id)?.room

        if (prevRoom) {
            socket.leave(prevRoom);
            io.to(prevRoom).emit('message', buildMsg(ADMIN, `${name} has left the room`));
        }

        const user = activateUser(socket.id, name, room);

        // Cannot update previous room users list until after the state update in activate user
        if (prevRoom) {
            io.to(prevRoom).emit('userList', {
                users: getUsersInRoom(prevRoom)
            })
        }

        // join room
        socket.join(user.room)

        //To user who joined
        socket.emit('message', buildMsg(ADMIN, `You have joined the ${user.room} chat room`));

        //To everyone else
        socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`));

        // Update user list for room
        io.to(user.room).emit('userList', {
            users: getUsersInRoom(user.room)
        })

        //Update rooms list for everyone
        io.emit('roomsList', {
            rooms: getAllActiveRooms()
        })

    })

    //When user disconnects - to all others
    socket.on('disconnect', () => {

        const user = getUser(socket.id);
        userLeavesApp(socket.id)

        if (user) {
            io.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has left the room`))

            io.to(user.room).emit('userList', {
                users: getUsersInRoom(user.room)
            })

            io.emit('roomsList', {
                rooms: getAllActiveRooms()
            })
        }
        console.log(`User: ${socket.id} disonnected`);
    })

    // listening for message event
    socket.on("message", ({ name, text }) => {

        const room = getUser(socket.id)?.room

        if (room) {
            io.to(room).emit('message', buildMsg(name, text))
        }
    })

    //Listen for activity
    socket.on("activity", (name) => {
        console.log(name)
        const room = getUser(socket.id)?.room
        if (room) {
            console.log(room)
            socket.broadcast.to(room).emit('activity', name);
        }
    })


    // Upon connection - to all others
    // socket.broadcast.emit("message", `User: ${socket.id.substring(0, 5)} connected`)


})

function buildMsg(name, text) {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    }
}

function activateUser(id, name, room) {
    const user = { id, name, room }
    UsersState.setUsers([
        ...UsersState.users.filter(user => user.id !== id),
        user
    ])
    return user
}

function userLeavesApp(id) {
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !== id)
    )
}

function getUser(id) {
    return UsersState.users.find(user => user.id === id)
}

function getUsersInRoom(room) {
    return UsersState.users.filter(user => user.room === room)
}

function getAllActiveRooms() {
    return Array.from(new Set(UsersState.users.map(user => user.room)))
}

// user functions




// httpServer.listen(3500, console.log('listening on port 3500'))







// ----------------using ws npm -----------------
/* const ws = require('ws');

const server = new ws.Server({ port: '3000' }); // initializing server using ws


server.on('connection', socket => { // establishing connection
    socket.on('message', message => { // once connection is established checking for message
        const b = Buffer.from(message); // extracting buffer message
        console.log(b.toString()); // changing it to string
        socket.send(`${message}`);
    })
})
*/
// --------------------------------------------