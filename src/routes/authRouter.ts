import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validations";
import { limiter } from "../config/limiter";
import { authenticate } from "../middleware/auth";


const router = Router()

router.use(limiter)

router.post('/create-account',
    body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password').isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('email').isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-acount',
    body('token').notEmpty().isLength({min: 6, max: 6}).withMessage('El token no es válido'),
    handleInputErrors,
    AuthController.confirmAccount)

router.post('/login',
    body('email').isEmail().withMessage('Email no válido'),
    body('password').isLength({min: 8}).withMessage('La contraseña no es válida'),
    handleInputErrors,
    AuthController.login
)

router.post('/forgot-password',
    body('email').isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.fotgotPassword
)

router.post('/validate-token',
    body('token').notEmpty().isLength({min: 6, max: 6}).withMessage('El token no es válido'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/reset-password/:token',
    param('token').notEmpty().isLength({min: 6, max: 6}).withMessage('El token no es válido'),
    body('password').isLength({min: 8}).withMessage('La contraseña no es válida'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

export default router