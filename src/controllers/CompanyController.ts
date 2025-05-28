import type { Request, Response } from 'express'
import Company from '../models/Company';
import Product from '../models/Product';

export class CompanyController {
    static getAll = async (req : Request, res: Response) => {
        try {
            const companies = await Company.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                // limit: 10
            })
            res.json(companies)
        } catch (error) {
            // console.log(error)
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static create = async (req : Request, res: Response) => {
        try {
            const company = await Company.create(req.body)
            await company.save()
            res.status(201).json('Empresa creada correctamente')
        } catch (error) {
            // console.log(error)
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getById = async (req : Request, res: Response) => {
        const company = await Company.findByPk(req.company.id, {
            include: [Product]
        })
        res.json(company)
    }

    static updateById = async (req : Request, res: Response) => {
        await req.company.update(req.body)
        res.json('Compañia actualizado correctamente')
    }
    
    static deleteById = async (req : Request, res: Response) => {
        await req.company.destroy()
        res.json('Compañia eliminado correctamente')
    }
}