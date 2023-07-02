
const socket = io.connect('http://localhost:3000');

window.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem('groupId', null);
});


const groupId = localStorage.getItem('groupId');
socket.emit('joinGroup', groupId);


socket.on('chat', (data) => {
    const groupId = data.groupId;
    if (groupId === localStorage.getItem('groupId')) {
        getMessages(groupId);
    }
});




// Add event listener for the input field where the user types
const inputField = document.getElementById('message');
inputField.addEventListener('keyup', () => {
    const groupId = localStorage.getItem('groupId');
    const username = localStorage.getItem('username');
    socket.emit('joinGroup', groupId);
    socket.emit('typingg', groupId, username);
});



let timerId = null;
function debounce(func, timer) {
    if (timerId) {
        clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
        func()
    }, timer);
}

// Listen for the typing event
socket.on('typing', (groupId, username) => {
    const typingIndicator = document.getElementById('typing-indicator');

    typingIndicator.textContent = `${username} is typing...`;
    debounce(function () {
        typingIndicator.textContent = '';
    }, 1000);

});

async function sendMessage(event, fileUrl) {
    event.preventDefault();
    let message
    if (fileUrl) {
        message = fileUrl;
    } else {
        message = document.getElementById('message').value;
    }

    const groupId = localStorage.getItem('groupId');

    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post('http://localhost:3000/message', { message: message, groupId: groupId }, { headers });

        document.getElementById('message').value = "";

        socket.emit('sendMessage', groupId, message); // Send the message to the server
    } catch (err) {
        console.error('Error Sending Chat:', err);
    }

}
let pageNumber = 1;
const pageSize = 10;

async function getMessages(groupId, direction) {
    groupId = localStorage.getItem('groupId');
    try {
        // Calculate the page number based on the direction
        if (direction === 'up') {
            pageNumber++;
            if (pageNumber < 1) {
                pageNumber = 1;
            }
        } else if (direction === 'down') {
            pageNumber--;
        }

        const response = await axios.get(`http://localhost:3000/get-msg/${groupId}?page=${pageNumber}&limit=${pageSize}`);
        const { messages } = response.data;
        if (pageNumber === 1) {
            document.querySelector('.down-arrow').style.display = "none";
        }
        else {
            document.querySelector('.down-arrow').style.display = "flex";
        }
        if (messages.length === 0) {
            document.querySelector('.up-arrow').style.display = "none";
        } else {
            document.querySelector('.up-arrow').style.display = "flex";
        }

        const currentUser = localStorage.getItem('username');
        const messagesContainer = document.querySelector('.messages');

        messagesContainer.innerHTML = ''; // Clear existing messages

        messages.reverse().forEach(message => {

            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            // Add sender class based on the username
            if (message.username === currentUser) {
                messageElement.classList.add('current-user');
            } else {
                messageElement.classList.add('other-user');
            }
            const fileType = getFileType(`${message.message}`);
            if (fileType === 'image') {
                const imageMessage = document.createElement('div');
                imageMessage.className = 'image-message';

                const imageContent = document.createElement('div');
                imageContent.className = 'content-msg';

                imageContent.textContent = `${message.username}:`;
                imageContent.style.fontWeight = 'bold';


                const image = document.createElement('img');
                image.src = message.message;


                imageContent.appendChild(image);
                imageMessage.appendChild(imageContent);
                messageElement.appendChild(imageMessage);
            } else if (fileType === 'video') {
                const videoMessage = document.createElement('div');
                videoMessage.className = 'video-message';

                const videoContent = document.createElement('div');
                videoContent.className = 'content-msg';

                const video = document.createElement('video');
                video.src = message.message;
                video.controls = true;

                videoContent.appendChild(video);
                videoMessage.appendChild(videoContent);
                messageElement.appendChild(videoMessage);
            } else if (fileType === 'other') {
                const paragraphElement = document.createElement('p');
                paragraphElement.textContent = `${message.username}: ${message.message}`;

                messageElement.appendChild(paragraphElement);

            }
            messagesContainer.appendChild(messageElement);

        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (err) {
        console.error("Something went wrong", err);
    }
}

function getFileType(message) {

    const extension = message.split('.').pop().toLowerCase();

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const videoExtensions = ['mp4', 'mov', 'avi'];

    if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (videoExtensions.includes(extension)) {
        return 'video';
    }

    return 'other';
}


function toggleUserList() {
    const userList = document.querySelector('.user-list');
    userList.classList.toggle('show');
}
