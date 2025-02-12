import { Router } from "express";
import fs from 'fs';
import Writer from "../manager.js";

const route = Router();
const manager = new Writer();
const chargedCart = JSON.parse(fs.readFileSync('./src/data/carts.data.json', 'utf8')) || []; 

// Ruta GET para obtener un carrito por su ID
route.get('/:cid', (req, res) => {
  const cid = req.params.cid; // ID del carrito debe ser 123456
  const getProductList = JSON.parse(fs.readFileSync('./src/data/products.data.json', 'utf8'));

  if (cid !== "123456") {
    return res.status(400).json({ mensaje: 'Carrito inválido' });
  }

  const searchPidCart = chargedCart.findIndex(cart => cart.cartID === cid);
  if (searchPidCart === -1) {
    chargedCart.push({ cartID: cid, products: [] });
  }

  const cart = chargedCart.find(cart => cart.cartID === cid);
  getProductList.forEach(article => {
    if (cart.products.some(product => product.id === article.id)) {
      return;
    }
    cart.products.push(article);
    });

  manager.writeDataCart(chargedCart)
    .then(() => {
      res.json(cart); // Devolver el carrito actualizado
    })
    .catch(() => {
      res.status(500).json({ mensaje: 'Error al guardar el carrito' });
    });   
});



// Ruta POST para agregar un producto a un carrito usando sus IDs
route.post('/:cid/producto/:pid', (req, res) => {
  const cid = req.params.cid; // ID del carrito
  const pid = parseInt(req.params.pid); // ID del producto
  const catalog = JSON.parse(fs.readFileSync('./src/products.json', 'utf8'));

  if (cid !== "123456") {
    return res.status(400).json({ mensaje: 'Carrito inválido' });
  }

  if (!catalog.find(product => product.id === pid)) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  if (chargedCart.findIndex(cart => cart.cartID === cid) === -1) {
    chargedCart.push({ cartID: cid, products: [] });
  }

  const cart = chargedCart.find(cart => cart.cartID === cid);
  const existingProductIndex = cart.products.findIndex(product => product.id === pid);
  if (existingProductIndex !== -1) {
    cart.products[existingProductIndex].quantity += 1;
  } else {
    cart.products.push({ id: pid, quantity: 1 });
  }

  manager.writeDataCart(chargedCart)
    .then(() => {
      res.json(cart); // Devolver el carrito actualizado
    })
    .catch(() => {
      res.status(500).json({ mensaje: 'Error al guardar el carrito' });
    });
});


// Ruta DELETE para eliminar un producto del carrito usando su ID (opcional)
route.delete('/:cid/producto/:pid', (req, res) => {
  const cid = req.params.cid; // ID del carrito
  const pid = parseInt(req.params.pid); // ID del producto

  if (cid !== "123456") {
    return res.status(400).json({ mensaje: 'Carrito inválido' });
  }

  const cartIndex = chargedCart.findIndex(cart => cart.cartID === cid);
  if (cartIndex === -1) {
    return res.status(404).json({ mensaje: 'Carrito no encontrado' });
  }

  const cart = chargedCart[cartIndex];
  const productIndex = cart.products.findIndex(product => product.id === pid);
  if (productIndex === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  if (cart.products[productIndex].quantity > 1) {
    cart.products[productIndex].quantity -= 1;
  } else {
    cart.products.splice(productIndex, 1);
  }

  manager.writeDataCart(chargedCart)
    .then(() => {
      res.json(cart); // Devolver el carrito actualizado
    })
    .catch(() => {
      res.status(500).json({ mensaje: 'Error al guardar el carrito' });
    });
});

export default route;

