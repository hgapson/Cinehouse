import dotenv from 'dotenv'
import server from './server.ts'

dotenv.config()

const port = Number(process.env.PORT) || 3000

server.listen(port, () => {
  console.log('Server listening on port', port)
})
