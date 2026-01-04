import jwt from 'jsonwebtoken'
import { AppError } from '../utils/errorHandler.mjs'

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : null;

    if(!token) {
        return next(new AppError('You are not logged in. Please authenticate', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-prod'); //REMOVE WHEN OUT OF PROD
        req.user = decoded;
        next();
    } catch(err) {
        return next(new AppError('Token expired', 401));
    }
}