import { createMocks } from 'node-mocks-http'
import handler from '../../pages/api/generate-email'
import axios from 'axios'

// Mock axios
jest.mock('axios')

describe('/api/generate-email', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST requests', () => {
    it('should generate a random email when no prefix is provided', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            email: 'test123@example.com'
          }
        }
      }

      axios.get.mockResolvedValueOnce(mockResponse)

      const { req, res } = createMocks({
        method: 'POST',
        body: {},
        headers: {
          'user-agent': 'test-agent'
        }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(mockResponse.data)
      expect(axios.get).toHaveBeenCalledWith(
        'https://mail.chatgpt.org.uk/api/generate-email',
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': 'test-agent',
            'Accept': '*/*'
          })
        })
      )
    })

    it('should generate an email with custom prefix when provided', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            email: 'myprefix@example.com'
          }
        }
      }

      axios.post.mockResolvedValueOnce(mockResponse)

      const { req, res } = createMocks({
        method: 'POST',
        body: { prefix: 'myprefix' },
        headers: {
          'user-agent': 'test-agent'
        }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(mockResponse.data)
      expect(axios.post).toHaveBeenCalledWith(
        'https://mail.chatgpt.org.uk/api/generate-email',
        { prefix: 'myprefix' },
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': 'test-agent'
          })
        })
      )
    })

    it('should handle API errors gracefully', async () => {
      const mockError = {
        response: {
          status: 500,
          data: {
            success: false,
            error: 'Internal server error'
          }
        }
      }

      axios.get.mockRejectedValueOnce(mockError)

      const { req, res } = createMocks({
        method: 'POST',
        body: {}
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual(mockError.response.data)
    })

    it('should handle network errors', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'))

      const { req, res } = createMocks({
        method: 'POST',
        body: {}
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        error: 'Failed to generate email'
      })
    })
  })

  describe('Method validation', () => {
    it('should reject non-POST requests', async () => {
      const { req, res } = createMocks({
        method: 'GET'
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
