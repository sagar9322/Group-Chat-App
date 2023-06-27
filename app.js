const express = require('express');
const cors = require('cors');
const sequelize = require('./util/database');
const signUpRoutes = require('./routes/signup');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(signUpRoutes);

sequelize
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });