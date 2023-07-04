const socket = io.connect('http://localhost:3000');
async function getUserDetail(event) {
    event.preventDefault();
    let email = document.getElementById('email-ip').value;
    let password = document.getElementById('password-ip').value;

    const userDetails = {
        email: email,
        password: password
    }

    try {
        const response = await axios.post('http://localhost:3000/log-in', userDetails).then((response) => {
            
            const token = response.data.token;
            localStorage.setItem("token", token);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("email", response.data.email);
            // socket.emit('signIn', response.data.username);
            window.location.href = "../HTML/chatwindow.html";
            
        });
        if (response.status === 200) {
            document.getElementById('email-ip').value = "";
            document.getElementById('password-ip').value = "";
            document.getElementById('error-heading').textContent = "Login Sucsessfully";
            document.getElementById('error-heading').style.color = "green";
        }
    } catch (error) {
        // Handle error response
        if (error.response && error.response.status === 404) {
            document.getElementById('error-heading').textContent = "Email or Password doesn't match";
            document.getElementById('email-ip').value = "";
            document.getElementById('password-ip').value = "";
        } else if (error.response && error.response.status === 401) {
            document.getElementById('error-heading').textContent = "Password is incorrect";
            document.getElementById('email-ip').value = "";
            document.getElementById('password-ip').value = "";
        }
        else {
            console.log('Error:', error.message);
        }
    }
}