// Next.js API route - acts as a proxy to avoid CORS issues
import axios from 'axios';

const API_URL = 'https://mail.chatgpt.org.uk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { prefix } = req.body;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Referer': 'https://mail.chatgpt.org.uk/',
          'Sec-Ch-Ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin'
        },
        withCredentials: true
      };

      let response;
      
      if (prefix) {
        // Generate with custom prefix
        response = await axios.post(
          `${API_URL}/api/generate-email`,
          { prefix },
          config
        );
      } else {
        // Generate random email
        response = await axios.get(`${API_URL}/api/generate-email`, config);
      }

      res.status(200).json(response.data);
    } catch (error) {
      console.error('Generate email error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json(
        error.response?.data || { success: false, error: 'Failed to generate email' }
      );
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
