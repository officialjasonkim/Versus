let socket;

let playing = false;
let board = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0]
];

// let playerOne;
// let playerTwo;
// let roomCode;
// let p1 = true;
// let p2 = true;
// let rc = true;

function setup() {
  createCanvas(700, 600);
  background(50, 50, 200);
  socket = io.connect();
  socket.on('column', newInput);
  socket.on('noRoom', noRoom);
  socket.on('roomFull', roomFull);
  socket.on('validRoom', validRoom);
  socket.on('disconnected', disconnected);
  // socket.on('setGameInfo', setGameInfo);
  socket.on('creatorInfo', creatorInfo);
  socket.on('restart', restart);
  socket.on('playerJoined', playerJoined);
  restart = createButton('Restart');
  restart.mousePressed(reset);
  restart.style('display', 'none');
  restart.style('padding', '.5rem');
}

function draw() {
  // if (
  //   roomCode == undefined ||
  //   playerOne == undefined ||
  //   playerTwo == undefined
  // ) {
  //   // console.log('searching');
  //   socket.emit('getGameInfo', { id: socket.id });
  // }
  background(50, 50, 200);
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        fill(51);
        ellipse(50 + i * 100, 600 - (50 + j * 100), 75, 75);
      } else if (board[i][j] === 1) {
        fill(200, 150, 0);
        ellipse(50 + i * 100, 600 - (50 + j * 100), 75, 75);
      } else if (board[i][j] === -1) {
        fill(200, 50, 50);
        ellipse(50 + i * 100, 600 - (50 + j * 100), 75, 75);
      }
    }
  }
  fill(150, 150, 150, 150);
  if (
    mouseX >= 0 &&
    mouseX <= 700 &&
    mouseY >= 0 &&
    mouseY <= 600 &&
    playing == true
  ) {
    if (mouseX < 100) {
      rect(0, 0, 100, 600);
    } else if (mouseX < 200) {
      rect(100, 0, 100, 600);
    } else if (mouseX < 300) {
      rect(200, 0, 100, 600);
    } else if (mouseX < 400) {
      rect(300, 0, 100, 600);
    } else if (mouseX < 500) {
      rect(400, 0, 100, 600);
    } else if (mouseX < 600) {
      rect(500, 0, 100, 600);
    } else if (mouseX < 700) {
      rect(600, 0, 100, 600);
    }
  }
  checkWin();
  checkLost();
}

function mouseClicked() {
  if (mouseX >= 0 && mouseX <= 700 && mouseY >= 0 && mouseY <= 600 && playing) {
    if (mouseX < 100) {
      if (board[0].indexOf(0) != -1) {
        board[0][board[0].indexOf(0)] = 1;
        playing = false;
        socket.emit('column', { col: 0 });
      }
    } else if (mouseX < 200) {
      if (board[1].indexOf(0) != -1) {
        board[1][board[1].indexOf(0)] = 1;
        playing = false;
        socket.emit('column', { col: 1 });
      }
    } else if (mouseX < 300) {
      if (board[2].indexOf(0) != -1) {
        board[2][board[2].indexOf(0)] = 1;
        playing = false;
        socket.emit('column', { col: 2 });
      }
    } else if (mouseX < 400) {
      if (board[3].indexOf(0) != -1) {
        board[3][board[3].indexOf(0)] = 1;
        playing = false;
        socket.emit('column', { col: 3 });
      }
    } else if (mouseX < 500) {
      if (board[4].indexOf(0) != -1) {
        board[4][board[4].indexOf(0)] = 1;
        playing = false;
        socket.emit('column', { col: 4 });
      }
    } else if (mouseX < 600) {
      if (board[5].indexOf(0) != -1) {
        board[5][board[5].indexOf(0)] = 1;
        playing = false;
        socket.emit('column', { col: 5 });
      }
    } else if (mouseX < 700) {
      if (board[6].indexOf(0) != -1) {
        board[6][board[6].indexOf(0)] = 1;
        playing = false;
        socket.emit('column', { col: 6 });
      }
    }
  }
}

function reset() {
  if (document.getElementById('p2').innerHTML != '. . .') {
    playing = true;
    board = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ];
    socket.emit('restart');
  }
}

function checkWin() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 6; j++) {
      if (
        board[i][j] + board[i + 1][j] + board[i + 2][j] + board[i + 3][j] ==
        4
      ) {
        // console.log('You Won!');
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        rect(200, 250, 300, 100);
        fill(0);
        text('You Won!', 350, 300);
        playing = false;
        return;
      }
    }
  }
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        board[i][j] + board[i][j + 1] + board[i][j + 2] + board[i][j + 3] ==
        4
      ) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        rect(200, 250, 300, 100);
        fill(0);
        text('You Won!', 350, 300);
        playing = false;
        return;
      }
    }
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        board[i][j] +
          board[i + 1][j + 1] +
          board[i + 2][j + 2] +
          board[i + 3][j + 3] ==
        4
      ) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        rect(200, 250, 300, 100);
        fill(0);
        text('You Won!', 350, 300);
        playing = false;
        return;
      }
    }
  }
  for (let i = 3; i < 7; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        board[i][j] +
          board[i - 1][j + 1] +
          board[i - 2][j + 2] +
          board[i - 3][j + 3] ==
        4
      ) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        rect(200, 250, 300, 100);
        fill(0);
        text('You Won!', 350, 300);
        playing = false;
        return;
      }
    }
  }
}

function checkLost() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 6; j++) {
      if (
        board[i][j] + board[i + 1][j] + board[i + 2][j] + board[i + 3][j] ==
        -4
      ) {
        // console.log('You Lost!');
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        rect(200, 250, 300, 100);
        fill(0);
        text('You Lost!', 350, 300);
        playing = false;
        return;
      }
    }
  }
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        board[i][j] + board[i][j + 1] + board[i][j + 2] + board[i][j + 3] ==
        -4
      ) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        rect(200, 250, 300, 100);
        fill(0);
        text('You Lost!', 350, 300);
        playing = false;
        return;
      }
    }
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        board[i][j] +
          board[i + 1][j + 1] +
          board[i + 2][j + 2] +
          board[i + 3][j + 3] ==
        -4
      ) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        rect(200, 250, 300, 100);
        fill(0);
        text('You Lost!', 350, 300);
        playing = false;
        return;
      }
    }
  }
  for (let i = 3; i < 7; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        board[i][j] +
          board[i - 1][j + 1] +
          board[i - 2][j + 2] +
          board[i - 3][j + 3] ==
        -4
      ) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        rect(200, 250, 300, 100);
        fill(0);
        text('You Lost!', 350, 300);
        playing = false;
        return;
      }
    }
  }
}

// GETTING GAME INFO
// function setGameInfo(data) {
//   playerOne = data.one;
//   playerTwo = data.two;
//   roomCode = data.room;
//   if (playerOne != undefined && p1) {
//     document.getElementById('p1').innerHTML = playerOne;
//     p1 = false;
//   }
//   if (playerTwo != undefined && p2) {
//     document.getElementById('p2').innerHTML = playerTwo;
//     p2 = false;
//   }
//   if (roomCode != undefined && rc) {
//     document.getElementById('rc').innerHTML = roomCode;
//     rc = false;
//   }
// }

function creatorInfo(data) {
  document.getElementById('rc').innerHTML = data.room;
}

// GETTING THE OTHER PLAYER'S DATA
function newInput(data) {
  board[data.col][board[data.col].indexOf(0)] = -1;
  playing = true;
}

function restart() {
  playing = true;
  board = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ];
}

// DOM MANIPULATION
function showAddUser() {
  document.getElementById('addUser').style.display = 'flex';
  document.getElementById('createRoom').style.display = 'none';
}

function showCreateRoom() {
  document.getElementById('addUser').style.display = 'none';
  document.getElementById('createRoom').style.display = 'flex';
}

function noRoom() {
  document.getElementById('addUser').style.display = 'flex';
  document.getElementById('alerts').innerHTML = "Room doesn't exist.";
}

function roomFull() {
  document.getElementById('addUser').style.display = 'flex';
  document.getElementById('alerts').innerHTML = 'Room is full.';
}

function addUser() {
  // console.log(document.getElementById('room').value);
  // console.log(document.getElementById('name').value);
  data = {
    room: document.getElementById('room').value,
    name: document.getElementById('name').value
  };
  document.getElementById('p2').innerHTML = data.name;
  document.getElementById('rc').innerHTML = data.room;
  document.getElementById('alerts').innerHTML = 'Checking...';
  socket.emit('addUser', data);
}

function validRoom(data) {
  document.getElementById('login').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  document.getElementById('defaultCanvas0').style.display = 'flex';
  restart.style('display', 'flex');
  playing = true;
  document.getElementById('p1').innerHTML = data.name;
}

function playerJoined(data) {
  document.getElementById('login').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  document.getElementById('defaultCanvas0').style.display = 'flex';
  restart.style('display', 'flex');
  playing = true;
  document.getElementById('p2').innerHTML = data.name;
}

function createRoom() {
  // console.log(document.getElementById('creatorName').value);
  document.getElementById('login').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  document.getElementById('defaultCanvas0').style.display = 'flex';
  restart.style('display', 'flex');
  data = {
    name: document.getElementById('creatorName').value
  };
  document.getElementById('p1').innerHTML = data.name;
  socket.emit('createRoom', data);
}

function disconnected() {
  document.getElementById('p1').innerHTML = '. . .';
  document.getElementById('p2').innerHTML = '. . .';
  document.getElementById('rc').innerHTML = '. . .';
  // playerOne = undefined;
  // playerTwo = undefined;
  // roomCode = undefined;
  // p1 = true;
  // p2 = true;
  // rc = true;
  playing = false;
  board = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ];
  document.getElementById('login').style.display = 'flex';
  document.getElementById('game').style.display = 'none';
  document.getElementById('defaultCanvas0').style.display = 'none';
  restart.style('display', 'none');
  document.getElementById('alerts').innerHTML =
    'The opponent has disconnected.';
}
