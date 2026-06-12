const express= require('express');
const cors= require('cors');
const dotenv= require('dotenv');
const connectDB= require('./config/db');
const logger = require('./utils/logger');
const authRoutes = require('./api/v1/routes/authRoutes');
const taskRoutes = require('./api/v1/routes/taskRoutes');

dotenv.config();

connectDB();

const app= express()

app.use(cors())
app.use(express.json())

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/tasks', taskRoutes);

app.get('/',(req,res)=>{
res.status(200).json({ status: "healthy", message: "Server is running smoothly" })
})

const PORT= process.env.PORT || 5000

app.listen(PORT, () => {
    logger.info(`Server initialized in ${process.env.NODE_ENV} mode running on port ${PORT}`);
});

