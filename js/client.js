// Connect to the Socket.io server
const socket = io('http://localhost:5500');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('ting.mp3');

// Function to append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    // Play sound for incoming messages from other users
    if (position === 'left') {
        audio.play();
    }
};

// Event listener for form submission (sending messages)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Prompt user for their name when joining the chat
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// Event listener for new user joined
socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'right');
});

// Event listener for receiving messages
socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

// Event listener for user leaving the chat
socket.on('leave', (name) => {
    append(`${name} left the chat`, 'right');
});
