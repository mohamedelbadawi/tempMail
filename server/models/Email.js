const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Email = sequelize.define('Email', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  messageId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  recipient: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    defaultValue: '(No Subject)'
  },
  text: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  html: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  attachments: {
    type: DataTypes.TEXT, // Store as JSON string
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('attachments');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('attachments', JSON.stringify(value || []));
    }
  },
  receivedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'emails',
  indexes: [
    {
      fields: ['recipient', 'receivedAt']
    }
  ]
});

module.exports = Email;
