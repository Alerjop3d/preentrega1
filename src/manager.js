import fs from 'fs';

class Writer {
  constructor() {
    this.cartDataPath = './src/data/carts.data.json';
  }

  // Método para escribir datos en el archivo
  writeDataCart(data) {
    return new Promise((resolve, reject) => {
      // Convertir los datos a formato JSON
      const jsonData = JSON.stringify(data, null, 2);

      // Escribir en el archivo
      fs.writeFile(this.cartDataPath, jsonData, (err) => {
        if (err) {
          console.error('Error al escribir en el archivo:', err);
          reject(new Error('Error al escribir archivo .data.json'));
        } else {
          console.log('Datos escritos correctamente en el archivo.');
          resolve(data);
        }
      });
    });
  }
}

export default Writer;