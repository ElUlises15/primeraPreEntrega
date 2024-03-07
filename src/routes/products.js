const express = require('express');
const router = express.Router();
const fs = require('fs');

const productsFilePath = './src/products.json';

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

let products = readDataFromFile(productsFilePath);

// Ruta para listar todos los productos
router.get('/', (req, res) => {
    res.json(products);
});

// Ruta para obtener un producto por su id
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = products.find(p => p.id === pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
    const newProduct = req.body;
    if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
        res.status(400).json({ message: 'Todos los campos son obligatorios excepto thumbnails' });
    } else {
        newProduct.id = generateProductId();
        newProduct.status = true;
        products.push(newProduct);
        writeDataToFile(productsFilePath, products); // Guardar datos en el archivo
        res.status(201).json(newProduct);
    }
});

// Ruta para actualizar un producto por su id
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const updatedProduct = req.body;
    const index = products.findIndex(p => p.id === pid);
    if (index !== -1) {
        updatedProduct.id = pid;
        products[index] = updatedProduct;
        writeDataToFile(productsFilePath, products); // Guardar datos en el archivo
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// Ruta para eliminar un producto por su id
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    products = products.filter(p => p.id !== pid);
    writeDataToFile(productsFilePath, products); // Guardar datos en el archivo
    res.json({ message: 'Producto eliminado exitosamente' });
});

// Función para generar un nuevo id de producto
function generateProductId() {
    return Math.random().toString(36).substr(2, 9); // Generar un id al azar
}

module.exports = router;
