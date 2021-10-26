import express from 'express';
import cors from 'cors';
import pool from './db/db';
import auth from './routes/auth';


const app = express();
app.use(cors());
app.use(express.json())


app.use('/api/auth', auth);


pool.connect()
    .then(() => {
        app.listen(5000);
    })
    .then(() => console.log(`Server strated on port 5000`));
