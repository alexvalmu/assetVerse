const express = require('express');
const dotenv =  require('dotenv');
const { urlencoded } = require('body-parser');
const {errorHandler} = require('./middlewares/errorMiddlewares.js');

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));



app.listen(port, () => console.log(`server is running on port: ${port}`));
app.use(errorHandler);
app.use('/api/assets', require('./routes/assetsRoutes'));


//usar npm run server para correr el servidor