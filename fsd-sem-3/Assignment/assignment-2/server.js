const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// 100 products
let products = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (i + 1) * 100,
    category: ["Electronics", "Clothing", "Books", "Home"][i % 4],
    inStock: true
}));

// Welcome route
app.get("/", (req, res) => {
    res.send("Welcome to the Product REST API");
});

// Get all products
app.get("/products", (req, res) => {
    res.json({
        total: products.length,
        products
    });
});

// Get product by ID
app.get("/products/:id", (req, res) => {
    const product = products.find(
        p => p.id === Number(req.params.id)
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});

// Add a product
app.post("/products", (req, res) => {
    const { name, price, category } = req.body;

    if (!name || typeof price !== "number" ||
        price < 0 || !category) {
        return res.status(400).json({
            message: "Name, valid price and category are required"
        });
    }

    const newProduct = {
        id: products.length
            ? Math.max(...products.map(p => p.id)) + 1
            : 1,
        name,
        price,
        category,
        inStock: true
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});

// Update a product
app.put("/products/:id", (req, res) => {
    const product = products.find(
        p => p.id === Number(req.params.id)
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const { name, price, category, inStock } = req.body;

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (inStock !== undefined) product.inStock = inStock;

    res.json(product);
});

// Delete a product
app.delete("/products/:id", (req, res) => {
    const index = products.findIndex(
        p => p.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const deletedProduct = products.splice(index, 1)[0];

    res.json({
        message: "Product deleted successfully",
        product: deletedProduct
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});