async function sendMessage(event) {
    event.preventDefault();
    const message = document.getElementById('message').value;

    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    try{
        const response = await axios.post('http://localhost:3000/chat/message', {message:message}, { headers });

        getMessages();
    }catch(err){
        console.error('Error Sending Chat:', err);
    }

}


async function getMessages(){
    
try{
    const response = await axios.get('http://localhost:3000/chat/get-msg');
    const messages = response.data.data;

    const messagesContainer = document.querySelector('.messages');
    messagesContainer.innerHTML = ''; // Clear existing messages

    messages.forEach(message => {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');

      const paragraphElement = document.createElement('p');
      paragraphElement.textContent = `${message.username}: ${message.message}`;

      messageElement.appendChild(paragraphElement);
      messagesContainer.appendChild(messageElement);
    });
}catch(err) {
    console.error("somthing went wrong", err);
}
    
}

window.addEventListener("DOMContentLoaded", getMessages());