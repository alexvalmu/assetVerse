const express = require('express');
const colors = require('colors');
const dotenv =  require('dotenv');
const { urlencoded } = require('body-parser');
const {errorHandler} = require('./middlewares/errorMiddlewares');
const connectDB = require('./config/db');
const { connect } = require('mongoose');

dotenv.config();
const port = process.env.PORT || 5000;


connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));



app.listen(port, () => console.log(`server is running on port: ${port}`));
app.use(errorHandler);
app.use('/api/assets', require('./routes/assetsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));


//usar npm run server para correr el servidor