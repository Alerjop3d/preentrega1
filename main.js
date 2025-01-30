import express from 'express';
import ProductsRoute from './src/routes/products.route.js';
import CartsRoute from './src/routes/carts.route.js'

const app = express();

app.use(express.json());
app.use('/api/products/', ProductsRoute)
app.use('/api/carts/', CartsRoute)

app.listen(8080, ()=>{
    console.log('Servidor ON en puerto 8080')
})