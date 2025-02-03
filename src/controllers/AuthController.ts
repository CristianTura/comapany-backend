import type { Request, Response } from 'express'
import User from '../models/User'
import { comparePassword, hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'
import { generateJwt } from '../utils/jwt'


export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        const { email, password } = req.body
        const userExists = await User.findOne({ where: { email } })
        if(userExists){
            const error = new Error('El email ya está en uso')
            res.status(409).json({error: error.message})
            return
        }

        try {
            const user = new User(req.body)
            user.password = await hashPassword(password)
            user.token = generateToken()
            await user.save()
            await AuthEmail.sendConfirmationEmail({name: user.name, email: user.email, token: user.token})
            res.json({message: 'Cuenta creada correctamente'})
        } catch (error) {
            // console.log(error)
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        const { token } = req.body
        const user = await User.findOne({ where: { token } })
        if(!user){
            const error = new Error('El token no es válido')
            res.status(401).json({error: error.message})
            return
        }

        try {
            user.confirmed = true
            user.token = null
            await user.save()
            res.json({message: 'Cuenta confirmada'})
        } catch (error) {
            // console.log(error)
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if(!user){
            const error = new Error('El usuario no existe')
            res.status(409).json({error: error.message})
            return
        }

        if(!user.confirmed){
            const error = new Error('La cuenta no está confirmada')
            res.status(403).json({error: error.message})
            return
        }
        
        const isValid = await comparePassword(password, user.password)

        if(!isValid){
            const error = new Error('La contraseña no es correcta')
            res.status(401).json({error: error.message})
            return
        }
        const token = generateJwt(user.id)
        res.json(token)
    }

    static fotgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body
        const user = await User.findOne({ where: { email } })
        if(!user){
            const error = new Error('El usuario no existe')
            res.status(409).json({error: error.message})
            return
        }
        user.token = generateToken()
        await user.save()
        await AuthEmail.sendPasswordResentToken({name: user.name, email: user.email, token: user.token})
        res.json('Revisa tu email para instrucciones')
    }

    static validateToken = async (req: Request, res: Response) => {
        const { token } = req.body
        const tokeExists = await User.findOne({ where: { token } })
        if(!tokeExists){
            const error = new Error('El token no es válido')
            res.status(404).json({error: error.message})
            return
        }

        res.json({message: 'token válido...'})
    }

    static resetPasswordWithToken = async (req: Request, res: Response) => {
        const { token } = req.params
        const { password } = req.body

        const user = await User.findOne({ where: { token } })
        if(!user){
            const error = new Error('El token no es válido')
            res.status(404).json({error: error.message})
            return
        }

        user.password = await hashPassword(password)
        user.token = null
        await user.save()
        res.json({message: 'El password se modificó correctamente'})
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user)
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body
        const user = await User.findByPk(req.user.id)

        const isPasswordCorrect = await comparePassword(current_password, user.password)

        if(!isPasswordCorrect){
            const error = new Error('La contraseña actual no es correcta')
            res.status(401).json({error: error.message})
            return
        }

        user.password = await hashPassword(password)
        await user.save()

        res.json({message: 'Contraseña actualizada correctamente'})
    }

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body
        const user = await User.findByPk(req.user.id)

        const isPasswordCorrect = await comparePassword(password, user.password)

        if(!isPasswordCorrect){
            const error = new Error('La contraseña no es correcta')
            res.status(401).json({error: error.message})
            return
        }

        res.json({message: 'La contraseña es correcta'})
    }

}