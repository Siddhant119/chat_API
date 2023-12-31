const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});

const socket = io();

socket.emit('joinRoom', {username, room});

socket.on('message', message => {
    outputMessage(message);
});

socket.on('roomUsers',({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

chatForm.addEventListener('submit', event => {
    event.preventDefault();
    let msg = event.target.elements.msg.value;
    msg = msg.trim();
    socket.emit('chatMessage', msg);
    event.target.elements.msg.value = '';
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}
  
  // Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}
  
  // Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the room');
    if(leaveRoom) {
        window.location = '../index.html';
    }
});