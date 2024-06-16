import { nanoid } from "nanoid"
import { db } from "../db.js"
import { server } from "../server.js"

export function registerRoutesBooks() {
  server.route({
    method: "POST",
    path: "/books",
    options: {
      validate: {
        payload: (value) => {
          if (!value.name) {
            throw new Error("Gagal menambahkan buku. Mohon isi nama buku")
          }
          if (value.readPage > value.pageCount) {
            throw new Error(
              "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
            )
          }
          return value
        },
        failAction: (_, h, err) => {
          const errorResponse = {
            status: "fail",
            message: err.message,
          }
          return h.response(errorResponse).code(400).takeover()
        },
      },
    },
    handler: (request, h) => {
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload

      const id = nanoid()
      const insertedAt = new Date().toISOString()
      const updatedAt = insertedAt
      const finished = pageCount === readPage

      const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      }

      db.books.push(newBook)

      const response = {
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      }

      return h.response(response).code(201)
    },
  })
}
