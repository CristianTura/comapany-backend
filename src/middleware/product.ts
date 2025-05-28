import { Request, Response, NextFunction  } from "express";
import { body, param, validationResult } from "express-validator";
import Product from '../models/Product';

declare global {
    namespace Express {
        interface Request {
            product?: Product
        }
    }
}

export const validateProductInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('code').notEmpty().withMessage('El codigo no puede ir vacio').run(req)
    await body('name').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await body('descrip').notEmpty().withMessage('La característica no puede ir vacia').run(req)
    await body('amount').notEmpty().withMessage('La cantidad  no puede ir vacia')
            .isNumeric().withMessage('La cantidad no es válida')
            .custom(value => value > 0).withMessage('La cantidad debe ser mayor a 0')
            .run(req)

    next()
}

export const validateProductId = async (req: Request, res: Response, next: NextFunction) => {
    await param('productId').isInt().custom(value => value > 0).withMessage('Id no válido').run(req)

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }
    next()
}

export const validateProductExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params
        const product = await Product.findByPk(productId)

        if(!product){
            const error = new Error ('No se encontró el producto')
            res.status(404).json({error: error.message})
            return
        }
        req.product = product
        next()
    } catch (error) {
        // console.log(error)
        res.status(500).json({error: 'Hubo un error'})
    }
}