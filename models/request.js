const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Request = sequelize.define('request', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  groupName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  requestedUser: {
    type: Sequelize.STRING,
    allowNull: false
  },
  requestFrom:{
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Request;