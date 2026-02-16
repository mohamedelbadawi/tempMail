import { createMocks } from 'node-mocks-http'
import handler from '../../pages/api/email/[id]'
import axios from 'axios'

// Mock axios
jest.mock('axios')

describe('/api/email/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET requests', () => {
    it('should fetch a single email by ID', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: 'test-id-123',
            from_address: 'sender@example.com',
            subject: 'Test Email',
            content: 'Test content',
            html_content: '<p>Test HTML</p>',
            has_html: true,
            timestamp: 1234567890,
            email_address: 'recipient@example.com'
          }
        }
      }

      axios.get.mockResolvedValueOnce(mockResponse)

      const { req, res } = createMocks({
        method: 'GET',
        query: { id: 'test-id-123' },
        headers: {
          'user-agent': 'test-agent'
        }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(mockResponse.data)
      expect(axios.get).toHaveBeenCalledWith(
        'https://mail.chatgpt.org.uk/api/email/test-id-123',
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': 'test-agent'
          })
        })
      )
    })

    it('should return 400 when email ID is missing', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {}
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        error: 'Email ID required'
      })
      expect(axios.get).not.toHaveBeenCalled()
    })

    it('should handle 404 errors for non-existent emails', async () => {
      const mockError = {
        response: {
          status: 404,
          data: {
            success: false,
            error: 'Email not found'
          }
        }
      }

      axios.get.mockRejectedValueOnce(mockError)

      const { req, res } = createMocks({
        method: 'GET',
        query: { id: 'non-existent-id' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(404)
      expect(JSON.parse(res._getData())).toEqual(mockError.response.data)
    })
  })

  describe('DELETE requests', () => {
    it('should delete an email by ID', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Email deleted'
        }
      }

      axios.delete.mockResolvedValueOnce(mockResponse)

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'test-id-123' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(mockResponse.data)
      expect(axios.delete).toHaveBeenCalledWith(
        'https://mail.chatgpt.org.uk/api/email/test-id-123',
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should return 400 when email ID is missing for delete', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: {}
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        error: 'Email ID required'
      })
      expect(axios.delete).not.toHaveBeenCalled()
    })

    it('should handle delete errors gracefully', async () => {
      const mockError = {
        response: {
          status: 500,
          data: {
            success: false,
            error: 'Failed to delete email'
          }
        }
      }

      axios.delete.mockRejectedValueOnce(mockError)

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'test-id-123' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual(mockError.response.data)
    })
  })

  describe('Method validation', () => {
    it('should reject unsupported methods', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { id: 'test-id-123' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        error: 'Method not allowed'
      })
    })

    it('should reject PUT requests', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { id: 'test-id-123' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
    })
  })
})
