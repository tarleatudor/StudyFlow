import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { Server } from 'socket.io'

import activityRoutes from './routes/activityRoutes.mjs'
import feedbackRoutes from './routes/feedbackRoutes.mjs'
import authRoutes from './routes/authRoutes.mjs'

import { initSocket } from './services/socketService.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: `${process.env.VITE_API_URL}`,
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});

// middlewares
app.use(cors({
    origin: `${process.env.VITE_API_URL}`,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}))

initSocket(io);
app.set('io', io);

app.use(express.json())

app.use('/api/activities', activityRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);


// health & status check for server
app.get('/health', (req, res) => {
    res.json({status: 'ok', uptime: process.uptime()});
});

// middleware for 404 routes
app.use((req, res, next) => {
    const err = new Error('Resource could not be found');
    err.statusCode = 404;
    next(err);
})

// catch all server-side errors middleware
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Unexpected internal server error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined //print stack trace only in dev mode
    });
});

server.listen(PORT, () => {
    console.log(`Server started running at port ${PORT}`);
})

export default app;