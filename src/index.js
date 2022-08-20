import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import routes from './routes/index.js';

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URL, error => {
    if(error) throw error;
    console.log('Connected to mongodb successfully.')
})

app.use(cors());
app.use(express.json({limit: '30mb'}));
app.use(express.urlencoded({limit:'30mb', extended: true}));

app.get('/', (req, res) => {
    res.send('<h1>Hello word.</h1>');
})
app.use('/api', routes);

app.listen(process.env.PORT || 5000, ()=> {
    console.log('Server is running on port', + PORT);
});