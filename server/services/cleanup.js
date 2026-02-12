const cron = require('node-cron');
const { Op } = require('sequelize');
const TempEmail = require('../models/TempEmail');
const Email = require('../models/Email');

// Clean up expired emails every hour
const startCleanupService = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      
      // Find expired temp emails
      const expiredEmails = await TempEmail.findAll({
        where: {
          expiresAt: {
            [Op.lt]: now
          }
        }
      });

      if (expiredEmails.length > 0) {
        console.log(`🗑️  Cleaning up ${expiredEmails.length} expired email addresses...`);
        
        // Delete associated emails
        for (const tempEmail of expiredEmails) {
          await Email.destroy({
            where: { recipient: tempEmail.emailAddress }
          });
        }
        
        // Delete expired temp email records
        await TempEmail.destroy({
          where: {
            expiresAt: {
              [Op.lt]: now
            }
          }
        });
        
        console.log('✅ Cleanup completed');
      }
    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  });

  console.log('🕐 Cleanup service started (runs every hour)');
};

// Manual cleanup function
const cleanupExpired = async () => {
  try {
    const now = new Date();
    
    const expiredEmails = await TempEmail.findAll({
      where: {
        expiresAt: {
          [Op.lt]: now
        }
      }
    });

    if (expiredEmails.length > 0) {
      for (const tempEmail of expiredEmails) {
        await Email.destroy({
          where: { recipient: tempEmail.emailAddress }
        });
      }
      
      await TempEmail.destroy({
        where: {
          expiresAt: {
            [Op.lt]: now
          }
        }
      });
      
      return expiredEmails.length;
    }
    
    return 0;
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
};

module.exports = { startCleanupService, cleanupExpired };
