import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
// Для ограничения количества запросов
import rateLimit from 'express-rate-limit';
import csrf from 'csurf'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()


app.use(cookieParser())
const csrfProtection = csrf({ cookie: true });

app.use(cors({ origin: process.env.ORIGIN_ALLOW, credentials: true }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true, limit: '100kb' }));
app.use(json({ limit: '100kb' }));

app.options('*', cors())
app.use(
    rateLimit({
        windowMs: 60000, // 1 минута
        limit: 30, // Не более 30 запросов в минуту
        message: 'Слишком много запросов с вашего компьютера, возможно у вас вирус!!!',
        standardHeaders: 'draft-8', // включает поддержку заголовков RateLimit
    })
);

app.use(routes)
app.use(errors())
app.use(errorHandler)

app.get('/auth/csrf-token', csrfProtection, (req, res) => {
    res.send(req.csrfToken());
});

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
