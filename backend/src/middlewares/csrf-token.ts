import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf';
import { Request } from 'express'

const getSecret = () => 'НикомуНичегоНеСкажу';

const getSessionIdentifier = (req: Request) => `${req.ip}|${req.get('User-Agent')}`;

const getCsrfTokenFromRequest = (req: Request) => req.body?.csrfToken || req.headers['x-csrf-token'];

const csrfConfig: DoubleCsrfConfigOptions = {
    getSecret,
    getSessionIdentifier,
    getCsrfTokenFromRequest,
    cookieName: '_csrf',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    }
};

const { doubleCsrfProtection: csrfProtection, generateCsrfToken } = doubleCsrf(csrfConfig);
export { csrfProtection, generateCsrfToken }
