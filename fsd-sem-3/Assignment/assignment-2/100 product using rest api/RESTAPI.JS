const express = require('express');
const app = express();

app.use(express.json());

const productNames = [
  'Smartphone', 'Laptop', 'Tablet', 'Smartwatch', 'Bluetooth Speaker',
  'Wireless Earbuds', '4K Monitor', 'Gaming Console', 'Router', 'USB-C Hub',
  'Power Bank', 'Keyboard', 'Mouse', 'Webcam', 'Printer', 'Projector',
  'External SSD', 'Headphones', 'Camera', 'Drone', 'Charger', 'TV',
  'Soundbar', 'Flash Drive', 'Fitness Tracker', 'E-reader', 'Microwave',
  'Air Purifier', 'Vacuum', 'Refrigerator', 'Washing Machine', 'Dishwasher',
  'Smart Thermostat', 'Home Security Camera', 'Wi-Fi Extender', 'Assistant Speaker',
  'Gaming Mouse', 'Mechanical Keyboard', 'Portable Monitor', 'Desktop PC', 'NAS Drive',
  'Docking Station', 'Laser Printer', 'Scanner', 'Graphics Card', 'Processor',
  'Motherboard', 'RAM Kit', 'SSD', 'Hard Drive', 'CPU Cooler', 'Case Fan',
  'PSU', 'Computer Case', 'Monitor Arm', 'Desk Lamp', 'Smart Plug', 'Strip Light',
  'Smart Lock', 'Video Doorbell', 'Robot Vacuum', 'Steam Cleaner', 'Dehumidifier',
  'Heater', 'Fan', 'Air Conditioner', 'Fridge', 'Electric Kettle', 'Coffee Maker',
  'Blender', 'Toaster', 'Rice Cooker', 'Slow Cooker', 'Mixing Console', 'Midi Keyboard',
  'Studio Monitor', 'Microphone', 'Audio Interface', 'Turntable', 'Virtual Reality Headset',
  'Smart Glasses', 'Digital Camera', 'Tripod', 'Lens', 'Action Camera', 'Portable Projector',
  'Bike Light', 'Smart Scale', 'Sleep Tracker', 'Bluetooth Thermometer', 'Satellite Speaker',
  'Home Hub', 'Remote Control', 'Surge Protector', 'USB Wall Charger', 'Wall Mount',
  'Mini PC', 'Gaming Chair', 'Office Chair', 'Standing Desk', 'Laptop Stand', 'Arcade Stick',
  'Gamepad', 'Portable Speaker', 'Desktop Speaker', 'Network Switch', 'Modem', 'Cable Tester',
  '3D Printer', 'Laser Cutter', 'Digital Pen', 'Tablet Stylus', 'Voice Assistant', 'Multiport Adapter'
];

const generateProducts = () =>
  Array.from({ length: 100 }, (_, index) => {
    const name = productNames[index % productNames.length];
    const price = (Math.floor((index + 1) * 19.99) + 150) / 1;
    return {
      id: index + 1,
      name: `${name} ${index + 1}`,
      price: Number(price.toFixed(2)),
      description: `High-quality ${name.toLowerCase()} designed for performance, reliability, and modern electronic convenience.`
    };
  });

let products = generateProducts();

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, price, description } = req.body;

  if (!name || price === undefined || !description) {
    return res.status(400).json({ message: 'Name, price, and description are required' });
  }

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    price: Number(price),
    description
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, price, description } = req.body;

  if (!name || price === undefined || !description) {
    return res.status(400).json({ message: 'Name, price, and description are required' });
  }

  product.name = name;
  product.price = Number(price);
  product.description = description;

  res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
  const initialLength = products.length;
  products = products.filter((item) => item.id !== Number(req.params.id));

  if (products.length === initialLength) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json({ message: 'Product deleted successfully' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Electronic products API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
