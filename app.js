const express = require('express');
const cors = require('cors');
const sequelize = require('./util/database');
const signUpRoutes = require('./routes/signup');
const userChatRoutes = require('./routes/user');
const bodyParser = require('body-parser');
const ChatBox = require('./models/chatbox');
const Group = require('./models/group');
const User = require('./models/signup');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(signUpRoutes);
app.use(userChatRoutes);


Group.hasMany(ChatBox);


sequelize
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });