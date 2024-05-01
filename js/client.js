const socket = io('http://localhost:8000');


const form = document.getElementById('send-container');
const messageInput = document.getElementById('send-details');
const messageContainer =document.querySelector('.container');
var audio = new Audio('ting.mp3');

// a function to append new element to container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

//when form is submitted append the element containing msg 
// also emit send event 
form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const m = messageInput.value;
    append(`You : ${m}`, 'right');
    socket.emit('send', m);
    messageInput.value = "";
})

//prompt to take new user name and then emit new user joined event
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

//recieve event from server to tell others new user joined
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'left');
});

//server sends a msg receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
});

//if a user leaves, append info to container
socket.on('left', name =>{
    append(`${data.name} left the chat`, 'left');
})