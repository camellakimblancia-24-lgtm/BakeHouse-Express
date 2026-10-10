import express from 'express'
import cors from 'cors'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

// Global middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173', // Vite's default port
    credentials: true,
  })
)
app.use(express.json())

// Health check (public)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// API routes: add one line per module
// app.use('/api/ingredients', ingredientsRoutes)
// app.use('/api/recipes', recipesRoutes)

// These two always go last
app.use(notFound)
app.use(errorHandler)

export default app