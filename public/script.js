var socket = io();

const chatContainer = document.getElementById('chat-container')
const msgForm = document.getElementById('send-container')
const msgInput = document.getElementById('chat-input')
const userList = document.getElementById('users');

const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('username')

socket.emit('new-user', name)

socket.on('chat-message',data =>{
    appendMessage(data.name+': '+data.message);
    
})

socket.on('show-latest-message', data =>{
    
    console.log(data);
    if(data.length){
        for(var x = 0;x < data.length;x++){
            appendMessage(data[x].username + ': ' + data[x].chat)
        }
    }
    appendMessage('You Joined!')
});

socket.on('user-connected', user =>{
    appendMessage(user.username + ' connected')
})

socket.on('update-user-online', users =>{
    appendUsers(users)
})

socket.on('user-disconnect', name =>{
    appendMessage(name + ' disconnected')
})

msgForm.addEventListener('submit', e => {
    e.preventDefault()
    const msg = msgInput.value
    appendMessage('You: '+msg)
    socket.emit('send-chat-message', msg)
    msgInput.value = ''
})

function appendMessage(msg){
    const msgElement =document.createElement('div')
    msgElement.innerHTML = `<p id="text">${msg}</p>`;
    document.querySelector('#chat-container').appendChild(msgElement)
    chatContainer.scrollTop=chatContainer.scrollHeight;
}

function appendUsers(users) {
    userList.innerHTML = `
      ${users.map(user => `<li>• ${user.username}</li>`).join('')}
    `;
  }