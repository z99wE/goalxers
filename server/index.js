import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
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
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Vite HMR needs unsafe-inline/eval in dev
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https://*.tile.openstreetmap.org", "https://unpkg.com"],
      connectSrc: ["'self'", "ws:", "wss:"], // WebSockets for Vite HMR
      workerSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// Allow CORS for the frontend on Render and local dev
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like same-origin or curl)
    if (!origin) {
      return callback(null, true);
    }
    // Allow any onrender.com subdomain or local dev
    if (origin.endsWith('.onrender.com') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Fallback for custom domains if set
    if (process.env.FRONTEND_URL === origin) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
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



// Validation Schema for chat messages
const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1).max(2000)
    })
  ).max(20)
});

// Proxy Groq Chat request (Primary LLM)
app.post('/api/groq/chat', async (req, res, next) => {
  try {
    const validated = chatSchema.parse(req.body);
    const { messages } = validated;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
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
    next(error);
  }
});

// Proxy NIM request (Fallback LLM)
app.post('/api/nim/chat', async (req, res, next) => {
  try {
    const validated = chatSchema.parse(req.body);
    const { messages } = validated;
    
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
    next(error);
  }
});



// Serve frontend static files
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback for React Router
app.get(/^(.*)$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Centralized Error Handling Middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
app.use((err, req, res, _next) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: 'Invalid request data', details: err.errors });
  }
  
  // SyntaxError from body-parser (express.json)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Bad JSON payload' });
  }

  console.error('Unhandled Server Error:', err.stack || err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
