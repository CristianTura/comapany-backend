import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db'
import companyRouter from './routes/companyRouter'
import authRouter from './routes/authRouter'
import cors from 'cors';

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.blue.bold('Conexión exitosa  a la BD'))
    } catch (error) {
        console.log(error)
        console.log(colors.red.bold('Falló la conexión a la BD'))
    }
}
connectDB()

const app = express()

app.use(cors());
app.use(morgan('dev'))

app.use(express.json())

app.use('/api/companies', companyRouter)
app.use('/api/auth', authRouter)

export default app