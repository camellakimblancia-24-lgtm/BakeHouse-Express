import 'dotenv/config' // must be first so env vars are loaded before anything else
import app from './app.js'

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})