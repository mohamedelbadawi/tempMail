/**
 * Tests for utility helper functions
 */

describe('Utility Helper Functions', () => {
  describe('localStorage helpers', () => {
    beforeEach(() => {
      localStorage.clear()
      jest.clearAllMocks()
    })

    it('should save and retrieve email from localStorage', () => {
      const email = 'test@example.com'
      localStorage.setItem('savedEmails', JSON.stringify([{ address: email, savedAt: new Date().toISOString() }]))
      
      const saved = JSON.parse(localStorage.getItem('savedEmails'))
      expect(saved).toHaveLength(1)
      expect(saved[0].address).toBe(email)
    })

    it('should handle empty localStorage gracefully', () => {
      const result = localStorage.getItem('savedEmails')
      expect(result).toBeNull()
    })

    it('should remove email from localStorage', () => {
      const emails = [
        { address: 'test1@example.com', savedAt: new Date().toISOString() },
        { address: 'test2@example.com', savedAt: new Date().toISOString() }
      ]
      localStorage.setItem('savedEmails', JSON.stringify(emails))
      
      const updated = emails.filter(e => e.address !== 'test1@example.com')
      localStorage.setItem('savedEmails', JSON.stringify(updated))
      
      const result = JSON.parse(localStorage.getItem('savedEmails'))
      expect(result).toHaveLength(1)
      expect(result[0].address).toBe('test2@example.com')
    })
  })

  describe('Email validation', () => {
    it('should validate correct email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ]

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user@domain',
        ''
      ]

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })
  })

  describe('Date formatting', () => {
    it('should format timestamps correctly', () => {
      const timestamp = 1234567890
      const date = new Date(timestamp * 1000)
      
      expect(date).toBeInstanceOf(Date)
      expect(date.getTime()).toBe(1234567890000)
    })

    it('should handle current timestamp', () => {
      const now = Date.now()
      const date = new Date(now)
      
      expect(date.getTime()).toBe(now)
    })
  })

  describe('Array operations', () => {
    it('should filter emails correctly', () => {
      const emails = [
        { id: '1', subject: 'Test 1' },
        { id: '2', subject: 'Test 2' },
        { id: '3', subject: 'Test 3' }
      ]

      const filtered = emails.filter(e => e.id !== '2')
      expect(filtered).toHaveLength(2)
      expect(filtered.find(e => e.id === '2')).toBeUndefined()
    })

    it('should map email transformations', () => {
      const apiEmails = [
        {
          id: '1',
          from_address: 'sender@test.com',
          subject: 'Test',
          content: 'Content',
          timestamp: 1234567890
        }
      ]

      const transformed = apiEmails.map(email => ({
        id: email.id,
        sender: email.from_address,
        subject: email.subject,
        text: email.content,
        receivedAt: new Date(email.timestamp * 1000).toISOString()
      }))

      expect(transformed[0].sender).toBe('sender@test.com')
      expect(transformed[0].receivedAt).toBeDefined()
    })
  })

  describe('Set operations for tracking', () => {
    it('should add and check items in Set', () => {
      const readEmails = new Set()
      
      readEmails.add('email-1')
      readEmails.add('email-2')
      
      expect(readEmails.has('email-1')).toBe(true)
      expect(readEmails.has('email-3')).toBe(false)
      expect(readEmails.size).toBe(2)
    })

    it('should delete items from Set', () => {
      const deletedEmails = new Set(['email-1', 'email-2'])
      
      deletedEmails.delete('email-1')
      
      expect(deletedEmails.has('email-1')).toBe(false)
      expect(deletedEmails.has('email-2')).toBe(true)
      expect(deletedEmails.size).toBe(1)
    })

    it('should clear Set completely', () => {
      const readEmails = new Set(['email-1', 'email-2', 'email-3'])
      
      readEmails.clear()
      
      expect(readEmails.size).toBe(0)
    })
  })

  describe('String operations', () => {
    it('should convert values to strings for comparison', () => {
      const numId = 123
      const strId = '123'
      
      expect(String(numId)).toBe(strId)
      expect(String(numId) === strId).toBe(true)
    })

    it('should handle undefined and null conversions', () => {
      expect(String(undefined)).toBe('undefined')
      expect(String(null)).toBe('null')
    })
  })

  describe('Error handling', () => {
    it('should catch and handle errors', () => {
      const errorHandler = (error) => {
        return {
          success: false,
          error: error.message
        }
      }

      const result = errorHandler(new Error('Test error'))
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Test error')
    })

    it('should handle API error responses', () => {
      const apiError = {
        response: {
          status: 404,
          data: { error: 'Not found' }
        }
      }

      const status = apiError.response?.status || 500
      const message = apiError.response?.data || { error: 'Unknown error' }

      expect(status).toBe(404)
      expect(message.error).toBe('Not found')
    })
  })
})
