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
submitBtn.addEventListener('submit', () => {
    hideRequestForm();
})

const deleteButton = document.getElementById('delete-button-request-form');
deleteButton.addEventListener('click', hideRequestForm);


// Function to retrieve user list
async function getRequestUserList() {
    try {
        const response = await axios.get('http://localhost:3000/userList');
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
        const response = await axios.post('http://localhost:3000/send-request', { users: checkedUserIds, groupId: groupId }, { headers });
        if (response.status === 200) {
            window.location.href = "/JS/chatwindow.js"
            location.reload();
        }
        // Additional code here to handle the response or perform any other actions
    } catch (error) {
        console.error('Error sending request:', error);
    }
}



// Add event listener to the invite button
const inviteButton = document.getElementById('invite-button');
inviteButton.addEventListener('click', sendRequest);

// Call the getUserList function to populate the user list
document.getElementById('invite-friend').addEventListener("click", ()=>{
    getRequestUserList();
})





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
        const response = await axios.post(`http://localhost:3000/accept-request/${requestId}`);
        if (response.status === 200) {
            window.location.href = "/JS/chatwindow.js"
            location.reload();
        }

    } catch (err) {
        console.error('Error accepting request:', err);
    }
}

// Reject a request
async function rejectRequest(requestId) {
    try {
        const response = await axios.post(`http://localhost:3000/reject-request/${requestId}`);
        if (response.status === 200) {
            window.location.href = "/JS/chatwindow.js"
            location.reload();
        }
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
        const response = await axios.post('http://localhost:3000/pending-requests', {}, { headers });
        const requests = response.data.requests;
        document.getElementById('request-pending').textContent = `Pending Requests(${requests.length})`

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
// document.getElementById("request-pending").addEventListener('click', ()=> {
//     displayPendingRequests();
// })   
displayPendingRequests();