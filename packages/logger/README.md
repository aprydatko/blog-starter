# @blog-starter/logger

A configured Pino logger for the blog-starter monorepo.

## Features

- 🎨 **Pretty printing in development** - Colorized, human-readable logs with timestamps
- 🚀 **Optimized for production** - JSON structured logs for easy parsing
- 🔧 **Environment-based configuration** - Automatically adapts to NODE_ENV
- 📝 **Custom log levels** - Configurable via LOG_LEVEL environment variable
- 🐛 **Enhanced error serialization** - Better error logging with stack traces
- ⏰ **ISO timestamps** - Consistent timestamp formatting

## Installation

This package is part of the monorepo workspace. To use it in another package:

```json
{
  "dependencies": {
    "@blog-starter/logger": "workspace:*"
  }
}
```

## Usage

### Basic Usage

```typescript
import { logger } from '@blog-starter/logger'

// Info level
logger.info('Application started')
logger.info({ userId: 123 }, 'User logged in')

// Warning level
logger.warn('This is a warning')

// Error level
logger.error('Something went wrong')
logger.error(new Error('Database connection failed'), 'DB Error')

// Debug level (only shown if LOG_LEVEL=debug)
logger.debug({ data: { foo: 'bar' } }, 'Debug information')
```

### With Structured Data

```typescript
logger.info({
  userId: '123',
  action: 'login',
  ip: '192.168.1.1'
}, 'User authentication successful')
```

### Error Logging

```typescript
try {
  // Some operation
  throw new Error('Something failed')
} catch (error) {
  logger.error({ err: error }, 'Operation failed')
}
```

## Configuration

### Environment Variables

- **LOG_LEVEL**: Set the minimum log level (default: `info`)
  - Options: `trace`, `debug`, `info`, `warn`, `error`, `fatal`
  
- **NODE_ENV**: Determines output format
  - `development`: Pretty-printed, colorized output
  - `production`: JSON structured logs

### Examples

```bash
# Development with debug logs
LOG_LEVEL=debug NODE_ENV=development npm run dev

# Production
NODE_ENV=production npm start

# Only errors in production
LOG_LEVEL=error NODE_ENV=production npm start
```

## Output Examples

### Development Mode
```
[14:23:45 +02:00] INFO: Application started
    env: "development"
[14:23:46 +02:00] INFO: User logged in
    userId: 123
    env: "development"
```

### Production Mode
```json
{"level":"info","time":"2025-12-03T02:23:45.123Z","env":"production","msg":"Application started"}
{"level":"info","time":"2025-12-03T02:23:46.456Z","env":"production","userId":123,"msg":"User logged in"}
```

## Best Practices

1. **Use structured logging**: Pass objects as the first parameter for better queryability
   ```typescript
   // Good
   logger.info({ userId, action }, 'User action completed')
   
   // Less ideal
   logger.info(`User ${userId} completed ${action}`)
   ```

2. **Log errors properly**: Use the `err` or `error` key for error objects
   ```typescript
   logger.error({ err: error }, 'Operation failed')
   ```

3. **Use appropriate log levels**:
   - `trace`: Very detailed debugging information
   - `debug`: Debugging information
   - `info`: General informational messages
   - `warn`: Warning messages
   - `error`: Error messages
   - `fatal`: Fatal errors that require immediate attention

4. **Don't log sensitive data**: Avoid logging passwords, tokens, or PII

## Dependencies

- `pino`: Fast, low overhead Node.js logger
- `pino-pretty`: Pretty print formatter for development (devDependency)
