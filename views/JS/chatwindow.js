async function sendMessage(event) {
    event.preventDefault();
    const message = document.getElementById('message').value;

    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post('http://localhost:3000/chat/message', { message: message }, { headers });

        document.getElementById('message').value = "";
        await saveToLocalStorage();
        getMessages();
    } catch (err) {
        console.error('Error Sending Chat:', err);
    }

}
async function saveToLocalStorage() {
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    if (storedMessages.length > 10) {
        storedMessages.shift(); // Remove the oldest chat message
    }
    const latestTimestamp = storedMessages.length > 0 ? storedMessages[storedMessages.length - 1].createdAt : '2023-05-27 17:05:31';

    // Send the latest timestamp to the backend when fetching new messages
    const response = await axios.get(`http://localhost:3000/chat/get-msg?timestamp=${latestTimestamp}`);
    const newMessages = response.data.data;


    // Update local storage with new messages
    const updatedMessages = [...storedMessages, ...newMessages];
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
}


async function getMessages() {

    try {
        const storedMessages = JSON.parse(localStorage.getItem('messages'));


        const messagesContainer = document.querySelector('.messages');
        messagesContainer.innerHTML = ''; // Clear existing messages

        storedMessages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            const paragraphElement = document.createElement('p');
            paragraphElement.textContent = `${message.username}: ${message.message}`;

            messageElement.appendChild(paragraphElement);
            messagesContainer.appendChild(messageElement);
        });
    } catch (err) {
        console.error("somthing went wrong", err);
    }

}

setInterval(async () => {
    await saveToLocalStorage();
    getMessages();
}, 1000);

window.addEventListener("DOMContentLoaded", async () => {
    await saveToLocalStorage();
    getMessages();
});