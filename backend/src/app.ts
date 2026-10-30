import express from 'express'
import cors from 'cors'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import authRoutes from './modules/auth/auth.routes.js'
import ingredientsRoutes from './modules/ingredients/ingredients.routes.js'
import recipesRoutes from './modules/recipes/recipes.routes.js'
import productsRoutes from './modules/products/products.routes.js'
import ordersRoutes from './modules/orders/orders.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'
import suppliersRoutes from './modules/suppliers/suppliers.routes.js'
import inventoryRoutes from './modules/inventory/inventory.routes.js'

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
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/ingredients', ingredientsRoutes)
app.use('/api/recipes', recipesRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/suppliers', suppliersRoutes)
app.use('/api/inventory', inventoryRoutes)

// These two always go last
app.use(notFound)
app.use(errorHandler)

export default app