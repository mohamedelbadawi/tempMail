import { createMocks } from 'node-mocks-http'
import handler from '../../pages/api/emails/clear'
import axios from 'axios'

// Mock axios
jest.mock('axios')

describe('/api/emails/clear', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('DELETE requests', () => {
    it('should clear all emails for a valid email address', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            count: 5
          }
        }
      }

      axios.delete.mockResolvedValueOnce(mockResponse)

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { email: 'test@example.com' },
        headers: {
          'user-agent': 'test-agent'
        }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(mockResponse.data)
      expect(axios.delete).toHaveBeenCalledWith(
        'https://mail.chatgpt.org.uk/api/emails/clear',
        expect.objectContaining({
          params: { email: 'test@example.com' },
          headers: expect.objectContaining({
            'User-Agent': 'test-agent',
            'Accept': '*/*'
          })
        })
      )
    })

    it('should return 400 when email parameter is missing', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: {}
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        error: 'Email parameter required'
      })
      expect(axios.delete).not.toHaveBeenCalled()
    })

    it('should handle API errors gracefully', async () => {
      const mockError = {
        response: {
          status: 500,
          data: {
            success: false,
            error: 'Failed to clear emails'
          }
        }
      }

      axios.delete.mockRejectedValueOnce(mockError)

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { email: 'test@example.com' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual(mockError.response.data)
    })

    it('should handle network errors', async () => {
      axios.delete.mockRejectedValueOnce(new Error('Network error'))

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { email: 'test@example.com' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        error: 'Failed to clear emails'
      })
    })

    it('should include proper referer header with email', async () => {
      const mockResponse = {
        data: { success: true, data: { count: 0 } }
      }

      axios.delete.mockResolvedValueOnce(mockResponse)

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { email: 'user@example.com' }
      })

      await handler(req, res)

      expect(axios.delete).toHaveBeenCalledWith(
        'https://mail.chatgpt.org.uk/api/emails/clear',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Referer': 'https://mail.chatgpt.org.uk/user@example.com'
          })
        })
      )
    })

    it('should clear zero emails successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            count: 0
          }
        }
      }

      axios.delete.mockResolvedValueOnce(mockResponse)

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { email: 'empty@example.com' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(mockResponse.data)
    })
  })

  describe('Method validation', () => {
    it('should reject non-DELETE requests', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { email: 'test@example.com' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        error: 'Method not allowed'
      })
    })

    it('should reject POST requests', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { email: 'test@example.com' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
    })

    it('should reject PUT requests', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { email: 'test@example.com' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
    })
  })
})
