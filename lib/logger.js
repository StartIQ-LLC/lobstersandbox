import winston from 'winston';
import crypto from 'crypto';

const { combine, timestamp, printf, colorize } = winston.format;

const maskSecrets = (message) => {
  if (typeof message !== 'string') return message;
  return message
    .replace(/sk-[a-zA-Z0-9]{20,}/g, 'sk-***MASKED***')
    .replace(/\b[a-f0-9]{32,}\b/gi, '***MASKED***')
    .replace(/Bearer\s+[^\s]+/gi, 'Bearer ***MASKED***')
    .replace(/password["']?\s*[:=]\s*["']?[^"'\s]+/gi, 'password=***MASKED***')
    .replace(/token["']?\s*[:=]\s*["']?[^"'\s]+/gi, 'token=***MASKED***')
    .replace(/api[_-]?key["']?\s*[:=]\s*["']?[^"'\s]+/gi, 'api_key=***MASKED***');
};

const customFormat = printf(({ level, message, timestamp, requestId, event, ip, path, method, userId }) => {
  const masked = maskSecrets(message);
  const parts = [`[${timestamp}]`, `[${level.toUpperCase()}]`];
  if (requestId) parts.push(`[req:${requestId}]`);
  if (event) parts.push(`[${event}]`);
  if (method && path) parts.push(`${method} ${path}`);
  if (ip) parts.push(`ip:${ip}`);
  if (userId) parts.push(`user:${userId}`);
  parts.push(masked);
  return parts.join(' ');
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
      )
    }),
    new winston.transports.File({
      filename: './data/logs/app.log',
      maxsize: 5242880,
      maxFiles: 5,
      tailable: true
    })
  ]
});

export function generateRequestId() {
  return crypto.randomBytes(8).toString('hex');
}

export function logSecurityEvent(event, details = {}) {
  logger.warn('Security event', { event, ...details });
}

export function logRequest(req, res, next) {
  req.requestId = generateRequestId();
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    logger.log(level, `${res.statusCode} ${duration}ms`, {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      ip: req.ip || req.connection?.remoteAddress,
      userId: req.session?.id
    });
  });
  
  next();
}

export default logger;
