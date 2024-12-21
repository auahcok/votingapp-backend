import pino from 'pino';
import pinohttpLogger from 'pino-http';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export const httpLogger = pinohttpLogger({ logger: logger });

export default logger;

// const logger = {
//   info: (message: string, ...optionalParams: unknown[]) => {
//     console.log(`INFO: ${message}`, ...optionalParams);
//   },
//   error: (message: string, ...optionalParams: unknown[]) => {
//     console.error(`ERROR: ${message}`, ...optionalParams);
//   },
//   warn: (message: string, ...optionalParams: unknown[]) => {
//     console.warn(`WARN: ${message}`, ...optionalParams);
//   },
//   debug: (message: string, ...optionalParams: unknown[]) => {
//     console.debug(`DEBUG: ${message}`, ...optionalParams);
//   },
// };

// export default logger;
