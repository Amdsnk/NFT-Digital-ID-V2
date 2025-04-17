// Debug endpoint to check environment
export default function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Get environment info
  const env = {
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    vercelRegion: process.env.VERCEL_REGION,
    databaseUrl: process.env.DATABASE_URL ? '[REDACTED]' : undefined,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    // Add system info
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    // Add request info
    method: req.method,
    url: req.url,
    headers: {
      host: req.headers.host,
      origin: req.headers.origin,
      referer: req.headers.referer,
      userAgent: req.headers['user-agent']
    }
  };
  
  // Respond with debug info
  res.status(200).json({
    status: 'ok',
    message: 'Debug endpoint is working',
    timestamp: new Date().toISOString(),
    environment: env
  });
} 