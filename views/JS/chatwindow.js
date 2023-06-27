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

    }catch(err){
        console.error('Error Sending Chat:', err);
    }

}