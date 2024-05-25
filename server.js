const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

// Middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

io.on('connection', (socket) => {
  console.log(`New user connected`)

  socket.on('disconnect', () => {
    console.log(`User disconnected`)
  })

  socket.on('chat message', (data) => {
    // input message from input form goes here
    io.emit('chat message', data) // sending data to all who are connected
  })

  // When user joins room
  socket.on('join room', (data) => {
    socket.join(data.room)
    console.log(`${data.user} joined the room ${data.room}`)
    io.to(data.room).emit('chat message', {
      message: `${data.user} joined the room`,
      username: 'System',
      room: data.room
    })
  })

  // When user leaves room
  socket.on('leave room', (data) => {
    socket.leave(data.room)
    console.log(`User has left ${data.room}`)
    io.to(data.room).emit('chat message', {
      message: `${data.user} has left the room`,
      username: 'System',
      room: data.room
    })
  })
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})