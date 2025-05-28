import type { Request, Response } from 'express'
import Product from '../models/Product'

export class ProductController {
    static getAll = async (req : Request, res: Response) => {
        try {
            const products = await Product.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                // limit: 10
            })
            res.json(products)
        } catch (error) {
            // console.log(error)
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static create = async (req: Request, res: Response) => {
        try {
            const product = await Product.create(req.body)
            product.companyId = req.company.id
            await product.save()
            res.status(201).json({message: 'Producto creado correctamente'})
        } catch (error) {
            // console.log(error)
            res.status(500).json({error: 'Hubo un error'})
        }
    }
  
    static getById = (req: Request, res: Response) => {
        try {
            res.json(req.product)
        } catch (error) {
            // console.log(error)
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateById = async (req: Request, res: Response) => {
        await req.product.update(req.body)
        res.json('Producto actualizado correctamente')
    }
  
    static deleteById = async (req: Request, res: Response) => {
        await req.product.destroy()
        res.json('Producto eliminado correctamente')
    }
}