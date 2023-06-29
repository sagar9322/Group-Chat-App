const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Group = sequelize.define('groups', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  createdId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  groupName: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Group;