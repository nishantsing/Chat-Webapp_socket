
/*
// browser sending and receving data from this ws location
const socket = new WebSocket('ws://localhost:3000') // initializing and connecting to the server
*/

//  using socket.io
const socket = io('ws://localhost:3500');

// selecting DOM elements
const msgInput = document.querySelector('#message');
const nameInput = document.querySelector('#name');
const chatRoom = document.querySelector('#room');

const activity = document.querySelector('.activity');
const usersList = document.querySelector('.user-list');
const roomList = document.querySelector('.room-list');
const chatDisplay = document.querySelector('.chat-display');

// console.log(msgInput)


// Sending message fn (emit message event to server)
function sendMessage(e) {
    // submit form without reloading page
    e.preventDefault()

    // Getting the value and sending it
    if (msgInput.value && nameInput.value && chatRoom.value) {
        //socket.send(msgInput.value) // sending the message to server when using browser api
        socket.emit('message', {
            name: nameInput.value,
            text: msgInput.value
        });//using socket.io
        msgInput.value = ""
    }
    msgInput.focus()
}

// Enter room function (emit enter room event to server)
function enterRoom(e) {
    e.preventDefault();
    if (nameInput.value && chatRoom.value) {
        socket.emit('enterRoom', {
            name: nameInput.value,
            room: chatRoom.value
        })
    }
}

// Event Listener's on form submit
document.querySelector('.form-msg')
    .addEventListener('submit', sendMessage);
document.querySelector('.form-join')
    .addEventListener('submit', enterRoom);

// sending activity listener on keypress
msgInput.addEventListener('keypress', () => {
    console.log("keypress")
    // socket.emit('activity', socket.id.substring(0, 5));
    socket.emit('activity', nameInput.value);
})


//Listen for messages (socket listener for incoming messages from server)
socket.on("message", data => {
    activity.textContent = ""
    const { name, text, time } = data
    const message = document.createElement('li')
    message.className = 'post'
    if (name === nameInput.value) message.className = 'post post--left'
    if (name !== nameInput.value && name !== 'Admin') message.className = 'post post--right'
    if (name !== 'Admin') {
        message.innerHTML = `<div class="post__header ${name === nameInput.value ? 'post__header--user' : 'post__header--reply'}">
        <span class="post__header--name">${name}</span>
        <span class="post__header--time">${time}</span>
        </div>
        <div class="post__text">${text}</div>`
    } else {
        message.innerHTML = `<div class="post__text">${text}</div>`
    }
    document.querySelector('.chat-display').appendChild(message);

    chatDisplay.scrollTop = chatDisplay.scrollHeight
})



let activityTimer
//Listen for activity (socket listener for incoming activity from server)
socket.on("activity", name => {
    activity.textContent = `${name} is typing...`
    // Clear after 1 seconds
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 3000);
});

socket.on('userList', ({ users }) => {
    showUsers(users)
})

socket.on('roomList', ({ rooms }) => {
    showRooms(rooms)
})

function showUsers(users) {
    usersList.textContent = ''
    if (users) {
        usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`
        users.forEach((user, i) => {
            usersList.textContent += ` ${user.name}`
            if (users.length > 1 && i !== users.length - 1) {
                usersList.textContent += ","
            }
        })
    }
}

function showRooms(rooms) {
    roomList.textContent = ''
    if (rooms) {
        roomList.innerHTML = '<em>Active Rooms:</em>'
        rooms.forEach((room, i) => {
            roomList.textContent += ` ${room}`
            if (rooms.length > 1 && i !== rooms.length - 1) {
                roomList.textContent += ","
            }
        })
    }
}

/*
// Listen for messages event object event.data is destructured to get data
socket.addEventListener("message", ({ data }) => { // listening to message from server
    const li = document.createElement('li')
    li.textContent = data
    document.querySelector('ul').appendChild(li)
})

*/