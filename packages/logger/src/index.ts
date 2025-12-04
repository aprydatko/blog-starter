import pino from 'pino'
import pretty from 'pino-pretty'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Create a pretty stream for development (Next.js compatible)
// Using pretty() as a destination instead of transport avoids worker thread issues
const stream = isDevelopment
    ? pretty({
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
    })
    : process.stdout

// Pino logger configuration with pino-pretty support
export const logger = pino(
    {
        level: process.env.LOG_LEVEL || 'info',

        // Add timestamp to each log
        timestamp: pino.stdTimeFunctions.isoTime,

        // Include the environment as a base field in every log
        base: {
            env: process.env.NODE_ENV || 'development'
        }
    },
    stream
)
