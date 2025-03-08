import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import { settings } from './settings'
import logger from './utils/logger/logger'

const app = express()
app.set('trust proxy', true)
app.use(
  cors({
    origin: settings.allowedOrigins.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

app.listen(settings.port, () => {
  logger.info(`Server is running on ${settings.url}:${settings.port}`)
})
