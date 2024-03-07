
const express = require('express');
const router = express.Router();
const fs = require('fs');

const cartsFilePath = './src/carts.json';

// Función para leer datos desde un archivo JSON
function readDataFromFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si ocurre un error al leer el archivo, retorna un array vacío
        return [];
    }
}

// Función para escribir datos en un archivo JSON
function writeDataToFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

let carts = readDataFromFile(cartsFilePath);

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
    const newCart = req.body;
    if (!newCart.products) {
        res.status(400).json({ message: 'El campo products es obligatorio' });
    } else {
        newCart.id = generateCartId();
        carts.push(newCart);
        writeDataToFile(cartsFilePath, carts); // Guardar datos en el archivo
        res.status(201).json(newCart);
    }
});

// Ruta para listar los productos de un carrito por su id
router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = carts.find(c => c.id === cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
});

// Ruta para agregar un producto a un carrito por su id
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const cartIndex = carts.findIndex(c => c.id === cid);
    if (cartIndex !== -1) {
        const productIndex = carts[cartIndex].products.findIndex(p => p.product === pid);
        if (productIndex !== -1) {
            carts[cartIndex].products[productIndex].quantity++;
        } else {
            carts[cartIndex].products.push({ product: pid, quantity: 1 });
        }
        writeDataToFile(cartsFilePath, carts); // Guardar datos en el archivo
        res.status(201).json(carts[cartIndex]);
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
});

// Función para generar un nuevo id de carrito
function generateCartId() {
    return Math.random().toString(36).substr(2, 9); // Generar un id al azar
}

module.exports = router;
