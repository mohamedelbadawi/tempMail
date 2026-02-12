const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const Email = require('../models/Email');
const TempEmail = require('../models/TempEmail');

// Generate a new temporary email address
router.post('/generate', async (req, res) => {
  try {
    const { customName } = req.body;
    const domain = process.env.DOMAIN || 'tempmail.local';
    
    let emailAddress;
    
    if (customName) {
      // Validate custom name
      const sanitizedName = customName.toLowerCase().replace(/[^a-z0-9.-]/g, '');
      if (sanitizedName.length < 3) {
        return res.status(400).json({ error: 'Custom name must be at least 3 characters' });
      }
      
      emailAddress = `${sanitizedName}@${domain}`;
      
      // Check if custom name already exists
      const existing = await TempEmail.findOne({ where: { emailAddress } });
      if (existing) {
        return res.status(409).json({ error: 'This custom name is already taken' });
      }
    } else {
      // Generate random email address
      const randomId = uuidv4().split('-')[0];
      emailAddress = `${randomId}@${domain}`;
    }

    const tempEmail = await TempEmail.create({
      emailAddress,
      customName: customName || null
    });

    res.status(201).json({
      emailAddress: tempEmail.emailAddress,
      customName: tempEmail.customName,
      createdAt: tempEmail.createdAt,
      expiresAt: tempEmail.expiresAt
    });
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ error: 'Failed to generate email address' });
  }
});

// Get emails for a specific temporary email address
router.get('/:emailAddress', async (req, res) => {
  try {
    const { emailAddress } = req.params;
    
    // Update last accessed time
    await TempEmail.update(
      { lastAccessedAt: new Date() },
      { where: { emailAddress } }
    );

    const emails = await Email.findAll({
      where: { recipient: emailAddress },
      order: [['receivedAt', 'DESC']],
      limit: 100
    });

    res.json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// Get a specific email by ID
router.get('/message/:id', async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id);
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Mark as read
    email.isRead = true;
    await email.save();

    res.json(email);
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ error: 'Failed to fetch email' });
  }
});

// Delete a specific email
router.delete('/message/:id', async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id);
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const recipient = email.recipient;
    await email.destroy();

    // Decrement email count
    await TempEmail.decrement('emailCount', {
      where: { emailAddress: recipient }
    });

    res.json({ message: 'Email deleted successfully' });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ error: 'Failed to delete email' });
  }
});

// Delete all emails for a temporary email address
router.delete('/:emailAddress/all', async (req, res) => {
  try {
    const { emailAddress } = req.params;
    
    await Email.destroy({
      where: { recipient: emailAddress }
    });
    
    // Reset email count
    await TempEmail.update(
      { emailCount: 0 },
      { where: { emailAddress } }
    );

    res.json({ message: 'All emails deleted successfully' });
  } catch (error) {
    console.error('Error deleting emails:', error);
    res.status(500).json({ error: 'Failed to delete emails' });
  }
});

// Check if custom name is available
router.get('/check/:customName', async (req, res) => {
  try {
    const { customName } = req.params;
    const domain = process.env.DOMAIN || 'tempmail.local';
    const sanitizedName = customName.toLowerCase().replace(/[^a-z0-9.-]/g, '');
    const emailAddress = `${sanitizedName}@${domain}`;
    
    const existing = await TempEmail.findOne({ where: { emailAddress } });
    
    res.json({ 
      available: !existing,
      emailAddress: sanitizedName.length >= 3 ? emailAddress : null
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

module.exports = router;
