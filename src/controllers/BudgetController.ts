import type { Request, Response } from 'express'
import Budget from '../models/Budget'

export class BudgetController {
    static getAll = async (req : Request, res: Response) => {
        console.log('desde busgets')
    }

    static create = async (req : Request, res: Response) => {
        try {
            console.log(req.body)
            const budget = new Budget(req.body)
            await budget.save()
            res.status(201).json({message: 'Presupuesto creado correctamente'})
        } catch (error) {
            // console.log(error)
            res.status(500).json({error: 'hubo un error'})
        }
    }

    static getById = async (req : Request, res: Response) => {
        console.log('desde get one busgets')
    }

    static updateById = async (req : Request, res: Response) => {
        console.log('desde updateById')
    }
    
    static deleteById = async (req : Request, res: Response) => {
        console.log('desde deleteById')
    }
}