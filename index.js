import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/route.js';


dotenv.config();
const app = express();


const port = process.env.PORT;
const url = process.env.MONGO_URI;


app.use(cors());
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json({ extended: 'true' }));



app.use('/', router);

app.use('*', (req, res, next) => {
    res.status(404).send('error wala route');
})

app.use((err, req, res, next) => {
    if (err) {
        console.log('printing error in index.js ', err);
        res.status(500).json({ msg: err.message });
    }
})


app.listen(port, () => {

    mongoose.connect(url)
        .then(() => {
            console.log(`server is running at port ${port} and database is connected successfully!`)
        })
        .catch((err) => {
            console.log('database is not connected successfully and the error is: ', err);
        })
});

