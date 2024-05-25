let socket = io()
const form = document.querySelector('#chat-form')
const input = document.querySelector('#chat-input')
const messages = document.querySelector('.messages')
const username = document.querySelector('#chat-username')
const roomSelect = document.querySelector('#chat-rooms')
let currentRoom = "" // current room of user

// Disable chat input and send button on initial load
input.disabled = true
form.querySelector('button').disabled = true

roomSelect.addEventListener('change', function() {
  if (this.value) {
    // if room is not null
    username.disabled = false
    input.disabled = false
    form.querySelector('button').disabled = false
    if (currentRoom != '') {
      socket.emit('leave room', {
        room: currentRoom,
        user: username.value
      })
    }
    currentRoom = this.value
    socket.emit('join room', {
      room: this.value,
      user: username.value
    })
    messages.innerHTML = ''
  } else {
    username.disabled = true
    input.disabled = true
    form.querySelector('button').disabled = true
    if (currentRoom) {
      socket.emit('leave room', {
        room: currentRoom,
        user: username.value
      })
      currentRoom = ''
      messages.innerHTML = ''
    }
  }
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  if (input.value) {
    socket.emit('chat message', {
      username: username.value,
      message: input.value,
      room: currentRoom
    }) // send message to server
    input.value = ''
  }
})

socket.on('chat message', (data) => {
  // listening to data from server
  // create li with message from server
  if (data.room === currentRoom) {
    const newMsg = document.createElement('li')
    newMsg.textContent = `${data.username}: ${data.message}`
    messages.appendChild(newMsg)
  }
})