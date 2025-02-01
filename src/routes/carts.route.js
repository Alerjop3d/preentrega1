import { Router } from "express";
import { writeFile, readFileSync } from 'fs';

const route = Router();
const fs = { readFileSync, writeFile };
const getProductList = JSON.parse(readFileSync('./src/data/products.data.json', 'utf8'));
const catalog = JSON.parse(readFileSync('./src/products.json', 'utf8'));


const chargedCart = [];



// Ruta GET para obtener o crear un carrito y agregar productos
route.get('/:cid', (req, res) => {
  const cid = req.params.cid; // ID del carrito debe ser 123456

  if (cid !== "123456") {
    return res.status(400).json({ mensaje: 'carrito invalido' });
  }

  const articles = getProductList(); 
  const searchPidCart = chargedCart.findIndex(cart => cart.cid === cid);

  if (searchPidCart === -1) {
    chargedCart.push({
      cid: cid,
      products: []
    });
  }

  const cart = chargedCart.find(cart => cart.cid === cid);
  const existingProductIndex = cart.products.findIndex(product => product.id === articles.id);

  if (existingProductIndex !== -1) {
    cart.products[existingProductIndex].quantity += articles.quantity;
  } else {
    cart.products.push(articles);
  }

  const cartAdded = JSON.stringify(chargedCart, null, 2);
  fs.writeFile('./src/data/carts.data.json', cartAdded, (err) => {
    if (err) {
      console.error('Error al escribir en el archivo:', err);
      return res.status(500).json({ mensaje: 'Error al agregar producto al carrito' });
    } else {
      return res.json(chargedCart);
    }
  });
});



// Ruta POST para agregar un producto a un carrito usando sus IDs
route.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid; // ID del carrito
  const pid = parseInt(req.params.pid); // ID del producto

  // Validar si el cid es igual a 123456
  if (cid !== "123456") {
    return res.status(400).json({ mensaje: 'Carrito inválido' });
  }

  // Buscar el producto en la lista de productos
  const searchPid = catalog.find(product => product.id === pid);

  if (!searchPid) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  // Buscar el índice del carrito
  const searchCidCart = chargedCart.findIndex(cart => cart.cid === cid);

  // Si no existe el carrito, crearlo
  if (searchCidCart === -1) {
    chargedCart.push({
      cid: cid,
      products: []
    });
  }

  // Obtener el carrito actual
  const cart = chargedCart.find(cart => cart.cid === cid);

  // Buscar si el producto ya existe en el carrito
  const existingProductIndex = cart.products.findIndex(product => product.id === pid);

  if (existingProductIndex !== -1) {
    // Si el producto existe, incrementar la cantidad
    cart.products[existingProductIndex].quantity += 1;
  } else {
    // Si no existe, agregar el nuevo producto con cantidad 1
    cart.products.push({ id: pid, quantity: 1 });
  }

  // Guardar el carrito actualizado en el archivo
  const cartAdded = JSON.stringify(chargedCart, null, 2);
  fs.writeFile('./src/data/carts.data.json', cartAdded, (err) => {
    if (err) {
      console.error('Error al escribir en el archivo:', err);
      return res.status(500).json({ mensaje: 'Error al agregar producto al carrito' });
    } else {
      return res.json(cart); // Devolver el carrito actualizado
    }
  });
});

export default route;