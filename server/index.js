import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Disabling CSP for now to prevent issues with React Dev tools and external assets unless explicitly configured
}));

// Restrict CORS to specific origins in production, or allow local in dev
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://your-production-url.onrender.com'] // Example production URL
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Rate Limiting for AI Endpoints (prevent quota abuse)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes)
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use('/api/', apiLimiter);

// Proxy Deepgram Token request
app.get('/api/deepgram/token', async (req, res) => {
  try {
    const deepgramKey = process.env.DEEPGRAM_API_KEY;
    if (!deepgramKey) throw new Error('Deepgram key not found in server');
    
    // Create a temporary key for the client
    const response = await fetch('https://api.deepgram.com/v1/projects', {
      headers: {
        Authorization: `Token ${deepgramKey}`,
      }
    });
    
    if (!response.ok) {
        throw new Error('Failed to get Deepgram projects');
    }
    const { projects } = await response.json();
    const projectId = projects[0].project_id;
    
    const keyResponse = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/keys`, {
        method: 'POST',
        headers: {
            Authorization: `Token ${deepgramKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            comment: 'FIFA App temporary client key',
            scopes: ['usage:write'],
            time_to_live_in_seconds: 60 * 60 // 1 hour
        })
    });
    
    if (!keyResponse.ok) {
        throw new Error('Failed to create Deepgram key');
    }
    const { key } = await keyResponse.json();
    res.json({ token: key });
  } catch (error) {
    console.error('Deepgram API Error:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Proxy Groq Chat request (Primary LLM)
app.post('/api/groq/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages
      })
    });
    
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: 'Failed to chat with Groq' });
  }
});

// Proxy NIM request (Fallback LLM)
app.post('/api/nim/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NIM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama3-70b-instruct',
        messages,
        max_tokens: 1024
      })
    });
    
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (error) {
    console.error('NIM API Error:', error);
    res.status(500).json({ error: 'Failed to chat with NIM' });
  }
});

// Proxy Sarvam AI request (Fallback Voice)
app.post('/api/sarvam/tts', async (req, res) => {
  try {
    const { inputs, target_language_code } = req.body;
    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'api-subscription-key': process.env.SARVAM_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: Array.isArray(inputs) ? inputs : [inputs],
        target_language_code: target_language_code || "hi-IN",
        speaker: "meera",
        pitch: 0,
        pace: 1.0,
        loudness: 1.5,
        speech_sample_rate: 8000,
        enable_preprocessing: true,
        model: "bulbul:v1"
      })
    });
    
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data); // Returns base64 audio in audios array
  } catch (error) {
    console.error('Sarvam API Error:', error);
    res.status(500).json({ error: 'Failed to generate TTS with Sarvam' });
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback for React Router
app.get(/^(.*)$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack || err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
