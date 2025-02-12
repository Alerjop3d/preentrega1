import express from 'express';
import ProductsRoute from './src/routes/products.route.js';
import CartsRoute from './src/routes/carts.route.js'

const app = express();

app.use(express.json());
app.use('/api/productos/', ProductsRoute)
app.use('/api/carrito/', CartsRoute)

app.listen(8080, ()=>{
    console.log('Servidor ON en puerto 8080')
})