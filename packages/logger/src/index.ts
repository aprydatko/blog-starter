import pino from 'pino'

const isDevelopment = process.env.NODE_ENV !== 'production'

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',

    // Pretty print in development for better readability
    transport: isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname'
            }
        }
        : undefined,

    // Production configuration
    formatters: {
        level: (label) => {
            return { level: label }
        }
    },

    // Add timestamp to all logs
    timestamp: pino.stdTimeFunctions.isoTime,

    // Custom serializers for better error logging
    serializers: {
        err: pino.stdSerializers.err,
        error: pino.stdSerializers.err
    },

    // Base fields to include in every log
    base: {
        env: process.env.NODE_ENV || 'development'
    }
})
