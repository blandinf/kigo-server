
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 8080;

let players = []
let deadPlayers = []

io.on('connection', (socket) => {
  console.log('a user is connected');

  socket.on('playerConnect', (msg) => {
    playerConnect(msg)
  })

  socket.on('playerDisconnect', (msg) => {
    playerDisconnect(msg)
  })

  socket.on('playerIsDead', (msg) => {
    playerIsDead(msg)
  })

  socket.on('catchBonus', (msg) => {
      catchBonus(msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


http.listen(PORT, () => {
  console.log('listening on ' + PORT);
});

function playerConnect (msg) {
    let player = JSON.parse(msg.player)    

    if (players.length < 2) {
        players.push(player)
        console.log("playersAfterConnection", players)
    } 
    
    if (players.length == 2) {
        io.emit("GameIsReady")
    }
}

function playerDisconnect (msg) {
  let player = JSON.parse(msg.player)  
  if (players.length === 2) {
    players = []
    deadPlayers = []
    players.push(player)
  } else if (players.length === 1) {
    players.push(player)
  }
}

function playerIsDead (msg) {
    let player = JSON.parse(msg.player)
    deadPlayers.push(player)
    console.log('deadPlayers', deadPlayers)
    if (deadPlayers.length == 2) {
      console.log("winnerIs call")
      io.emit("winnerIs", deadPlayers[1].id)
      deadPlayers = []
    }
}

function catchBonus (msg) {
    let player = JSON.parse(msg.player)
    let bonusType = msg.bonus
    let bonus = {
        playerIdToInflige: player.id,
        type: bonusType
    }
    io.emit("infligeBonus", JSON.stringify(bonus))
}