const path = require('path');
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

app.use('/api/assets', require('./routes/assetsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if(process.env.NODE_ENV === 'production'){
   app.use(express.static(path.join(__dirname, '../frontend/build')));
   app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')));
}else{
    app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);
app.listen(port, () => console.log(`server is running on port: ${port}`));


//preparando para deployment



//usar npm run server para correr el servidorapp.use('/api/users', require('./routes/userRoutes'));