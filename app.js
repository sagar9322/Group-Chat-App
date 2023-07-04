const express = require('express');
const cors = require('cors');
const sequelize = require('./util/database');
const signUpRoutes = require('./routes/signup');
const userChatRoutes = require('./routes/user');
const bodyParser = require('body-parser');
const ChatBox = require('./models/chatbox');
const Group = require('./models/group');
const User = require('./models/signup');
const path = require('path');
const AWS = require('aws-sdk');
const archiveMessages = require('./controllers/chatArchive');
const cron = require('node-cron');
const app = express();
app.use(cors());
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    oriigin: ['http://localhost:3000']
  }
});


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(signUpRoutes);
app.use(userChatRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, `views/${req.url}`));
});


// Schedule the archival process to run every night at a specific time (e.g., 2:00 AM)
cron.schedule('0 2 * * *', async () => {
  try {
    await archiveMessages();
    console.log('Chat archival completed successfully.');
  } catch (err) {
    console.error('An error occurred during chat archival:', err);
  }
});


io.on('connection', (socket) => {
  socket.on('joinGroup', (groupId) => {

    socket.join(groupId);
  });

  socket.on('pending-request', (userEmail) => {
    console.log("server ss", userEmail)

    io.emit('pending-req', userEmail);
  });

  socket.on('sendMessage', (groupId, message) => {
    io.to(groupId).emit('chat', { groupId: groupId, message: message });
  });

  socket.on('typingg', (groupId, username) => {

    socket.broadcast.to(groupId).emit('typing', groupId, username);
  });

});


Group.hasMany(ChatBox);


sequelize
  .sync()
  .then(result => {
    http.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });