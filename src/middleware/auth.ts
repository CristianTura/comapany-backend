import { NextFunction, Response, Request } from "express";
import jwt from 'jsonwebtoken';
import User from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer){
        res.status(401).json({error: 'No autorizado'})
        return
    }

    const [, token] = bearer.split(' ')

    if(!token){
        res.status(401).json({error: 'Token no válido'})
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(typeof decoded === 'object' && decoded.id){
            const user = await User.findByPk(decoded.id,  {
                attributes: ['id', 'name', 'email']
            })
            req.user = user
            next()
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Hubo un error, token no válido'})
    }
}