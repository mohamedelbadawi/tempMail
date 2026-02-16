import { createMocks } from 'node-mocks-http'
import handler from '../../pages/api/emails'
import axios from 'axios'

// Mock axios
jest.mock('axios')

describe('/api/emails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET requests', () => {
    it('should fetch emails for a valid email address', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            emails: [
              {
                id: '1',
                from_address: 'sender@example.com',
                subject: 'Test Email',
                content: 'Test content',
                html_content: '<p>Test HTML</p>',
                has_html: true,
                timestamp: 1234567890,
                email_address: 'test@example.com'
              }
            ]
          }
        }
      }

      axios.get.mockResolvedValueOnce(mockResponse)

      const { req, res } = createMocks({
        method: 'GET',
        query: { email: 'test@example.com' },
        headers: {
          'user-agent': 'test-agent'
        }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(mockResponse.data)
      expect(axios.get).toHaveBeenCalledWith(
        'https://mail.chatgpt.org.uk/api/emails',
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
        method: 'GET',
        query: {}
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        error: 'Email parameter required'
      })
      expect(axios.get).not.toHaveBeenCalled()
    })

    it('should handle API errors gracefully', async () => {
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
        query: { email: 'test@example.com' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(404)
      expect(JSON.parse(res._getData())).toEqual(mockError.response.data)
    })

    it('should handle network errors', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'))

      const { req, res } = createMocks({
        method: 'GET',
        query: { email: 'test@example.com' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        error: 'Failed to fetch emails'
      })
    })

    it('should include proper referer header with email', async () => {
      const mockResponse = {
        data: { success: true, data: { emails: [] } }
      }

      axios.get.mockResolvedValueOnce(mockResponse)

      const { req, res } = createMocks({
        method: 'GET',
        query: { email: 'user@example.com' }
      })

      await handler(req, res)

      expect(axios.get).toHaveBeenCalledWith(
        'https://mail.chatgpt.org.uk/api/emails',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Referer': 'https://mail.chatgpt.org.uk/user@example.com'
          })
        })
      )
    })
  })

  describe('Method validation', () => {
    it('should reject non-GET requests', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { email: 'test@example.com' }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        error: 'Method not allowed'
      })
    })
  })
})
