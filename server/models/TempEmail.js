const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TempEmail = sequelize.define('TempEmail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    index: true
  },
  customName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastAccessedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expiresAt: {
    type: DataTypes.DATE,
    defaultValue: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  emailCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'temp_emails',
  indexes: [
    {
      fields: ['emailAddress']
    },
    {
      fields: ['expiresAt']
    }
  ]
});

module.exports = TempEmail;
