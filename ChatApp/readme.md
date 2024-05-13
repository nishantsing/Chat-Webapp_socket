# WebSocket
- Server(ws npm node package)
ws -> server = ws.Server({}) -> server.on("connection",socket=>{
    socket.on("message", message=>{
        Buffer.from
    })
}) 

- Client(WebSocket API browser)
socket -> new WebSocket('')-> socket.send() -> socket.addEventListener('message',(event)=>{
    event.data
})


- socket.io vs websocket
* automatic reconnection
* acknowledgments
* broadcasts to all or subsets of connection
* scale up to multiple instances of a server


# socket.io

- npm i socket.io


```js

import { createServer } from "http"
import {Server} from "socket.io"

const httpServer = createServer();

const io = new Server(httpServer, {
    cors:{
        // * everything is expected
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500"]
    }
})

io.on("connection",socket=>{
    // socket.id
    socket.on("message", data=>{
        io.emit(`message: ${data}`)
    })
}) 

httpServer.listen(3500, console.log('listening on port 3500'))


```

- client
cdnjs socket.io link in html file
const socket = io('ws://localhost:3000');

socket.emit('message', value)

to listen - socket.on('message',(data)=>{})

## Adding express

- To run the froented on the same server of express and avoid cors issue, so we dont need cors thing anymore as frontend as accessing backend from the same domain.

- creating static server

// using static middleware
app.use(express.static(path.join(__dirname, "public")))

__dirname is not available in modules(import) syntax, commonjs doesnt have this issue

so use 

import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

create a public directory inside server directory

as soon as we get request to '/' we redirect the request to public directory


NOTE: A express server can be static and rest at same time.


### Activity Detection

on input keypress event -> socket.emit('activity', socket.id.substring(0,5));

in server listen for the activity by the user
//Listen for activity
    socket.on("activity", (name) => {

        socket.broadcast.emit('activity', name)
    })


// listen(client) for activity from the server
socket.on("activity", name => {
    activity.textContent = `${name} is typing...`
    // Clear after 1 seconds
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 1000);
})

### Chat rooms



### changes

- more than 2 users in a single room
- UI improvements
- switching active rooms from dropdown
- database
- authentication



# ---------------------------------------------

- To use import js we have 3 ways, using .mjs extension, using 'type':'module' or using --input-type flag otherwise nodejs will use CommmonJS by default.

- to uninstall a dependency
* npm uninstall ws


# ---------------------------Socket.io basics------------




// Echo
- socket.emit('message', value) - only to user
- socket.broadcast.emit("message") - to all others
- socket.broadcast.emit("activity") - to all others
- io.emit - to everyone

//Listening
- io.on("connection",socket=>{}) - listening for a connection event
- socket.on("message", data=>{}) - listening for a message event

// Disconnect
socket.on('disconnect',()=>{
        socket.broadcast.emit("message", `User: ${socket.id.substring(0, 5)} disconnected`)
    })

