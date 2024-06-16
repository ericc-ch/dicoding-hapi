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

  server.route({
    method: "GET",
    path: "/books",
    handler: (request, h) => {
      const { reading, finished, name } = request.query

      let filteredBooks = db.books

      if (reading !== undefined) {
        filteredBooks = filteredBooks.filter(
          (book) => book.reading === (reading === "1"),
        )
      }

      if (finished !== undefined) {
        filteredBooks = filteredBooks.filter(
          (book) => book.finished === (finished === "1"),
        )
      }

      console.log(request.query)

      if (name !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.name.includes(name))
      }

      const simplifiedBooks = filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }))

      const response = {
        status: "success",
        data: {
          books: simplifiedBooks,
        },
      }

      return h.response(response).code(200)
    },
  })

  server.route({
    method: "GET",
    path: "/books/{bookId}",
    handler: (request, h) => {
      const { bookId } = request.params
      const book = db.books.find((b) => b.id === bookId)

      if (!book) {
        const errorResponse = {
          status: "fail",
          message: "Buku tidak ditemukan",
        }
        return h.response(errorResponse).code(404)
      }

      const response = {
        status: "success",
        data: {
          book,
        },
      }

      return h.response(response).code(200)
    },
  })

  server.route({
    method: "PUT",
    path: "/books/{bookId}",
    options: {
      validate: {
        payload: (value) => {
          if (!value.name) {
            throw new Error("Gagal memperbarui buku. Mohon isi nama buku")
          }
          if (value.readPage > value.pageCount) {
            throw new Error(
              "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
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
      const { bookId } = request.params
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

      const index = db.books.findIndex((book) => book.id === bookId)

      if (index === -1) {
        const errorResponse = {
          status: "fail",
          message: "Gagal memperbarui buku. Id tidak ditemukan",
        }
        return h.response(errorResponse).code(404)
      }

      const updatedAt = new Date().toISOString()
      const finished = pageCount === readPage

      db.books[index] = {
        ...db.books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
      }

      const response = {
        status: "success",
        message: "Buku berhasil diperbarui",
      }

      return h.response(response).code(200)
    },
  })

  server.route({
    method: "DELETE",
    path: "/books/{bookId}",
    handler: (request, h) => {
      const { bookId } = request.params
      const index = db.books.findIndex((book) => book.id === bookId)

      if (index === -1) {
        const errorResponse = {
          status: "fail",
          message: "Buku gagal dihapus. Id tidak ditemukan",
        }
        return h.response(errorResponse).code(404)
      }

      db.books.splice(index, 1)

      const response = {
        status: "success",
        message: "Buku berhasil dihapus",
      }

      return h.response(response).code(200)
    },
  })
}
