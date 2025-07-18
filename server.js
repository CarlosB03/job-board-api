import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/userRoutes.js'
import jobRoutes from './routes/jobsRoutes.js'
import cors from 'cors'
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes)


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})
