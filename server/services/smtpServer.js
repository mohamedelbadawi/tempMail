const { SMTPServer } = require('smtp-server');
const { simpleParser } = require('mailparser');
const Email = require('../models/Email');
const TempEmail = require('../models/TempEmail');
const { v4: uuidv4 } = require('uuid');

let smtpServer;

const startSMTPServer = (io) => {
  smtpServer = new SMTPServer({
    authOptional: true,
    disabledCommands: ['AUTH'],
    onData(stream, session, callback) {
      simpleParser(stream, async (err, parsed) => {
        if (err) {
          console.error('Error parsing email:', err);
          return callback(err);
        }

        try {
          // Extract recipient email
          const recipient = parsed.to?.text || parsed.to?.value?.[0]?.address || '';
          
          // Check if this is a valid temp email address
          const tempEmail = await TempEmail.findOne({ 
            where: {
              emailAddress: recipient,
              isActive: true
            }
          });

          if (!tempEmail) {
            console.log(`Email received for non-existent address: ${recipient}`);
            return callback();
          }

          // Create email record
          const emailData = {
            messageId: parsed.messageId || uuidv4(),
            recipient: recipient,
            sender: parsed.from?.text || parsed.from?.value?.[0]?.address || 'unknown',
            subject: parsed.subject || '(No Subject)',
            text: parsed.text || '',
            html: parsed.html || '',
            attachments: parsed.attachments?.map(att => ({
              filename: att.filename,
              contentType: att.contentType,
              size: att.size
            })) || [],
            receivedAt: new Date()
          };

          const email = await Email.create(emailData);

          // Update email count
          tempEmail.emailCount += 1;
          tempEmail.lastAccessedAt = new Date();
          await tempEmail.save();

          console.log(`📧 Email received for ${recipient} from ${emailData.sender}`);

          // Emit socket event for real-time notification
          if (io) {
            io.to(recipient).emit('new-email', {
              id: email.id,
              from: emailData.sender,
              subject: emailData.subject,
              receivedAt: emailData.receivedAt
            });
          }

          callback();
        } catch (error) {
          console.error('Error saving email:', error);
          callback(error);
        }
      });
    },
    onError(error) {
      console.error('SMTP Server error:', error);
    }
  });

  const SMTP_PORT = process.env.SMTP_PORT || 2525;
  
  smtpServer.listen(SMTP_PORT, () => {
    console.log(`📮 SMTP Server listening on port ${SMTP_PORT}`);
  });
};

const stopSMTPServer = () => {
  if (smtpServer) {
    smtpServer.close();
  }
};

module.exports = { startSMTPServer, stopSMTPServer };
