import { Router } from "express";
import { writeFile, readFileSync } from 'fs';

const  route = Router();
const fs = { readFileSync, writeFile };
const products = JSON.parse(readFileSync('./src/products.json', 'utf8'));

const productList = []

//metodo get para obtener todos los productos
route.get('/', (req, res) => {
    res.send('Hello, it´s the device store');
    res.render('index');  
});


//metodo get para obtener un producto especifico por id
route.get('/:pid', (req, res) => {
    res.json(products.find(product => product.id == req.params.pid));
});


//metodo post para agregar productos al carrito
route.post('/:id', (req, res) => {
   

    const producto = products.find(product => product.id == req.params.id);
  
    if (!producto) {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    const index = productList.findIndex(item => item.id === producto.id);

    if (index !== -1) {
      productList[index].quantity++;
    } else {
      productList.push({
        id: producto.id,
        quantity: 1
      });
    }
  
    const productAdded = JSON.stringify(productList, null, 2);
    fs.writeFile('./src/data/products.data.json', productAdded, (err) => {
      if (err) {
        console.error('Error al escribir en el archivo:', err);
        res.status(500).json({ mensaje: 'Error al agregar producto al carrito' });
      } else {
        console.log('Datos escritos correctamente en el archivo.');
        res.json(productList);
      }
    });
});

//metodo put para modificar un producto de products.json 
route.put('/:id', (req, res) => {
    const changes = req.body;
  
    const index = products.findIndex(product => product.id == req.params.id);
    if (index === -1) {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
      return;
    }
  
    const updatedProduct = { ...products[index], ...changes };
    products[index] = updatedProduct;
    console.log(req.body);    
  
    const productAdded = JSON.stringify(products, null, 2);
    fs.writeFile('./src/products.json', productAdded, (err) => {
      if (err) {
        console.error('Error al escribir en el archivo:', err);
        res.status(500).json({ mensaje: 'Error al actualizar producto' });
      } else {
        console.log('Datos escritos correctamente en el archivo.');
        res.json(updatedProduct);
      }
    });
});

//metodo delete para eliminar un producto del carrito
route.delete('/:id', (req, res) => {
    const producto = products.find(product => product.id == req.params.id);
    if (!producto) {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    const index = productList.findIndex(item => item.id === producto.id);
  
    if (index !== -1) {
      if (productList[index].quantity > 1) {
        productList[index].quantity--;
      } else {
        productList.splice(index, 1);
      }
    }
  
    const productAdded = JSON.stringify(productList, null, 2);
    fs.writeFile('./src/data/products.data.json', productAdded, (err) => {
      if (err) {
        console.error('Error al escribir en el archivo:', err);
        res.status(500).json({ mensaje: 'Error al eliminar producto del carrito' });
      } else {
        console.log('Datos escritos correctamente en el archivo.');
        res.json(productList);
      }
    });
});

export default route;
