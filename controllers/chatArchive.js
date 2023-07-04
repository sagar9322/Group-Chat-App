const ChatBox = require('../models/chatbox');
const ArchivedChatBox = require('../models/archiveChatBox');
const { Op } = require('sequelize');

// Function to move one-day-old messages to the ArchivedChatBox table
async function archiveMessages() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // Get the timestamp one day ago
  const messagesToArchive = await ChatBox.findAll({
    where: {
      createdAt: {
        [Op.lte]: oneDayAgo
      }
    }
  });

  // Insert messages into ArchivedChatBox table
  await ArchivedChatBox.bulkCreate(messagesToArchive);

  // Delete messages from ChatBox table
  await ChatBox.destroy({
    where: {
      createdAt: {
        [Op.lte]: oneDayAgo
      }
    }
  });
}

module.exports = archiveMessages;