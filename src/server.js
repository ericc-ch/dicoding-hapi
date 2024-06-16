import Hapi from "@hapi/hapi"

export const server = Hapi.server({
  port: 9000,
  host: "localhost",
})
