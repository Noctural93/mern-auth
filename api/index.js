import express from 'express'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log(err)
})

const __dirname = path.resolve();

const app = express();

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server is listening on port 3000!');
});


app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);


app.use((err, request, response, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return response.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});