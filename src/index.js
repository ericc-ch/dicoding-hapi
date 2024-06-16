import { registerRoutesBooks } from "./routes/books.js"
import { server } from "./server.js"

const init = async () => {
  registerRoutesBooks()

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
