import express from 'express';
import { prisma } from '../services/db.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Adăugat pentru securitate

const router = express.Router();

// Înregistrare Profesor (Nou)
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const teacher = await prisma.teacher.create({
            data: { email, name, password: hashedPassword }
        });
        res.status(201).json({ success: true, message: "Cont creat" });
    } catch (e) { res.status(400).json({ error: "Email deja existent" }); }
});

// Login Profesor (Actualizat cu Bcrypt)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const teacher = await prisma.teacher.findUnique({ where: { email } });

    if (teacher && await bcrypt.compare(password, teacher.password)) {
        const token = jwt.sign(
            { id: teacher.id, email: teacher.email },
            process.env.JWT_SECRET || 'jwt_secret_key',
            { expiresIn: '2h' }
        );
        return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, message: 'Date incorecte' });
});

export default router;