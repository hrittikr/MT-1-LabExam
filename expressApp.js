const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

let vehicles = [
    { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
    { id: 2, vehicleName: "Honda City", vehicleNumber: "DL3CC9876", type: "Sedan", price: 1200000 },
    { id: 3, vehicleName: "Tata Nexon", vehicleNumber: "UP16XY5678", type: "SUV", price: 1300000 }
];

// GET: All vehicles
app.get('/vehicles', (req, res) => {
    res.status(200).json(vehicles);
});

// GET: Vehicle by ID
app.get('/vehicles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
});

// POST: Add new vehicle
app.post('/vehicles', (req, res) => {
    const { id, vehicleName, vehicleNumber, type, price } = req.body;
    if (!id || !vehicleName || !vehicleNumber || !type || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Missing required fields or invalid price' });
    }
    const newVehicle = { id, vehicleName, vehicleNumber, type, price };
    vehicles.push(newVehicle);
    res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
});

// PUT: Update vehicle
app.put('/vehicles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Vehicle not found' });
    }

    const { vehicleName, vehicleNumber, type, price } = req.body;
    if (!vehicleName || !vehicleNumber || !type || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Missing required fields or invalid price' });
    }

    vehicles[index] = { id, vehicleName, vehicleNumber, type, price };
    res.status(200).json({ message: 'Vehicle updated successfully', vehicle: vehicles[index] });
});

// DELETE: Delete vehicle
app.delete('/vehicles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Vehicle not found' });
    }
    const deleted = vehicles.splice(index, 1);
    res.status(200).json({ message: 'Vehicle deleted successfully', vehicle: deleted[0] });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});