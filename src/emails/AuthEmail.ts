import { transport } from "../config/nodemailer"

type EmailType = {
    name: string
    email: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: "j15@gmail.com",
            to: user.email,
            subject: 'Company - Confirma tu cuenta',
            html: `
                <p>Hola ${user.name}, has creado tu cuenta en Company, ya esta casi lista</p>
                <p>Para confirmar tu cuenta, haz click en el siguiente enlace:</p>
                <a href="#">Confirmar cuenta</a>
                <p>e ingresa el código: <b>${user.token}</b></p>
            `
        })
        console.log(email)
    }

    static sendPasswordResentToken = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: "j15@gmail.com",
            to: user.email,
            subject: 'Company - Reestablece tu password',
            html: `
                <p>Hola ${user.name}, has solicitado reestablecer tu password</p>
                <p>Para confirmar tu cuenta, haz click en el siguiente enlace:</p>
                <a href="#">Reestablecer password</a>
                <p>e ingresa el código: <b>${user.token}</b></p>
            `
        })
    }
}
