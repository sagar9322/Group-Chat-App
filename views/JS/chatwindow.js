

async function sendMessage(event) {
    event.preventDefault();
    const message = document.getElementById('message').value;
    const groupId = localStorage.getItem('groupId');

    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post('http://localhost:3000/chat/message', { message: message, groupId: groupId }, { headers });

        document.getElementById('message').value = "";
        await saveToLocalStorage();
        await getMessages(groupId);
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


async function getMessages(groupId) {
    try {
        const currentUser = localStorage.getItem('username');
        const storedMessages = JSON.parse(localStorage.getItem('messages'));

        const messagesContainer = document.querySelector('.messages');
        messagesContainer.innerHTML = ''; // Clear existing messages


        const filteredMessages = storedMessages.filter(
            message => message.groupId === Number(groupId)

        );


        filteredMessages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            // Add sender class based on the username
            if (message.username === currentUser) {
                messageElement.classList.add('current-user');
            } else {
                messageElement.classList.add('other-user');
            }

            const paragraphElement = document.createElement('p');
            paragraphElement.textContent = `${message.username}: ${message.message}`;

            messageElement.appendChild(paragraphElement);
            messagesContainer.appendChild(messageElement);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (err) {
        console.error("something went wrong", err);
    }

}

function toggleUserList() {
    const userList = document.querySelector('.user-list');
    userList.classList.toggle('show');
}



async function getUserList(groupid) {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post('http://localhost:3000/chat/user', {groupId: groupid}, {headers});
        const userList = response.data.members;
        
        const adminId = response.data.admin;
        const superAdminId = response.data.superAdminId;
        const adminid = adminId.map(admin=> admin.memberId);

        const userContainer = document.querySelector('.user-list');
        userContainer.innerHTML = ''; // Clear existing user list

        userList.forEach(user => {
            const userItem = document.createElement('li');
            if(user.id === superAdminId){
                userItem.textContent = `Super Admin: ${user.name}`;
            }
            else if(adminid.includes(user.id)){
                userItem.textContent = `Admin: ${user.name}`;
            }else{
                userItem.textContent = user.name;
            }
            userItem.addEventListener('click', async () => {
                if (user.id === adminId) {
                    return; // Skip event handling for admin user
                }
                const confirmDialog = confirm("Do you want to make him/her an admin?");
                      if (confirmDialog) {
                        const groupId = localStorage.getItem('groupId');
                        const userId = user.id;

                        await axios.post('http://localhost:3000/user/make-admin', {groupId: groupId, userId: userId}, {headers
                    });
                        
                        }
            });
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-member');
            deleteButton.textContent = 'X';
            deleteButton.style.fontSize = '12px';
            deleteButton.style.width = "20px";
            
            deleteButton.addEventListener('click', async () => {
                const confirmDialog = confirm(`Are you sure you want to delete ${user.name}?`);
                if (confirmDialog) {
                    try {
                        const groupId = localStorage.getItem('groupId');
                        const userId = user.id;
                        // Send delete request to server
                        await axios.post('http://localhost:3000/user/delete', { groupId: groupId, userId: user.id }, { headers });

                        // Remove the user element from the user list UI
                        userContainer.removeChild(userItem);
                    } catch (error) {
                        console.error('Error deleting user:', error);
                    }
                }
            });
            userItem.appendChild(deleteButton);
            userContainer.appendChild(userItem);
        });
    } catch (error) {
        console.error('Error fetching user list:', error);
    }
}



async function getGroupList() {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.post('http://localhost:3000/chat/group', {}, {headers});
        const groupList = response.data.groups;


        const groupContainer = document.querySelector('.group-list');
        groupContainer.innerHTML = ''; // Clear existing user list

        groupList.forEach(group => {
            const groupItem = document.createElement('li');
            groupItem.textContent = group.groupName;
            const groupId = group.id;
            const groupName = group.groupName;
            groupItem.addEventListener('click', () => {
                document.querySelector('.input-box').classList.remove('hidden');
                localStorage.setItem('groupId', groupId);
                const groupid = localStorage.getItem('groupId')
                document.getElementById('group-name-header').textContent = `${groupName}`;
                document.getElementById('group-name').style.color = '#1dd335';
                getUserList(groupid);
                const activeGroupItem = document.querySelector('.group-list .active-list');
                if (activeGroupItem) {
                    activeGroupItem.classList.remove('active-list');
                }
                groupItem.classList.add('active-list');
                getMessages(groupId);
            });

            groupContainer.appendChild(groupItem);
        });
    } catch (error) {
        console.error('Error fetching user list:', error);
    }
}
getGroupList();



// Function to show the create group form and blur the background
function showCreateGroupForm() {
    const createGroupForm = document.querySelector('.create-group-form');
    const container = document.querySelector('.container');
    createGroupForm.classList.remove('hidden');
    container.classList.add('blur');
}

// Function to hide the create group form and remove the blur effect
function hideCreateGroupForm() {
    const createGroupForm = document.getElementById('create-group-form');
    const container = document.querySelector('.container');
    createGroupForm.classList.add('hidden');
    container.classList.remove('blur');
}
const deleteButtonCreateGroupForm = document.getElementById('delete-button-creategroup-form');
deleteButtonCreateGroupForm.addEventListener('click', hideCreateGroupForm);

// Event listener for the create group button
const createGroupButton = document.getElementById('create-group');
createGroupButton.addEventListener('click', showCreateGroupForm);

// Event listener for the form submit button
const createGroupForm = document.querySelector('#create-group-form form');
createGroupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
    const groupName = document.getElementById('group-name').value;
    const response = await axios.post('http://localhost:3000/chat/create-group', { groupName: groupName }, { headers })
    hideCreateGroupForm();
});
// setInterval(async () => {
//     await saveToLocalStorage();
//     getMessages();
// }, 1000);




// Function to show the create group form and blur the background
function showRequestForm() {
    const requestForm = document.querySelector('.request-form');
    const container = document.querySelector('.container');
    requestForm.classList.remove('hidden');
    container.classList.add('blur');
}

// Function to hide the create group form and remove the blur effect
function hideRequestForm() {
    const requestForm = document.getElementById('request-form');
    const container = document.querySelector('.container');
    requestForm.classList.add('hidden');
    container.classList.remove('blur');
}

// Event listener for the create group button
const requetButton = document.getElementById('invite-friend');
requetButton.addEventListener('click', showRequestForm);

// Event listener for the form submit button
const submitBtn = document.querySelector('#invite-button');
submitBtn.addEventListener('submit', ()=> {
    hideRequestForm();
})

const deleteButton = document.getElementById('delete-button-request-form');
deleteButton.addEventListener('click', hideRequestForm);


// Function to retrieve user list
async function getRequestUserList() {
    try {
        const response = await axios.get('http://localhost:3000/chat/userList');
        const userList = response.data.users;

        const userListContainer = document.getElementById('user-list');
        const currentUser = localStorage.getItem('username');

        userList.forEach(user => {
            if (user.name !== currentUser) {
                const userItem = document.createElement('li');
                const userCheckbox = document.createElement('input');
                userCheckbox.type = 'checkbox';
                userCheckbox.value = user.id;
                userItem.textContent = user.name;
                userItem.appendChild(userCheckbox);
                userListContainer.appendChild(userItem);
            }

        });
    } catch (error) {
        console.error('Error fetching user list:', error);
    }
}

// Function to send request
async function sendRequest(event) {
    event.preventDefault();
    const checkedUserIds = Array.from(document.querySelectorAll('#user-list input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    const groupId = localStorage.getItem('groupId');
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };


    // Send the request with the checked user IDs
    try {
        const response = await axios.post('http://localhost:3000/chat/send-request', { users: checkedUserIds, groupId: groupId }, { headers });
        console.log('Request sent successfully');
        // Additional code here to handle the response or perform any other actions
    } catch (error) {
        console.error('Error sending request:', error);
    }
}

// Add event listener to the invite button
const inviteButton = document.getElementById('invite-button');
inviteButton.addEventListener('click', sendRequest);

// Call the getUserList function to populate the user list
getRequestUserList();




// Show the pending request window
function showPendingRequests() {
    const requestWindow = document.getElementById('request-window');
    const container = document.querySelector('.container');
    requestWindow.classList.remove('hidden');
    container.classList.add('blur');
  }
  
  // Hide the pending request window
  function hidePendingRequests() {
    const requestWindow = document.getElementById('request-window');
    const container = document.querySelector('.container');
    requestWindow.classList.add('hidden');
    container.classList.remove('blur');
  }
  const deleteButtonGroupForm = document.getElementById('delete-button-group-form');
deleteButtonGroupForm.addEventListener('click', hidePendingRequests);
  
  // Accept a request
  async function acceptRequest(requestId) {
    try {
      await axios.post(`http://localhost:3000/chat/accept-request/${requestId}`);
      // Handle success
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  }
  
  // Reject a request
  async function rejectRequest(requestId) {
    try {
      await axios.post(`http://localhost:3000/chat/reject-request/${requestId}`);
      // Handle success
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  }
  
  // Fetch and display the pending requests
  async function displayPendingRequests() {
    
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
    try {
      const response = await axios.post('http://localhost:3000/chat/pending-requests', {}, {headers});
      const requests = response.data.requests;
      
      const requestList = document.getElementById('request-list');
      requestList.innerHTML = ''; // Clear existing requests
  
      requests.forEach((request) => {
        const requestItem = document.createElement('div');
        requestItem.classList.add('request-item');
  
        const userName = request.requestFrom;
        const groupName = request.groupName; // Replace with appropriate property
  
        const requestText = document.createElement('p');
        requestText.textContent = `${userName} sent you a request to join "${groupName}" group.`;
  
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accept';
        acceptButton.addEventListener('click', () => {
          acceptRequest(request.id); // Pass the request ID to the accept function
        });
  
        const rejectButton = document.createElement('button');
        rejectButton.textContent = 'Reject';
        rejectButton.addEventListener('click', () => {
          rejectRequest(request.id); // Pass the request ID to the reject function
        });
  
        requestItem.appendChild(requestText);
        requestItem.appendChild(acceptButton);
        requestItem.appendChild(rejectButton);
  
        requestList.appendChild(requestItem);
      });
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    }
  }
  displayPendingRequests();