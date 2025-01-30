import { Router } from "express";
import { writeFile, readFileSync } from 'fs';

const route = Router();
const fs = { readFileSync, writeFile };

//plantilla de carrito
const chargedCart = [];

const getProductList = () => {
    return JSON.parse(readFileSync('./src/data/products.data.json', 'utf8'));}

//metodo get para obtener el carrito con todos los productos
route.get('/:cid', (req, res) => {
  const cid = req.params.cid;
  const articles = getProductList();
  const searchPidCart = chargedCart.findIndex(cart => cart.cid === cid);

  if (chargedCart.length === 0) {
    chargedCart.push({
      cid: cid,
      products: []
      });
  }
  if (searchPidCart !== -1) {
    chargedCart[searchPidCart].products = articles;
  }

    const cartAdded = JSON.stringify(chargedCart, null, 2);
    fs.writeFile('./src/data/carts.data.json', cartAdded, (err) => {
      if (err) {
        console.error('Error al escribir en el archivo:', err);
        res.status(500).json({ mensaje: 'Error al agregar producto al carrito' });
      } else {
        res.json(chargedCart);
      }
    });
});

export default route;