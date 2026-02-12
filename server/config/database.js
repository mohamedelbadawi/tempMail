const { Sequelize } = require('sequelize');
const path = require('path');

// Create SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || path.join(__dirname, '../../data/tempmail.db'),
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: true,
    underscored: false
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Database Connected');
    
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized');
    
    return sequelize;
  } catch (error) {
    console.error('❌ Database Connection Error:', error.message);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
