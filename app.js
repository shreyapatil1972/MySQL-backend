const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const brandRoute = require('./routes/brandRoute.js');
const productRoute = require('./routes/productRoute.js')
const categoryRoute = require('./routes/categoryRoute.js')
const userRoute = require('./routes/userRoute.js')

const app = express();


app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000;

app.get('/', (req, res) => res.send('Hello World'));
app.use('/api/brand', brandRoute);
app.use('/api/product',productRoute)
app.use('/api/category',categoryRoute)
app.use('/api/user', userRoute)


app.listen(port, () => console.log(`Server running on port ${port}`));

//https://localhost:7000/api/