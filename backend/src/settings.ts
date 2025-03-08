import { ISettings } from './interfaces/settings'
import dotenv from 'dotenv'

function parseBoolean(variable: any, defaultValue: boolean): boolean {
  return variable === undefined ? defaultValue : variable.toLowerCase() === 'true'
}
dotenv.config()

const getSettings = (): ISettings => {
  return {
    allowedOrigins: String(process.env.ALLOWED_ORIGINS ?? 'http://localhost:3001'),
    fileLogging: parseBoolean(process.env.FILE_LOGGING, true),
    fileErrorLogging: parseBoolean(process.env.FILE_ERROR_LOGGING, true),
    port: parseInt(process.env.PORT ?? '3001'),
    url: String(process.env.URL ?? 'http://localhost'),
  }
}

export const settings = getSettings()
