import { NextFunction, Request, Response } from "express"
import { AppError } from "@/utils/AppError"
import { knex } from "@/database/knex"
import { z } from "zod"

class ProductController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {

      const { name } = request.query 

      const products = await knex<ProductRepository>("products")
      .select()
      .whereLike("name", `%${name ?? ""}%`)
      .orderBy("name")

      return response.status(200).json(products)
    } catch (error) {
      next(error)
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0)
      })

      const { name, price } = bodySchema.parse(request.body)

      await knex<ProductRepository>("products").insert({ name, price })

      return response.status(201).json({ name, price })
      
    } catch (error) {
      next (error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z.string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "Invalid ID" })
      .parse(request.params.id)

      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0)
      })

      const { name, price } = bodySchema.parse(request.body)

      const product = await knex<ProductRepository>("products")
      .select()
      .where({ id })
      .first()

      if (!product) {
        throw new AppError("Product not found", 404)
      }

      await knex<ProductRepository>("products")
      .update({ name, price, updated_at: knex.fn.now() })
      .where({ id})

      return response.json()
  
    } catch (error) {
      next(error)
      
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z.string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "Invalid ID" })
      .parse(request.params.id)

      const product = await knex<ProductRepository>("products")
      .select()
      .where({ id })
      .first()

      if(!product) {
        throw new AppError("Product not found", 404)
      }

      await knex<ProductRepository>("products")
      .delete()
      .where({ id })

      return response.json()
    } catch (error) {
      next(error)
      
    }

  }
}

export { ProductController }