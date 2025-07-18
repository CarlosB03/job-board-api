import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { generateToken } from '../utils/jwt.js'
const prisma = new PrismaClient();

export const register = async (req, res) => {
    try {
        const {email, password, role} = req.body

        if(!email || !password || !role) return res.status(400).json({error: "ERROR: Please fill all fields"});

        const existingUser = await prisma.user.findUnique({where: {email}});
        if(existingUser) return res.status(409).json({error: "An account with this email already exists."});

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {email, password: hashed, role},
        });

        const token = generateToken(user);
        res.json({user: {id: user.id, email: user.email, role: user.role}, token});
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({message: "Server error", details: error.message});
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        const user = await prisma.user.findUnique({where: {email}});
        if(!user) return res.status(401).json({message: 'Invalid credentials'})

        const valid = await bcrypt.compare(password, user.password);
        if(!valid) return res.status(401).json({message: 'Invalid credentials'});

        const token = generateToken(user);
        res.json({user: {id: user.id, email: user.email, role: user.role}, token});
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }

};