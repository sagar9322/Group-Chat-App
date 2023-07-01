async function getGroupList() {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.post('http://localhost:3000/group', {}, { headers });
        const groupList = response.data.groups;


        const groupContainer = document.querySelector('.group-list');
        groupContainer.innerHTML = ''; // Clear existing user list

        groupList.forEach(group => {
            const groupItem = document.createElement('li');
            groupItem.textContent = group.groupName;
            const groupId = group.id;
            const groupName = group.groupName;
            groupItem.addEventListener('click', () => {
                document.getElementById('invite-friend').style.display = "block";
                document.getElementById("request-pending").style.display = "block";
                document.querySelector('.group-member').style.display = "block";
                document.querySelector('.arrows').style.display = "block";
                document.querySelector('.input-box').classList.remove('hidden');
                localStorage.setItem('groupId', groupId);
                const groupid = localStorage.getItem('groupId')
                socket.emit('joinGroup', groupId);
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
    const response = await axios.post('http://localhost:3000/create-group', { groupName: groupName }, { headers })

    hideCreateGroupForm();
    if (response.status === 200) {
        window.location.href = "/JS/chatwindow.js"
        location.reload();
    }
});



async function getUserList(groupid) {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post('http://localhost:3000/user', { groupId: groupid }, { headers });
        const userList = response.data.members;

        const adminId = response.data.admin;
        const superAdminId = response.data.superAdminId;
        const adminid = adminId.map(admin => admin.memberId);

        const userContainer = document.querySelector('.user-list');
        userContainer.innerHTML = ''; // Clear existing user list

        userList.forEach(user => {
            const userItem = document.createElement('li');
            if (user.id === superAdminId) {
                userItem.textContent = `Super Admin: ${user.name}`;
            }
            else if (adminid.includes(user.id)) {
                userItem.textContent = `Admin: ${user.name}`;
            } else {
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

                    await axios.post('http://localhost:3000/make-admin', { groupId: groupId, userId: userId }, {
                        headers
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
                        await axios.post('http://localhost:3000/delete', { groupId: groupId, userId: user.id }, { headers });

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



