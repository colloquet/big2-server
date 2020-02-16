require('dotenv').config();
const express = require('express');
const uuid = require('uuid');
const _ = require('lodash');
const fs = require('fs');
const ReCAPTCHA = require('recaptcha2');
const { Big2Engine } = require('big2-util');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Room = require('./models/Room');

const recaptcha = new ReCAPTCHA({
  siteKey: process.env.RECAPTCHA_SITE_KEY,
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
});

app.get('/', (req, res) => res.redirect('https://dee.colloque.io'));

let PORT;
if (process.env.NODE_ENV === 'production') {
  PORT = 3000;
} else {
  PORT = 8080;
}

const rooms = {};

function getAvailableRoom(side, mode) {
  const availableRoomKey = _.findKey(rooms, room => room.isAvailable(side, mode));

  if (availableRoomKey) {
    return rooms[availableRoomKey];
  }

  return null;
}

function getRoomBySocketId(socketId) {
  const roomKey = _.findKey(rooms, room => room.hasMember(socketId));

  if (roomKey) {
    return rooms[roomKey];
  }

  return null;
}

function cleanUp() {
  Object.keys(rooms).forEach(id => {
    const room = rooms[id];
    if (!Object.keys(room.members).length) {
      delete rooms[id];
    }
  });
}

function joinRoom(room, side, name, socket) {
  room.join(socket.id, side, name);
  socket.to(room.id).emit('player_joined', socket.id);
  return room.id;
}

function createRoom(side, name, mode, socket) {
  const id = uuid.v4();
  rooms[id] = new Room(
    id,
    {
      id: socket.id,
      name,
      side,
    },
    mode,
  );
  return id;
}

function leaveRoom(socket) {
  const room = getRoomBySocketId(socket.id);

  if (room) {
    room.leave(socket.id);
    socket.to(room.id).emit('player_left');
    socket.leave(room.id);
    cleanUp(room);
  }
}

function startGame(room) {
  io.in(room.id).emit('game_start', room.meta);
}

function recordResult(side, mode) {
  fs.appendFile(`result-${mode}.txt`, `${side}\n`, err => {
    if (err) {
      console.log('error writing result', err);
    }
  });
}

function getFileData(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
}

async function getModeStatistics(mode) {
  try {
    const data = await getFileData(`result-${mode}.txt`);
    const aCount = (data.match(/A/g) || []).length;
    const bCount = (data.match(/B/g) || []).length;
    const total = aCount + bCount;

    return {
      A: ((aCount / total) * 100).toFixed(2),
      B: ((bCount / total) * 100).toFixed(2),
    };
  } catch (err) {
    console.log('error getting file data', err);
    throw err;
  }
}

async function getStatistics() {
  try {
    const [mode1Stats, mode2Stats] = await Promise.all([getModeStatistics(1), getModeStatistics(2)]);
    return {
      1: mode1Stats,
      2: mode2Stats,
    };
  } catch (err) {
    console.log('error getting stats', err);
    return null;
  }
}

if (process.env.NODE_ENV === 'production') {
  io.set('origins', 'https://dee.colloque.io:*');
}

io.on('connection', socket => {
  socket.on('choose_side', async ({ side, name, captchaResponse, mode = 1 }, callback) => {
    try {
      await recaptcha.validate(captchaResponse);
      const alreadyInRoom = getRoomBySocketId(socket.id);
      if (alreadyInRoom) {
        leaveRoom(socket);
      }

      // find room with opposite side
      let roomId;
      const availableRoom = getAvailableRoom(side, mode);

      if (availableRoom) {
        roomId = joinRoom(availableRoom, side, name, socket);
      } else {
        roomId = createRoom(side, name, mode, socket);
      }

      socket.join(roomId);
      callback(null, roomId);

      const joinedRoom = rooms[roomId];
      if (joinedRoom.members.A && joinedRoom.members.B) {
        startGame(joinedRoom);
      }
    } catch (err) {
      callback({ message: '系統繁忙，請 F5 重試' }, null);
      socket.emit('game_error', '系統繁忙，請 F5 重試');
    }
  });

  socket.on('play_cards', (cards, callback) => {
    const room = getRoomBySocketId(socket.id);
    if (room) {
      const isValidCombination = Big2Engine.validateCombination(cards);
      if (!isValidCombination) {
        socket.emit('game_error', '錯誤組合！');
        return;
      }

      const isLegalMove = Big2Engine.validateMove(room.meta.lastPlayedCards, cards);
      if (!isLegalMove) {
        socket.emit('game_error', '錯誤舉動！');
        return;
      }

      const prevTurn = room.meta.turn;
      room.play(prevTurn, cards);
      io.in(room.id).emit('game_update', room.meta);
      callback();

      if (!room.meta.cards[prevTurn].length) {
        io.in(room.id).emit('game_finish', {
          playerId: socket.id,
          side: prevTurn,
        });
        recordResult(prevTurn, room.mode);
      }
    }
  });

  socket.on('rush_player', () => {
    const room = getRoomBySocketId(socket.id);
    if (room) {
      io.in(room.id).emit('rush_player');
    }
  });

  socket.on('leave_room', callback => {
    leaveRoom(socket);
    callback();
  });

  socket.on('disconnect', () => {
    leaveRoom(socket);
  });
});

setInterval(async () => {
  cleanUp();
  io.local.emit('client_count', io.engine.clientsCount);
  const stats = await getStatistics();
  io.local.emit('win_rate', stats);
}, 5000);

server.listen(PORT, () => console.log(`big2-server listening on port ${PORT}!`));
