
/*
// browser sending and receving data from this ws location
const socket = new WebSocket('ws://localhost:3000') // initializing and connecting to the server
*/

//  using socket.io
const socket = io('ws://localhost:3500');

const activity = document.querySelector('.activity');
const msgInput = document.querySelector('input');
console.log(msgInput)


function sendMessage(e) {
    // submit form without reloading page
    e.preventDefault()

    // Getting the value and sending it
    if (msgInput.value) {
        //socket.send(msgInput.value) // sending the message to server when using browser api
        socket.emit('message', msgInput.value);//using socket.io
        msgInput.value = ""
    }
    msgInput.focus()
}

document.querySelector('form')
    .addEventListener('submit', sendMessage)


//Listen for messages
socket.on("message", data => {
    activity.textContent = ""
    const li = document.createElement('li')
    li.textContent = data
    document.querySelector('ul').appendChild(li)
})

// sending activity
msgInput.addEventListener('keypress', () => {
    console.log("keypress")
    socket.emit('activity', socket.id.substring(0, 5));
})


//Listen for activity
socket.on("activity", name => {
    activity.textContent = `${name} is typing...`
})
/*
// Listen for messages event object event.data is destructured to get data
socket.addEventListener("message", ({ data }) => { // listening to message from server
    const li = document.createElement('li')
    li.textContent = data
    document.querySelector('ul').appendChild(li)
})

*/