const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const ArchivedChatBox = sequelize.define('archivedChatbox', {
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
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    message: {
      type: Sequelize.STRING(1000),
      allowNull: false
    }
  });
  
  module.exports = ArchivedChatBox;