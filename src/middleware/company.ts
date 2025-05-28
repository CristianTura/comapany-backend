import { Request, Response, NextFunction  } from "express";
import { body, param, validationResult } from "express-validator";
import Company from "../models/Company";

declare global {
    namespace Express {
        interface Request {
            company?: Company
        }
    }
}

export const validateCompanyId = async (req: Request, res: Response, next: NextFunction) => {
    await param('companyId').isInt().withMessage('Id no válido').bail()
                    .custom(value => value > 0).withMessage('El Id no es válido').bail()
                    .run(req)

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }
    next()
}

export const validateCompanyExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyId } = req.params
        const company = await Company.findByPk(companyId)

        if(!company){
            const error = new Error ('No se encontró la empresa')
            res.status(404).json({error: error.message})
            return
        }
        req.company = company
        next()
    } catch (error) {
        // console.log(error)
        res.status(500).json({error: 'Hubo un error'})
    }
}

export const validateCompanyInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('nit').notEmpty().withMessage('El Nit de la empresa no puede ir vacio').run(req)
    await body('name').notEmpty().withMessage('El nombre de la empresa no puede ir vacio').run(req)
    next()
}

// export const hasAccess = (req: Request, res: Response, next: NextFunction) => {
//     if(req.company.userId !== req.user.id){
//         const error = new Error('No tienes acceso a este presupuesto')
//         res.status(401).json({error: error.message})
//         return
//     }
//     next()
// }
