const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ChatBox = sequelize.define('chatbox', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  uid: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  message: {
    type: Sequelize.STRING(1000),
    allowNull: false
  }
});

module.exports = ChatBox;