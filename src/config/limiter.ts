import { rateLimit } from "express-rate-limit"

export const limiter =
    rateLimit({
        windowMs: 60 * 1000,
        limit: process.env.NODE_ENV == 'production' ? 100 : 120,
        message: {"error" : 'Demasiadas peticiones, intenta luego.'}
    })
